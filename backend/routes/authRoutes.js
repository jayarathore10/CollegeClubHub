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


module.exports = router;
