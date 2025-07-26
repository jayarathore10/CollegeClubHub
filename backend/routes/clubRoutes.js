const express = require("express");
const mongoose = require("mongoose"); 
const router = express.Router();
const User = require("../models/user");

const Club = require("../models/club");
const event = require("../models/event");


// Join club route
router.post("/join-club", async (req, res) => {
  const { email, club } = req.body; // club = ID now ✅

  console.log("📨 JOIN request from:", email, "for club ID:", club);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const clubDoc = await Club.findById(club); // ✅ this needs an ID
    if (!clubDoc) return res.status(404).json({ message: "Club not found" });

    const alreadyJoined = user.clubs.some(c => c._id.toString() === clubDoc._id.toString());

    if (!alreadyJoined) {
      user.clubs.push({ _id: clubDoc._id, name: clubDoc.name }); // ✅ push full object
      await user.save();
      console.log("✅ User joined club:", clubDoc.name);
    } else {
      console.log("ℹ️ Already joined:", clubDoc.name);
    }

    res.json({ message: `You have successfully joined ${clubDoc.name}!` });

  } catch (err) {
    console.error("🔥 Error in /join-club:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// ✅ Create a club (with head info)
router.post("/clubs", async (req, res) => {
  try {
    const { name, description, image, head } = req.body;

    if (!name || !head?.name || !head?.image || !head?.password) {
      return res.status(400).json({ message: "Missing required fields including head info" });
    }

    const newClub = new Club({
      name,
      description,
      image,
      head: {
        name: head.name,
        image: head.image,
        password: head.password // optionally hash later
      }
    });

    const savedClub = await newClub.save();
    res.status(201).json(savedClub);
  } catch (err) {
    console.error("🔥 Error creating club:", err);
    // console.log("✅ Saved image at:", req.file.path);

    res.status(500).json({ message: "Failed to create club", error: err.message });
  }
});

// ✅ Update a club (admin only; can also update head)
router.put('/clubs/:id', async (req, res) => {
  try {
    const { role } = req.body; // 👈 pass 'admin' or 'head'
    const { name, description, headName, headImage, headPassword, about } = req.body;

    const updateData = {};

    // ✅ Admin can update name + head info
    if (role === "admin") {
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (headName || headImage || headPassword) {
        updateData.head = {};
        if (headName) updateData.head.name = headName;
        if (headImage) updateData.head.image = headImage;
        if (headPassword) updateData.head.password = headPassword;
      }
    }

    // ✅ Head can update only about section
    if (role === "head") {
      if (about) updateData.about = about;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Not allowed or no valid fields" });
    }

    const updatedClub = await Club.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({ success: true, club: updatedClub });
  } catch (err) {
    res.status(500).json({ error: "Failed to update club" });
  }
});






// Delete club
router.delete('/clubs/:id', async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete club" });
  }
});


// 📄 Get Club by ID (for club-details page)
router.get("/clubs/:id", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });
   
    res.json(club);
  } catch (err) {
    
     console.error("❌ Error fetching club by ID:", err); // PRINT TO TERMINALS
    res.status(500).json({ message: "Error fetching club", error: err.message });
  }
});





// router.get('/members/:club', async (req, res) => {
//   const club = req.params.club;

//   try {
//     const members = await User.find({ role: 'Member', club: club });
//     res.json({ success: true, members });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });
// In clubRoutes.js
const multer = require("multer");
const path = require("path");

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/gallery");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});
const upload = multer({ storage });



const fs = require("fs");

router.put("/clubs/:id/gallery/delete", async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  try {
    const club = await Club.findByIdAndUpdate(
      id,
      { $pull: { previousEventGallery: image } },
      { new: true }
    );

    // Delete the file from disk
    const filePath = path.join(__dirname, "..", image);
    fs.unlink(filePath, err => {
      if (err) console.error("File deletion error:", err.message);
    });

    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ error: "Delete failed", details: error.message });
  }
});

// clubRoutes.js
// 📤 Upload gallery image
// 📤 Upload gallery image
router.post("/clubs/gallery", upload.single("image"), async (req, res) => {
  const { clubId, caption, date } = req.body;
  const imageUrl = req.file.filename; 

  try {
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ error: "Club not found" });

    const newImage = { imageUrl, caption, date };
    club.previousEventGallery.push(newImage);
    await club.save();

    res.json({
      success: true,
      newImage, // ✅ send back the new image for appending
      previousEventGallery: club.previousEventGallery // also full gallery
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Image upload failed", details: err.message });
  }
});

// 📤 Delete gallery image
router.delete("/clubs/:id/gallery", async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  try {
    const club = await Club.findByIdAndUpdate(
      id,
      { $pull: { previousEventGallery: { imageUrl } } },
      { new: true }
    );

    const filePath = path.join(__dirname, "..", "uploads", "gallery", imageUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.error("File deletion error:", err.message);
    });

    res.json({ success: true, previousEventGallery: club.previousEventGallery });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete image", details: err.message });
  }
});





module.exports = router;
