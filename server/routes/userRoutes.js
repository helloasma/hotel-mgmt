const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const {
  protectAdmin,
  allowRoles,
} = require("../middleware/adminAuthMiddleware");

// Chief Manager and User support only
router.post(
  "/",
  protectAdmin,
  allowRoles("Chief Manager", "User support"),
  createUser
);

router.get(
  "/",
  protectAdmin,
  allowRoles("Chief Manager", "User support"),
  getAllUsers
);

router.put(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager", "User support"),
  updateUser
);

router.delete(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager", "User support"),
  deleteUser
);

module.exports = router;