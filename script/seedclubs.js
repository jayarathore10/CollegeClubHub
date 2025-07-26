// scripts/seedClubs.js
const mongoose = require('mongoose');
const Club = require('../models/club'); // path adjust karo

mongoose.connect('mongodb://localhost:27017/user') // replace with your DB name
  .then(async () => {
    console.log('MongoDB connected');

    await Club.insertMany([
      { name: 'Cultural Club', description: 'Events related to culture' },
      { name: 'Technical Club', description: 'Tech-related workshops' },
      { name: 'Sports Club', description: 'All about sports' }
    ]);

    console.log('Clubs inserted');
    process.exit();
  })
  .catch(err => console.log(err));
