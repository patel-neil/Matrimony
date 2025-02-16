const express = require("express");
const { saveUser } = require("../controllers/userController");

const router = express.Router();

// Clerk Webhook for user signup/login
router.post("/save-user", saveUser);

module.exports = router;
