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
      
      // Convert dateOfBirth to a Date object if provided
      if (profileData.dateOfBirth) {
          profileData.dateOfBirth = new Date(profileData.dateOfBirth);
      }

      let profile = await Profile.findOne({ email: profileData.email });
      if (profile) {
          profile = await Profile.findOneAndUpdate(
              { email: profileData.email },
              profileData,
              { new: true }
          );
      } else {
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
