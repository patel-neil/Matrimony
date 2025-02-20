const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    res.status(200).json({
      message: "Welcome to Admin Dashboard",
      stats: {
        totalUsers: 120, // Replace with real database queries
        totalMatches: 45,
        pendingVerifications: 10,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
module.exports = { adminLogin, getAdminDashboard };
