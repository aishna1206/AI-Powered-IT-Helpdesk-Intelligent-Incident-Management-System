const express = require("express");

const User = require("../models/User");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================
// GET ALL USERS
// ADMIN ONLY
// ============================================

router.get(
  "/",
  authenticateUser,
  authorizeRoles("admin"),
  async (req, res) => {

    try {

      const users = await User
        .find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

      res.json(users);

    } catch (error) {

      console.error(
        "Error fetching users:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch users",
      });

    }

  }
);


module.exports = router;