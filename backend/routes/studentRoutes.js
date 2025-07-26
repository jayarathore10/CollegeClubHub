const express = require('express');
const multer = require('multer');
const path = require("path");
const { exec } = require('child_process');

const Student = require('../models/student');
const router = express.Router();

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/students/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Add student with photo & generate face encoding
router.post('/add', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, className, rollNumber } = req.body;
    const photo = req.file ? req.file.filename : null;

    const student = new Student({ name, email, className, photo, rollNumber });
    await student.save();

    // ✅ Fix: Build full path to image and Python script
    const imagePath = path.join(__dirname, '..', 'uploads', 'students', photo);
    const scriptPath = path.join(__dirname, '..', 'face-recognizer', 'extract_encoding.py');
    const studentId = student._id.toString();

    const command = `python "${scriptPath}" "${imagePath}" "${studentId}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Encoding Error: ${error.message}`);
        return res.status(500).json({ message: 'Failed to encode face', error: error.message });
      }
      if (stderr) console.error(`stderr: ${stderr}`);

      console.log(`stdout: ${stdout}`);
      res.status(201).json({ message: 'Student added with face encoding', student });
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to add student', error: err.message });
  }
});

// Get all students or filter by class
router.get('/', async (req, res) => {
  try {
    const { class: classQuery } = req.query;
    const filter = classQuery ? { className: classQuery } : {};
    const students = await Student.find(filter);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

module.exports = router;
