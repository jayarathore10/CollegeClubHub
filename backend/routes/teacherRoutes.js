const express = require('express');
const router = express.Router();
const User = require('../models/users'); // or Teacher model

// Fetch all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' });
    res.json(teachers);
  } catch (err) {
    console.error('Error fetching teachers:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
