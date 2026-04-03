// EXISTING IMAGES
import roomPenthouse from "../assets/room-penthouse.jpg";
import roomFamilySuite from "../assets/room-family-suite.jpg";
import roomHoneymoon from "../assets/room-honeymoon.jpg";
import roomStandard from "../assets/room-standard.jpg";

// NEW BUNGALOW IMAGES
import bungalowRoom from "../assets/bungalow-room.jpg";
import bungalowBathroom from "../assets/bungalow-bathroom.jpg";
import bungalowOutside from "../assets/bungalow-outside.jpg";

import bungalowRoomSuite from "../assets/bungalow-room-suite.jpg";
import bungalowBathroomSuite from "../assets/bungalow-bathroom-suite.jpg";
import bungalowOutsideSuite from "../assets/bungalow-outside-suite.jpg";

export const rooms = [
  {
    id: "overwater-bungalows",
    title: "Overwater Bungalows",
    price: 520,
    shortDescription:
      "Wake up above crystal-clear water with direct ocean access and uninterrupted island views.",
    description:
      "Suspended above turquoise waters, the Overwater Bungalows redefine serene luxury. Floor-to-ceiling glass frames endless ocean horizons, while a private deck invites you to step directly into the lagoon. Inside, warm wood textures, soft linens, and curated island décor create a tranquil retreat. The spa-inspired bathroom features a freestanding soaking tub overlooking the sea, turning every moment into a quiet escape.",
    image: bungalowRoom,
    images: [bungalowRoom, bungalowBathroom, bungalowOutside],
    amenities: [
      "Private Ocean Deck",
      "Direct Water Access",
      "Freestanding Soaking Tub",
      "Panoramic Windows",
      "Premium Linen",
      "Smart TV",
      "Mini Bar",
      "Room Service",
    ],
    maxGuests: 2,
    size: "75 m²",
    occupancy: "Maximum Occupancy: 2 Adults",
    bed: "1 King Bed",
    view: "Oceanfront Lagoon View",
    guests: "2 Guests",
  },

  {
    id: "overwater-bungalows-suite",
    title: "Overwater Bungalows Suite",
    price: 720,
    shortDescription:
      "An expansive overwater suite with elevated privacy, luxury finishes, and panoramic lagoon views.",
    description:
      "The Overwater Bungalows Suite offers a more expansive and elevated island experience. Featuring a larger bedroom, extended outdoor terrace, and refined architectural details, this suite is designed for those who seek both privacy and indulgence. Relax in a beautifully crafted bathroom with double vanities and rainfall shower, or unwind on your private deck as the sun melts into the ocean horizon. Every detail is designed to feel exclusive, peaceful, and unforgettable.",
    image: bungalowRoomSuite,
    images: [
      bungalowRoomSuite,
      bungalowBathroomSuite,
      bungalowOutsideSuite,
    ],
    amenities: [
      "Extended Private Deck",
      "Lagoon Views",
      "Rainfall Shower",
      "Double Vanity Bathroom",
      "Premium Bar Setup",
      "Smart TV",
      "Coffee Station",
      "Luxury Linen",
    ],
    maxGuests: 2,
    size: "92 m²",
    occupancy: "Maximum Occupancy: 2 Adults",
    bed: "1 King Bed",
    view: "Panoramic Lagoon View",
    guests: "2 Guests",
  },

  {
    id: "skyline-penthouse",
    title: "Skyline Penthouse",
    price: 560,
    shortDescription:
      "Top-floor indulgence with panoramic views and generous space.",
    description:
      "Our Skyline Penthouse is designed for guests who want the most elevated stay possible. From the expansive lounge to the private dining area and oversized terrace, every corner is crafted to feel exclusive, spacious, and effortlessly refined.",
    image: roomPenthouse,
    images: [roomPenthouse],
    amenities: [
      "Private Terrace",
      "Dining Area",
      "Lounge",
      "Premium Bar",
      "Panoramic Windows",
      "Free WiFi",
      "Luxury Bath",
      "Room Service",
    ],
    maxGuests: 4,
    size: "96 m²",
    occupancy: "Maximum Occupancy: 4 Adults",
    bed: "1 King Bed",
    view: "Skyline View",
    guests: "4 Guests",
  },

  {
    id: "family-suite",
    title: "Family Suite",
    price: 390,
    shortDescription:
      "Spacious comfort designed for unforgettable group stays.",
    description:
      "Created for families and small groups, the Family Suite blends practicality with boutique comfort. Multiple sleeping areas, extra storage, and a welcoming shared lounge provide a calming environment for both rest and play.",
    image: roomFamilySuite,
    images: [roomFamilySuite],
    amenities: [
      "Separate Living Area",
      "King + Twin Beds",
      "Free WiFi",
      "Air Conditioning",
      "Safe",
      "Crib Available",
      "Smart TV",
      "Rain Shower",
    ],
    maxGuests: 5,
    size: "72 m²",
    occupancy: "Maximum Occupancy: 5 Guests",
    bed: "King + Twin Beds",
    view: "Courtyard View",
    guests: "5 Guests",
  },

  {
    id: "honeymoon-retreat",
    title: "Sunset Honeymoon Retreat",
    price: 480,
    shortDescription:
      "Romance and golden sunsets from your private balcony.",
    description:
      "Designed for celebrating love, the Honeymoon Retreat features a four-poster bed, private balcony, and intimate luxury details throughout.",
    image: roomHoneymoon,
    images: [roomHoneymoon],
    amenities: [
      "Sunset Balcony",
      "Four-Poster Bed",
      "Free WiFi",
      "Champagne",
      "Couples Spa Access",
      "Petal Turndown",
      "Luxury Linen",
      "Ambient Lighting",
    ],
    maxGuests: 2,
    size: "60 m²",
    occupancy: "Maximum Occupancy: 2 Adults",
    bed: "Four-Poster Bed",
    view: "Sunset View",
    guests: "2 Guests",
  },

  {
    id: "standard-room",
    title: "Classic Standard Room",
    price: 170,
    shortDescription:
      "Clean, calm comfort with warm wood finishes.",
    description:
      "Our Classic Standard Room is designed for guests who want elegant simplicity with comfort and functionality.",
    image: roomStandard,
    images: [roomStandard],
    amenities: [
      "Free WiFi",
      "Smart TV",
      "Workspace",
      "Rain Shower",
      "Coffee Station",
      "Wardrobe",
      "Air Conditioning",
      "Daily Housekeeping",
    ],
    maxGuests: 2,
    size: "35 m²",
    occupancy: "Maximum Occupancy: 2 Adults",
    bed: "1 Queen Bed",
    view: "City View",
    guests: "2 Guests",
  },
];

export const getRoomById = (id) =>
  rooms.find((room) => room.id === id);