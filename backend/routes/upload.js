const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/User"); // Assuming you have a User model
const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// API Endpoint to Handle Document Upload
router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const { docType, userId } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Get file path
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    // Update user document in MongoDB
    await User.findByIdAndUpdate(userId, { $set: { [docType]: fileUrl } });

    res.json({ message: "File uploaded successfully", fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
