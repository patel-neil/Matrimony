const express = require("express");
const { saveUser, getUserByEmail } = require("../controllers/userController");

const router = express.Router();

// Clerk Webhook for user signup/login
router.post("/save-user", saveUser);

router.get("/getUser/:email", getUserByEmail);

module.exports = router;
