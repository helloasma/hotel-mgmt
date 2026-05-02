const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    // Initialize model - using gemini-2.5-flash which is free tier compatible
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Build chat history in correct format
    const chatHistory = (history || []).map(msg => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts: [{ text: msg.content }]
    }));

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // System context - prepend to user message
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

    // Send user message
    const result = await chat.sendMessage(contextMessage);
    
    // Extract reply text
    const reply = result.response.text();
    
    res.json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err);
    console.error("Error message:", err.message || err);
    res.status(500).json({ error: "AI service unavailable", details: err.message });
  }
});

module.exports = router;