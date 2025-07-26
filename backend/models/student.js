const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  rollNumber: { type: String, unique: true },
  email: String,
  className: String,
  photo: String,
  faceEncoding: [Number],  // 128D vector
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
