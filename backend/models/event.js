const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: String,
  description: String,
  date: String,
  image: String,
  club: { type: Schema.Types.ObjectId, ref: "Club", required: true }, // ✅ must match club ID
    registered: {
    type: [String],
    default: [] // ✅ ensures it's never undefined
  }
});

module.exports = mongoose.model("Event", eventSchema);