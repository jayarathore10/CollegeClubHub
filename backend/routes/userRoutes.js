const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");

// ✅ GET members of a club using club ID from user's clubs array
router.get("/members/:club", async (req, res) => {
  const clubId = req.params.club;

  try {
    const members = await User.find({
       role: { $in: ["Member", "user"] }, // allow both
      clubs: {
        $elemMatch: {
          _id: new mongoose.Types.ObjectId(clubId)
        }
      }
    }).select("name email clubs");

    console.log("✅ Found members for club:", clubId, members.length);
    res.json({ success: true, members });
  } catch (err) {
    console.error("❌ Error fetching members:", err);
    res.status(500).json({ success: false, message: "Error fetching members" });
  }
});


module.exports = router;


