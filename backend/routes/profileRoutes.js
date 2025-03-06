const express = require("express");
const { saveProfile, getProfile } = require("../controllers/profileController");

const router = express.Router();

// Save or update profile
router.post("/save", saveProfile);

// Get profile by email
router.get("/:email", getProfile);

module.exports = router;
