<<<<<<< HEAD
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
=======
const express = require("express");
const cors = require("cors"); // ✅ Add this
const mongoose = require("mongoose");

const app = express();
const path = require('path');



// Serve /uploads/gallery statically
app.use('/uploads/gallery', express.static(path.join(__dirname, 'uploads/gallery')));




const authRoutes = require("./routes/authRoutes");
const clubRoutes = require("./routes/clubRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");



app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("College Club Hub backend is running.");
});

// Use route files
app.use("/api", authRoutes);
app.use("/api", clubRoutes);
app.use("/api", eventRoutes);
app.use("/api", userRoutes);
app.use("/api", adminRoutes);



// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/user", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
  });
})
.catch((err) => {
  console.error("MongoDB connection failed:", err);
});
>>>>>>> 94d19bf127d6513fa80e3e3b3c2341734413285a
