const express = require("express");
const {
  getAllOperationStaff,
  getOperationStaffById,
  createOperationStaff,
  updateOperationStaff,
  deleteOperationStaff,
} = require("../controllers/operationStaffController");

const {
  protectAdmin,
  allowRoles,
} = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get(
  "/",
  protectAdmin,
  allowRoles("Chief Manager", "Manager"),
  getAllOperationStaff
);

router.get(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager", "Manager"),
  getOperationStaffById
);

router.post(
  "/",
  protectAdmin,
  allowRoles("Chief Manager", "Manager"),
  createOperationStaff
);

router.put(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager", "Manager"),
  updateOperationStaff
);

router.delete(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager", "Manager"),
  deleteOperationStaff
);

module.exports = router;