const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const router = express.Router();

// Ensure folder exists
const uploadDir = path.join(__dirname, '../uploads/class');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, 'class.jpg')
});
const upload = multer({ storage });

// Upload and recognize
router.post('/', upload.single('classImage'), (req, res) => {
  const classImagePath = path.join(uploadDir, 'class.jpg');
  const encFilePath = path.join(__dirname, '../face-recognizer/student-encodings.pkl');

  const python = spawn('python', [
    path.join(__dirname, '../face-recognizer/recognize.py'),
    classImagePath,
    encFilePath
  ]);

  let result = '';
  let errorOutput = '';

  python.stdout.on('data', (data) => {
    result += data.toString();
  });

  python.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  python.on('close', () => {
    if (!result) {
      return res.status(500).json({ error: 'No result returned from Python' });
    }

    try {
      const json = JSON.parse(result.trim());
      json.logs = errorOutput.split('\n').filter(Boolean);  // Add stderr logs
      res.json(json);
    } catch (err) {
      console.error('Parse Error:', err);
      res.status(500).json({ error: 'Failed to parse recognition result' });
    }
  });
});

// ✅ Don't forget to export the router!
module.exports = router;
