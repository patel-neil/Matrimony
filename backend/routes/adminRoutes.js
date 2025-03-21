const express = require("express");
const { adminLogin, getAdminDashboard } = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/adminAuth");

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Admin dashboard
router.get("/dashboard", adminAuth, getAdminDashboard);

module.exports = router;
