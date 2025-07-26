const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ✅ Fixes the error
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const recognize = require('./routes/recognize');





const app = express();
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '../frontend/public')));






mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Mongo Error", err));

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);     // All class routes
app.use('/api/students', studentRoutes);   // All student routes
app.use('/api/teachers', teacherRoutes);   // All teacher routes
app.use('/api/recognize', recognize);

app.use('/uploads/students', express.static('uploads/students'));
app.use(express.static(path.join(__dirname, '..', 'frontend')));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
