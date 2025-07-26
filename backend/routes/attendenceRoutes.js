const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');

// GET students
app.get("/api/students", async (req, res) => {
  const students = await Student.find({ class: req.teacherClass });
  res.json(students);
});

// POST attendance
app.post("/api/attendance", async (req, res) => {
  const { date, present } = req.body;
  const attendance = new Attendance({ date, present });
  await attendance.save();
  res.status(201).json({ message: "Attendance saved" });
});
app.get('/api/mark-attendance', (req, res) => {
  const python = spawn('python', ['face-recognizer/recognize.py'], { cwd: 'backend' });

  let result = '';

  python.stdout.on('data', (data) => {
    result += data.toString();
  });

  python.on('close', () => {
    try {
      const parsed = JSON.parse(result);
      res.json(parsed);
    } catch (err) {
      console.error("Error parsing Python output", err);
      res.status(500).send("Error in face recognition");
    }
  });

  python.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
  });
});


module.exports = router;