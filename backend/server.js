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
