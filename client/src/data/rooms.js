import roomOceanSuite from "../assets/room-ocean-suite.jpg";
import roomGardenDeluxe from "../assets/room-garden-deluxe.jpg";
import roomPenthouse from "../assets/room-penthouse.jpg";
import roomFamilySuite from "../assets/room-family-suite.jpg";
import roomHoneymoon from "../assets/room-honeymoon.jpg";
import roomStandard from "../assets/room-standard.jpg";

export const rooms = [
  {
    id: "ocean-suite",
    title: "Ocean View Suite",
    price: 320,
    shortDescription: "Wake up to endless blue horizons and a private balcony.",
    description:
      "The Ocean View Suite surrounds you with soft natural textures, calming tones, and uninterrupted views of the sea. Enjoy a king-size bed, a spacious lounge corner, a soaking tub, and floor-to-ceiling glass that invites in every sunrise.",
    image: roomOceanSuite,
    amenities: ["King Bed", "Private Balcony", "Free WiFi", "Smart TV", "Mini Bar", "Ocean View Bath"],
    maxGuests: 2,
    size: "58 m²",
  },
  {
    id: "garden-deluxe",
    title: "Garden Deluxe Room",
    price: 240,
    shortDescription: "A peaceful retreat wrapped in greenery and filtered sunlight.",
    description:
      "Perfect for guests who prefer quiet luxury, the Garden Deluxe Room opens toward tropical greenery and offers a warm, intimate atmosphere. Elegant timber accents, a rain shower, and a cozy reading corner make it ideal for slow mornings and restful nights.",
    image: roomGardenDeluxe,
    amenities: ["Queen Bed", "Garden Terrace", "Free WiFi", "Rain Shower", "Coffee Station", "Work Desk"],
    maxGuests: 2,
    size: "42 m²",
  },
  {
    id: "skyline-penthouse",
    title: "Skyline Penthouse",
    price: 560,
    shortDescription: "Top-floor indulgence with panoramic views and generous space.",
    description:
      "Our Skyline Penthouse is designed for guests who want the most elevated stay possible. From the expansive lounge to the private dining area and oversized terrace, every corner is crafted to feel exclusive, spacious, and effortlessly refined.",
    image: roomPenthouse,
    amenities: ["Private Terrace", "King Bed", "Dining Area", "Lounge", "Premium Bar", "Panoramic Windows"],
    maxGuests: 4,
    size: "96 m²",
  },
  {
    id: "family-suite",
    title: "Family Suite",
    price: 390,
    shortDescription: "Spacious comfort designed for unforgettable group stays.",
    description:
      "Created for families and small groups, the Family Suite blends practicality with boutique comfort. Multiple sleeping areas, extra storage, and a welcoming shared lounge provide a calming environment for both rest and play. Connecting rooms are available upon request.",
    image: roomFamilySuite,
    amenities: ["Separate Living Area", "King + Twin Beds", "Free WiFi", "Air Conditioning", "Safe", "Crib Available"],
    maxGuests: 5,
    size: "72 m²",
  },
  {
    id: "honeymoon-retreat",
    title: "Sunset Honeymoon Retreat",
    price: 480,
    shortDescription: "Romance and golden sunsets from your private balcony.",
    description:
      "Designed for celebrating love, the Honeymoon Retreat features a four-poster bed draped in sheer fabrics, a private balcony capturing breathtaking sunsets over the water, and romantic touches throughout — from rose arrangements to champagne on arrival.",
    image: roomHoneymoon,
    amenities: ["Sunset Balcony", "Four-Poster Bed", "Free WiFi", "Champagne", "Couples Spa Access", "Petal Turndown"],
    maxGuests: 2,
    size: "60 m²",
  },
  {
    id: "standard-room",
    title: "Classic Standard Room",
    price: 170,
    shortDescription: "Clean, calm comfort with warm wood finishes.",
    description:
      "Our Classic Standard Room is designed for guests who want elegant simplicity. Expect plush bedding, clean lines, warm timber finishes, and a practical workspace that makes every short stay feel easy and comfortable.",
    image: roomStandard,
    amenities: ["Queen Bed", "Free WiFi", "Smart TV", "Workspace", "Rain Shower", "Coffee Station"],
    maxGuests: 2,
    size: "35 m²",
  },
];

export const getRoomById = (id) => rooms.find((room) => room.id === id);