const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  headName: String,
  headImage: String,
  headPassword: String,
  about: String,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  previousEventGallery: [
    {
      imageUrl: String,
      caption: String,
      date: String
    }
  ]
});

module.exports = mongoose.model('Club', clubSchema);
