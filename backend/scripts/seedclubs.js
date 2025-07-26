// scripts/seedClubs.js
const mongoose = require('mongoose');
const Club = require('../models/club'); // path adjust karo

mongoose.connect('mongodb://localhost:27017/user') // replace with your DB name
  .then(async () => {
    console.log('MongoDB connected');

    await Club.insertMany([
      { name: 'Cultural Club', description: 'Events related to culture' },
      {
    name: "Sports Club",
    description: "Train, compete, and stay fit with various sports and games."
  },
  {
    name: "Technical Club",
    description: "Workshops, hackathons, and tech talks to build your skills."
  },
  {
    name: "Advanced Studies Club",
    description: "Deep dive into research, GATE prep, and career-oriented learning."
  },
  {
    name: "Art & Creativity Club",
    description: "Express yourself through painting, craft, and imagination."
  },
  {
    name: "Sahityik Club",
    description: "Explore Hindi and regional literature, poetry, and more."
  },
  {
    name: "Media Club",
    description: "Content creation, interviews, reporting, and storytelling."
  },
  {
    name: "Social & Eco Club",
    description: "Awareness drives, sustainability projects, and community work."
  },
  {
    name: "Photography & Film Club",
    description: "Capture moments, make films, and learn visual storytelling."
  },
  {
    name: "Techno Club",
    description: "Explore technology, hardware projects, and automation ideas."
  },
  {
    name: "Science Club",
    description: "Scientific findings, discoveries, mini projects, and science fairs."
  },
  {
    name: "Yog & Spiritual Club",
    description: "Practice yoga, mindfulness, and explore inner peace and values."
  }
      
    ]);

    console.log('Clubs inserted');
    process.exit();
  })
  .catch(err => console.log(err));
