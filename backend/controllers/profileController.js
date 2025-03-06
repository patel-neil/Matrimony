const Profile = require("../models/Profile");

// Save or Update User Profile
const saveProfile = async (req, res) => {
    try {
        const { email, phone } = req.body;

        // Validate required fields
        if (!email || !phone) {
            return res.status(400).json({ message: "Email and phone are required" });
        }

        // Check if the profile already exists
        let profile = await Profile.findOne({ email });

        if (profile) {
            // Update existing profile
            profile = await Profile.findOneAndUpdate({ email }, req.body, { new: true });
            return res.status(200).json({ message: "Profile updated successfully", profile });
        }

        // Create a new profile
        profile = new Profile(req.body);
        await profile.save();

        res.status(201).json({ message: "Profile saved successfully", profile });
    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Get User Profile by Email
const getProfile = async (req, res) => {
    try {
        const { email } = req.params;

        // Check if profile exists
        const profile = await Profile.findOne({ email });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

module.exports = { saveProfile, getProfile };
