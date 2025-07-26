const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'head', 'user'], default: 'user' },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" }, // ✅ THIS
  clubs: [
  {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    name: { type: String }
  }
],

  image: String,
  date: String,
  registered: {
    type: [String],
    default: [] // ✅ ensures it's never undefined
  }
});

module.exports = mongoose.model('user', userSchema);
