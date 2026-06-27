const express = require("express");
const router = express.Router();

const {
  getAdminStats,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

module.exports = router;