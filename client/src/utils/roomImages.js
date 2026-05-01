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
import roomHoneymoon from "../assets/Rooms/room-honeymoon.jpg";
import honeymoonBathroom from "../assets/Rooms/honeymoon-bathroom.jpg";
import basicRoom from "../assets/Rooms/Basic.jpg";
import basicBathroom from "../assets/Rooms/basic-bathroom.jpg";

const roomImages = {
  "bungalow-room.jpg": bungalowRoom,
  "bungalow-bathroom.jpg": bungalowBathroom,
  "bungalow-outside.jpg": bungalowOutside,
  "bungalow-room-suite.jpg": bungalowRoomSuite,
  "bungalow-bathroom-suite.jpg": bungalowBathroomSuite,
  "bungalow-outside-suite.jpg": bungalowOutsideSuite,
  "forest-cabin.jpg": forestCabinRoom,
  "forest-caabin-bathroom.jpg": forestCabinBathroom,
  "forest-cabin-outside.jpg": forestCabinOutside,
  "forest-cabin-suite.jpg": forestCabinSuiteRoom,
  "forest-cabin-bathroom-suite.jpg": forestCabinSuiteBathroom,
  "forest-cabin-suite-inside.jpg": forestCabinSuiteInside,
  "forest-cabin-suite-outside.jpg": forestCabinSuiteOutside,
  "mountain-room.jpg": mountainRoom,
  "mountain-bathroom.jpg": mountainBathroom,
  "mountain-outside.jpg": mountainOutside,
  "mountain-room-suite.jpg": mountainRoomSuite,
  "mountain-bathroom-suite.jpg": mountainBathroomSuite,
  "room-honeymoon.jpg": roomHoneymoon,
  "honeymoon-bathroom.jpg": honeymoonBathroom,
  "Basic.jpg": basicRoom,
  "basic-bathroom.jpg": basicBathroom,
};

export const getImage = (filename) => roomImages[filename] || null;

const roomsPageNames = {
  "overwater-bungalow": "Overwater Bungalows Standard",
  "forest-cabin": "Forest Cabins Standard",
};

export const getRoomsPageDisplayName = (room) =>
  roomsPageNames[room?.type] ?? room?.title ?? "";