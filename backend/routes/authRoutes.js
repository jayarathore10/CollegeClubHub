<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');

// POST /api/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!['admin', 'teacher'].includes(role)) {
    return res.status(403).json({ message: 'Only admin or teacher role allowed' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful', user: { name, email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!['admin', 'teacher'].includes(user.role)) {
      return res.status(403).json({ message: 'Only admin or teacher allowed to login' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ You can return token/session logic here
    // Updated: include class
res.status(200).json({
  message: 'Login successful',
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    class: user.class || ''   // <-- Add this line
  }
});



  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// In userRoutes.js or similar
router.get('/get-class-by-email', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });

    if (!user || user.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ className: user.class });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
=======


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


>>>>>>> 94d19bf127d6513fa80e3e3b3c2341734413285a


module.exports = router;
