const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Club = require("../models/club");
const Event = require("../models/event");

// 🧑‍🎓 Get All Users (including role: user, head, admin)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

// 🏛️ Get All Clubs
router.get("/clubs", async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch clubs", error: err.message });
  }
});

// 📅 Get All Events
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().populate("club", "name");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
});

module.exports = router;
