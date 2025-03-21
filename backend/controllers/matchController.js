require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: Number,
    gender: String,
    location: String,
    religion: String,
    profession: String,
    height: Number,
    weight: Number,
    annualIncome: Number,
    phone: String,
    email: String,
    maritalStatus: String,
    education: String,
    hobbies: String,
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);


app.get("/api/profiles", async (req, res) => {
  try {
    
    const query = {};
    if (req.query.gender) {
      query.gender = req.query.gender.toLowerCase();
    }
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: "i" };
    }
    if (req.query.religion) {
      query.religion = req.query.religion.toLowerCase();
    }
    if (req.query.profession) {
      query.profession = { $regex: req.query.profession, $options: "i" };
    }
    
    const profiles = await Profile.find(query).sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = app;
