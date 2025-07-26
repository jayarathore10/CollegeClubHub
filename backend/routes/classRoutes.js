const express = require('express');
const router = express.Router();
const Class = require("../models/class");
const Student = require("../models/student");

// Get students by class name (must come first)
router.get('/:className/students', async (req, res) => {
  try {
    const students = await Student.find({ className: req.params.className });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching classes', details: err.message });
  }
});

// Add class
router.post('/add-class', async (req, res) => {
  const { className, classPassword } = req.body;
  try {
    const newClass = new Class({ className, classPassword });
    await newClass.save();
    res.status(201).json({ message: 'Class added successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error adding class: ' + err.message });
  }
});

// Delete class
router.delete('/:id', async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting class', error: err.message });
  }
});
router.post('/validate-password', async (req, res) => {
  try {
    const { className, classPassword } = req.body;
    const foundClass = await Class.findOne({ className });

    if (!foundClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (foundClass.classPassword === classPassword) {
      return res.status(200).json({ message: 'Password validated' });
    } else {
      return res.status(401).json({ message: 'Invalid class password' });
    }
  } catch (err) {
    console.error('Validation error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
