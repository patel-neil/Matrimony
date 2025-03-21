require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const profileRoutes = require("./routes/profileRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const documentRoutes = require("./routes/documentRoutes");

// Import dummy profiles controller from matches.js
const matchesController = require("./controllers/matches");
// Import dummy candidate preference filter controller (for demonstration)
const preferenceFilterController = require("./controllers/preferenceFilter");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

// Database Connection
connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on("error", (err) => {
      console.error("❌ Server Error:", err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", uploadRoutes);
app.use("/api/documents", documentRoutes);

// Dummy Profiles Route (for search page)
app.get("/api/profiles", matchesController);

// Dummy Preference Match Route (for filtering based on candidate preference)
app.get("/api/preference-match", preferenceFilterController);

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
