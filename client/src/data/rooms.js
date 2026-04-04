import roomHoneymoon from "../assets/Rooms/room-honeymoon.jpg";

import basicRoom from "../assets/Rooms/basic.jpg";
import basicBathroom from "../assets/Rooms/basic-bathroom.jpg";
import honeymoonBathroom from "../assets/Rooms/honeymoon-bathroom.jpg";

import bungalowRoom from "../assets/Rooms/bungalow-room.jpg";
import bungalowBathroom from "../assets/Rooms/bungalow-bathroom.jpg";
import bungalowOutside from "../assets/Rooms/bungalow-outside.jpg";

import bungalowRoomSuite from "../assets/Rooms/bungalow-room-suite.jpg";
import bungalowBathroomSuite from "../assets/Rooms/bungalow-bathroom-suite.jpg";
import bungalowOutsideSuite from "../assets/Rooms/bungalow-outside-suite.jpg";

import forestCabinRoom from "../assets/Rooms/forest-cabin.jpg";
import forestCabinBathroom from "../assets/Rooms/forest-caabin-bathroom.jpg";
import forestCabinOutside from "../assets/Rooms/forest-cabin-outside.jpg";

import forestCabinSuiteRoom from "../assets/Rooms/forest-cabin-suite.jpg";
import forestCabinSuiteBathroom from "../assets/Rooms/forest-cabin-bathroom-suite.jpg";
import forestCabinSuiteInside from "../assets/Rooms/forest-cabin-suite-inside.jpg";
import forestCabinSuiteOutside from "../assets/Rooms/forest-cabin-suite-outside.jpg";

import mountainRoom from "../assets/Rooms/mountain-room.jpg";
import mountainBathroom from "../assets/Rooms/mountain-bathroom.jpg";
import mountainOutside from "../assets/Rooms/mountain-outside.jpg";

import mountainRoomSuite from "../assets/Rooms/mountain-room-suite.jpg";
import mountainBathroomSuite from "../assets/Rooms/mountain-bathroom-suite.jpg";

export const rooms = [
  {
    id: "overwater-bungalows",
    title: "Overwater Bungalows",
    price: 520,
    shortDescription:
    "Wake up above crystal-clear water with direct ocean access, natural textures, and uninterrupted island views.",
    description:
      "Wake up above crystal-clear waters where the horizon stretches endlessly. Designed with natural textures, warm woods, and open space, this bungalow invites calm, privacy, and uninterrupted ocean views.",
    image: bungalowRoom,
    images: [bungalowRoom, bungalowBathroom, bungalowOutside],
    amenities: [
      "Private Ocean Deck",
      "Direct Water Access",
      "Freestanding Soaking Tub",
      "Panoramic Windows",
      "Premium Linen",
      "Mini Bar",
      "Smart TV",
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
  "An expansive overwater suite with elevated privacy, refined finishes, and uninterrupted panoramic lagoon views.",
    description:
      "An elevated overwater experience with expanded space, refined finishes, and panoramic lagoon views. Designed for privacy, comfort, and a more exclusive island stay.",
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
      "Luxury Bar Setup",
      "Smart TV",
      "Coffee Station",
      "Premium Linen",
    ],
    maxGuests: 2,
    size: "92 m²",
    occupancy: "Maximum Occupancy: 2 Adults",
    bed: "1 King Bed",
    view: "Panoramic Lagoon View",
    guests: "2 Guests",
  },

  {
    id: "forest-cabins",
    title: "Forest Cabins",
    price: 480,
    shortDescription:
  "Private forest cabins surrounded by nature, offering warm interiors, soft light, and a calm outdoor setting.",
    description:
      "Surrounded by nature, these cabins offer a grounding escape. Large windows, soft tones, and wood textures create a calm and relaxing environment designed for quiet luxury.",
    image: forestCabinRoom,
    images: [forestCabinRoom, forestCabinBathroom, forestCabinOutside],
    amenities: [
      "Private Outdoor Space",
      "Forest View Terrace",
      "Luxury Bathroom",
      "Premium Linen",
      "Smart TV",
      "Coffee Station",
      "Free WiFi",
      "Room Service",
    ],
    maxGuests: 4,
    size: "72 m²",
    occupancy: "Maximum Occupancy: 4 Adults",
    bed: "1 King Bed",
    view: "Forest View",
    guests: "4 Guests",
  },

  {
    id: "forest-cabins-suites",
    title: "Forest Cabins Suites",
    price: 650,
    shortDescription:
  "A spacious forest suite designed for comfort, privacy, and a more refined experience surrounded by nature.",
    description:
      "A more spacious forest retreat designed for comfort and privacy. Multiple living areas and refined interior details create an elevated stay surrounded by nature.",
    image: forestCabinSuiteRoom,
    images: [
      forestCabinSuiteRoom,
      forestCabinSuiteBathroom,
      forestCabinSuiteInside,
      forestCabinSuiteOutside,
    ],
    amenities: [
      "Expanded Suite Layout",
      "Private Outdoor Lounge",
      "Luxury Bathroom",
      "Premium Linen",
      "Smart TV",
      "Coffee Station",
      "Free WiFi",
      "Room Service",
    ],
    maxGuests: 5,
    size: "96 m²",
    occupancy: "Maximum Occupancy: 5 Guests",
    bed: "King + Twin Beds",
    view: "Forest View",
    guests: "5 Guests",
  },

  {
    id: "mountain-hotel-rooms",
    title: "Mountain Hotel Rooms",
    price: 340,
    shortDescription:
  "Modern mountain-view rooms with clean interiors, natural light, and a calm atmosphere for a relaxed stay.",
    description:
      "Clean, modern interiors meet scenic mountain surroundings. Designed for balance, comfort, and relaxation with natural light and understated luxury.",
    image: mountainRoom,
    images: [mountainRoom, mountainBathroom, mountainOutside],
    amenities: [
      "Mountain View",
      "Work Desk",
      "Luxury Bathroom",
      "Premium Linen",
      "Smart TV",
      "Coffee Station",
      "Free WiFi",
      "Daily Housekeeping",
    ],
    maxGuests: 2,
    size: "48 m²",
    occupancy: "Maximum Occupancy: 2 Adults",
    bed: "1 King Bed",
    view: "Mountain View",
    guests: "2 Guests",
  },

  {
    id: "mountain-hotel-suites",
    title: "Mountain Hotel Suites",
    price: 520,
    shortDescription:
  "Spacious mountain suites with elevated comfort, refined details, and peaceful views of the surrounding landscape.",
    description:
      "A refined mountain suite offering more space and a stronger connection to the surrounding landscape. Ideal for guests seeking elevated comfort and privacy.",
    image: mountainRoomSuite,
    images: [mountainRoomSuite, mountainBathroomSuite, mountainOutside],
    amenities: [
      "Suite Layout",
      "Mountain View",
      "Luxury Bathroom",
      "Premium Linen",
      "Smart TV",
      "Coffee Station",
      "Free WiFi",
      "Room Service",
    ],
    maxGuests: 3,
    size: "68 m²",
    occupancy: "Maximum Occupancy: 3 Adults",
    bed: "1 King Bed",
    view: "Mountain View",
    guests: "3 Guests",
  },

  {
    id: "honeymoon-retreat",
    title: "Sunset Honeymoon Retreat",
    price: 550,
    shortDescription:
  "A romantic private retreat with sunset views, soft textures, and an intimate setting designed for special moments.",
    description:
      "Designed for romance, this private retreat captures golden sunsets and intimate moments. Soft textures and ambient lighting create a peaceful and unforgettable stay.",
    image: roomHoneymoon,
    images: [roomHoneymoon, honeymoonBathroom],
    amenities: [
      "Private Balcony",
      "Sunset Views",
      "Four-Poster Bed",
      "Luxury Bathroom",
      "Champagne Service",
      "Couples Spa Access",
      "Petal Turndown",
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
    price: 180,
    shortDescription:
  "A calm and comfortable space with clean design, warm finishes, and essential amenities for a relaxed stay.",
    description:
      "A calm and thoughtfully designed space that balances simplicity with comfort. Ideal for guests who appreciate understated luxury and functionality.",
    image: basicRoom,
    images: [basicRoom, basicBathroom],
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