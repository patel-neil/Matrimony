require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require('body-parser');

// Import Routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const profileRoutes = require("./routes/profileRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const documentRoutes = require('./routes/documentRoutes');


// Initialize Express App
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: "50mb" })); // Parse JSON requests with a size limit
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Parse URL-encoded requests
app.use("/uploads", express.static("uploads")); // Serve static files from the "uploads" directory
app.use(bodyParser.json());

// Database Connection
connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    // Start the server only after DB is connected
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Handle server errors
    server.on("error", (err) => {
      console.error("❌ Server Error:", err);
      process.exit(1); // Exit process with failure
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit process with failure
  });

// API Routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/chats", chatRoutes); // Chat-related routes
app.use("/api/admin", adminRoutes); // Admin-related routes
app.use("/api/preferences", preferenceRoutes); // Preference-related routes
app.use("/api/profile", profileRoutes); // Profile-related routes
app.use("/api", uploadRoutes); // File upload routes
app.use('/api/documents', documentRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Handle 404 Errors
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    error: "An unexpected error occurred. Please try again later.",
  });
});

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("🛑 Server is shutting down...");
  process.exit(0);
});