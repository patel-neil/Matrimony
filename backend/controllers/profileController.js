const Profile = require('../models/Profile');

// Fetch user profile by email
const getUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const profile = await Profile.findOne({ email });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(profile);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Save or update user profile
const saveUserProfile = async (req, res) => {
    try {
        const profileData = req.body;

        if (!profileData.email) {
            return res.status(400).json({ message: "Email is required" });
        }
        console.log("▶️ SAVE PROFILE BODY:", req.body);
        if (!req.body || !req.body.email) {
            return res.status(400).json({ message: "Missing email in request body", received: req.body });
          }
          
        // Convert dateOfBirth to a Date object if provided
        if (profileData.dateOfBirth) {
            profileData.dateOfBirth = new Date(profileData.dateOfBirth);
            if (isNaN(profileData.dateOfBirth)) {
                return res.status(400).json({ message: "Invalid Date of Birth format." });
            }
        }

        // Regular expressions for LinkedIn and Instagram validation
        const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/;
        const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/.*$/;

        if (profileData.linkedin && !linkedinRegex.test(profileData.linkedin)) {
            return res.status(400).json({ message: "Invalid LinkedIn URL format." });
        }

        if (profileData.instagram && !instagramRegex.test(profileData.instagram)) {
            return res.status(400).json({ message: "Invalid Instagram URL format." });
        }

        let profile = await Profile.findOne({ email: profileData.email });
        if (profile) {
            // Update existing profile
            profile = await Profile.findOneAndUpdate(
                { email: profileData.email },
                profileData,
                { new: true }
            );
        } else {
            // Create a new profile
            profile = new Profile(profileData);
            await profile.save();
        }
        
        res.json({ message: 'Profile saved successfully', profile });
    } catch (err) {
        console.error("Error saving profile:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserProfile, saveUserProfile };
