const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS = ["gemini-2.0-flash"];

async function sendWithRetry(modelName, chatHistory, contextMessage, retries = 3) {
  const model = genAI.getGenerativeModel({ model: modelName });
  const chat = model.startChat({
    history: chatHistory,
    generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
  });

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await chat.sendMessage(contextMessage);
      return result.response.text();
    } catch (err) {
      const isRateLimit = err.status === 429;
      const isLastAttempt = attempt === retries - 1;

      if (!isRateLimit || isLastAttempt) throw err;

      const retryAfterMs = parseRetryDelay(err) || (2 ** attempt) * 2000;
      await new Promise(resolve => setTimeout(resolve, retryAfterMs));
    }
  }
}

function parseRetryDelay(err) {
  try {
    const retryInfo = err.errorDetails?.find(d => d["@type"]?.includes("RetryInfo"));
    if (retryInfo?.retryDelay) {
      return parseFloat(retryInfo.retryDelay) * 1000;
    }
  } catch (_) {}
  return null;
}

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    const chatHistory = (history || []).map(msg => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts: [{ text: msg.content }]
    }));

    const systemContext = `You are Lova, a helpful concierge for Lovender Hotel. Help guests with room inquiries, bookings, and amenities. Be warm, professional, and concise. Keep responses brief and friendly.

IMPORTANT: Format responses naturally without markdown symbols like **, --, or ##. Use clear sentences and line breaks instead.

ROOMS AT LOVENDER:

1. Overwater Bungalow Standard — $520 per night — Oceanfront Lagoon View
   A calm overwater bungalow with natural textures, warm woods, privacy, and uninterrupted ocean views.

2. Overwater Bungalow Suite — $720 per night — Panoramic Lagoon View
   A spacious and refined overwater suite designed for comfort, privacy, and a more exclusive island stay.

3. Forest Cabin Standard — $480 per night — Forest View
   A peaceful cabin surrounded by nature, with large windows, soft tones, and warm wood textures.

4. Forest Cabin Suite — $650 per night — Forest View
   A larger forest retreat with more space, multiple living areas, and elevated comfort.

5. Mountain Hotel Suite — $520 per night — Mountain View
   A refined mountain suite with extra space, privacy, and a strong connection to the surrounding landscape.

6. Mountain Hotel Deluxe — $340 per night — Mountain View
   A clean, modern room with natural light, scenic mountain surroundings, and understated luxury.

7. Sunset Honeymoon Retreat — $550 per night — Sunset View
   A romantic retreat for two with a four-poster bed, private balcony, champagne service, and couples' spa access.

8. Classic Standard Room — $180 per night — Ocean View
   A simple, comfortable room with a calm design, ideal for guests who want practical luxury and ocean views.

BOOKING INSTRUCTIONS:
When guests ask to book or make a reservation, direct them to:
1. Sign in to their account
2. Go to the Rooms section from the navbar
3. Choose their desired room
4. Complete the booking process

Be helpful, knowledgeable, and encourage guests to explore all room options.`;
    const contextMessage = `[System Context: ${systemContext}]\n\nUser query: ${message}`;

    let reply = null;
    let lastErr = null;

    for (const modelName of MODELS) {
      try {
        reply = await sendWithRetry(modelName, chatHistory, contextMessage);
        break;
      } catch (err) {
        lastErr = err;
        if (err.status !== 429) break;
      }
    }

    if (reply !== null) {
      return res.json({ reply });
    }

    console.error("Gemini API error:", lastErr);
    if (lastErr?.status === 429) {
      return res.status(503).json({
        error: "Lova is currently unavailable due to high demand. Please try again in a few minutes.",
      });
    }
    res.status(500).json({ error: "AI service unavailable", details: lastErr?.message });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "AI service unavailable", details: err.message });
  }
});

module.exports = router;