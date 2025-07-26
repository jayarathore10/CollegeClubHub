const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Event = require('../models/event');

// Add Event
router.post("/events", async (req, res) => {
  const { title, description, date, image, club } = req.body;

 if (!club || club === "undefined" || club === "null") {
  console.log("❌ Invalid Club ID received:", club);
  return res.status(400).json({ success: false, message: "Club ID is required and must be valid" });
}


  const event = new Event({ title, description, date, image, club });
  await event.save();
  res.json({ success: true, event });
});



// Get all events
router.get('/events/all', async (req, res) => {
  const events = await Event.find().populate('club', 'name');
res.json({ success: true, events });

});

// Get club events for Head
router.get('/events/:club', async (req, res) => {
  try {
    const clubId = req.params.club;
     if (!mongoose.Types.ObjectId.isValid(clubId)) {
      console.log("❌ Invalid ObjectId for club:", clubId);
      return res.status(400).json({ success: false, message: "Invalid club ID" });
    }
const events = await Event.find({ club: clubId }).populate('club', 'name');

    res.json({ success: true, events });
  } catch (err) {
    console.error("Error in fetching events:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get("/events/:club/registrations", async (req, res) => {
  try {
    const clubId = req.params.club;
    const events = await Event.find({ club: clubId });

    const registrations = events.map(event => ({
      title: event.title,
      registered: event.registered || []
    }));

    res.json({ registrations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});
router.put("/events/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, date, image } = req.body;
  try {
    await Event.findByIdAndUpdate(id, { title, description, date, image });
    res.status(200).json({ message: "Event updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});


 

// Delete event
router.delete('/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Event deleted' });
});

// Register student
router.put('/events/:id/register', async (req, res) => {
  const { email } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event.registered.includes(email)) {
    event.registered.push(email);
    await event.save();
    res.json({ success: true, message: 'Registered successfully!' });
  } else {
    res.json({ success: false, message: 'Already registered!' });
  }
});


module.exports = router;
