const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'teacher'],
    required: [true, 'Role is required']
  },
   class: {
    type: String,
    default: ''
  },
    lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // 👈 optional: adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
