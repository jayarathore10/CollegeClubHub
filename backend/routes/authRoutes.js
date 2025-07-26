

const express = require("express");
const mongoose = require("mongoose"); 
const router = express.Router();
const User = require("../models/user");


// ✅ REGISTER route
router.post("/register", async (req, res) => {
  const { name, email, password, role, club, headPassword } = req.body;

  console.log("📩 Incoming Register Data:", req.body); // 🔍 DEBUG LOG

  try {
    if (!name || !email || !password || !role) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role === "head") {
      if (!club || !headPassword) {
        console.log("❌ Head role but club or headPassword missing");
        return res.status(400).json({ message: "Club and Head Password are required" });
      }

      const clubDoc = await mongoose.model("Club").findById(club);
      if (!clubDoc) {
        return res.status(404).json({ message: "Club not found" });
      }

      if (clubDoc.head.password !== headPassword) {
        console.log("❌ Incorrect head password");
        return res.status(401).json({ message: "Incorrect Head Password" });
      }

      const existingHead = await User.findOne({ role: "head", club });
      if (existingHead) {
        return res.status(400).json({ message: "A head already exists for this club" });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const userData = { name, email, password, role };
    if (role === "head") {
      userData.club = new mongoose.Types.ObjectId(club);
    }

    const user = new User(userData);
    await user.save();

    console.log("✅ User registered:", user);
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("🔥 Register Error:", err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});



// ✅ LOGIN route
// ✅ LOGIN route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password })
      .populate("club", "_id name")
      .populate("clubs", "_id name"); // for students (joined clubs)

    if (!user) return res.json({ success: false });

    console.log("🧪 Logged-in user:", user);

    // 📌 Ensure consistent `clubs` array for all users
    const clubs = user.role === "head" && user.club
  ? [{ id: user.club._id, name: user.club.name }]
  : (user.clubs || []).map(club => ({
      id: club._id,
      name: club.name
    }));


    res.json({
      success: true,
      user: {
        name: user.name || "User",
        email: user.email,
        role: user.role,
        club: user.club?._id || null, // optional direct club access
        clubs: clubs
      }
    });

  } catch (err) {
    console.error("🔥 Login Error:", err);
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
});




module.exports = router;
