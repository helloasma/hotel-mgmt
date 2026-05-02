const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Room = require("../models/Room");

dotenv.config();

const rooms = [
  {
    title: "Overwater Bungalows Standard",
    type: "Standard",
    category: "Bungalow",
    description: "Wake up above crystal-clear waters where the horizon stretches endlessly. Designed with natural textures, warm woods, and open space, this bungalow invites calm, privacy, and uninterrupted ocean views.",
    price: 520,
    capacity: 2,
    size: "75 m²",
    bed: "1 King Bed",
    view: "Oceanfront Lagoon View",
    amenities: ["Private Ocean Deck", "Direct Water Access", "Freestanding Soaking Tub", "Panoramic Windows", "Premium Linen", "Mini Bar", "Smart TV", "Room Service"],
    images: ["bungalow-room.jpg", "bungalow-bathroom.jpg", "bungalow-outside.jpg"],
    available: true,
    totalRooms: 3,
    availableRooms: 3,
  },
  {
    title: "Overwater Bungalows Suite",
    type: "Suite",
    category: "Bungalow",
    description: "An elevated overwater experience with expanded space, refined finishes, and panoramic lagoon views. Designed for privacy, comfort, and a more exclusive island stay.",
    price: 720,
    capacity: 2,
    size: "92 m²",
    bed: "1 King Bed",
    view: "Panoramic Lagoon View",
    amenities: ["Extended Private Deck", "Lagoon Views", "Rainfall Shower", "Double Vanity Bathroom", "Luxury Bar Setup", "Smart TV", "Coffee Station", "Premium Linen"],
    images: ["bungalow-room-suite.jpg", "bungalow-bathroom-suite.jpg", "bungalow-outside-suite.jpg"],
    available: true,
    totalRooms: 3,
    availableRooms: 3,
  },
  {
    title: "Forest Cabins Standard",
    type: "Standard",
    category: "Cabin",
    description: "Surrounded by nature, these cabins offer a grounding escape. Large windows, soft tones, and wood textures create a calm and relaxing environment designed for quiet luxury.",
    price: 480,
    capacity: 4,
    size: "72 m²",
    bed: "1 King Bed",
    view: "Forest View",
    amenities: ["Private Outdoor Space", "Forest View Terrace", "Luxury Bathroom", "Premium Linen", "Smart TV", "Coffee Station", "Free WiFi", "Room Service"],
    images: ["forest-cabin.jpg", "forest-caabin-bathroom.jpg", "forest-cabin-outside.jpg"],
    available: true,
    totalRooms: 3,
    availableRooms: 3,
  },
  {
    title: "Forest Cabins Suites",
    type: "Suite",
    category: "Cabin",
    description: "A more spacious forest retreat designed for comfort and privacy. Multiple living areas and refined interior details create an elevated stay surrounded by nature.",
    price: 650,
    capacity: 5,
    size: "96 m²",
    bed: "King + Twin Beds",
    view: "Forest View",
    amenities: ["Expanded Suite Layout", "Private Outdoor Lounge", "Luxury Bathroom", "Premium Linen", "Smart TV", "Coffee Station", "Free WiFi", "Room Service"],
    images: ["forest-cabin-suite.jpg", "forest-cabin-bathroom-suite.jpg", "forest-cabin-suite-inside.jpg", "forest-cabin-suite-outside.jpg"],
    available: true,
    totalRooms: 3,
    availableRooms: 3,
  },
  {
    title: "Mountain Hotel Suites",
    type: "Suite",
    category: "Hotel",
    description: "A refined mountain suite offering more space and a stronger connection to the surrounding landscape. Ideal for guests seeking elevated comfort and privacy.",
    price: 520,
    capacity: 3,
    size: "68 m²",
    bed: "1 King Bed",
    view: "Mountain View",
    amenities: ["Suite Layout", "Mountain View", "Luxury Bathroom", "Premium Linen", "Smart TV", "Coffee Station", "Free WiFi", "Room Service"],
    images: ["mountain-room-suite.jpg", "mountain-bathroom-suite.jpg", "mountain-outside.jpg"],
    available: true,
    totalRooms: 3,
    availableRooms: 3,
  },
  {
    title: "Mountain Hotel Deluxe",
    type: "Standard",
    category: "Hotel",
    description: "Clean, modern interiors meet scenic mountain surroundings. Designed for balance, comfort, and relaxation with natural light and understated luxury.",
    price: 340,
    capacity: 2,
    size: "48 m²",
    bed: "1 King Bed",
    view: "Mountain View",
    amenities: ["Mountain View", "Work Desk", "Luxury Bathroom", "Premium Linen", "Smart TV", "Coffee Station", "Free WiFi", "Daily Housekeeping"],
    images: ["mountain-room.jpg", "mountain-bathroom.jpg", "mountain-outside.jpg"],
    available: true,
    totalRooms: 3,
    availableRooms: 3,
  },
  {
    title: "Sunset Honeymoon Retreat",
    type: "Standard",
    category: "Hotel",
    description: "Where golden sunsets meet unparalleled romance. This intimate retreat is designed for two — with a four-poster bed, private balcony, champagne service, and couples' spa access. A stay crafted for moments that last a lifetime.",
    price: 550,
    capacity: 2,
    size: "60 m²",
    bed: "Four-Poster Bed",
    view: "Sunset View",
    amenities: ["Private Balcony", "Sunset Views", "Four-Poster Bed", "Luxury Bathroom", "Champagne Service", "Couples Spa Access", "Petal Turndown", "Ambient Lighting"],
    images: ["room-honeymoon.jpg", "honeymoon-bathroom.jpg"],
    available: true,
    totalRooms: 3,
    availableRooms: 3,
  },
  {
    title: "Classic Standard Room",
    type: "Standard",
    category: "Hotel",
    description: "A calm and thoughtfully designed space that balances simplicity with comfort. Ideal for guests who appreciate understated luxury and functionality.",
    price: 180,
    capacity: 2,
    size: "35 m²",
    bed: "1 Queen Bed",
    view: "Ocean View",
    amenities: ["Free WiFi", "Smart TV", "Workspace", "Rain Shower", "Coffee Station", "Wardrobe", "Air Conditioning", "Daily Housekeeping"],
    images: ["Basic.jpg", "basic-bathroom.jpg"],
    available: true,
    totalRooms: 3,
    availableRooms: 3,
  },
];

const seedRooms = async () => {
  try {
    await connectDB();

    await Room.deleteMany();
    console.log("Existing rooms cleared");

    await Room.insertMany(rooms);
    console.log("All 8 rooms seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedRooms();
