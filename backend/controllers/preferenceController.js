const PartnerPreference = require('../models/Preference');

// ✅ Save Partner Preference (Only One per User)
exports.savePreference = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const { userId, essentialPrefs, optionalPrefs } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Check if the user already has a preference
    const existingPreference = await PartnerPreference.findOne({ userId });

    if (existingPreference) {
      return res.status(400).json({ error: "User already has a saved preference." });
    }

    // Create a new preference document for the user
    const newPreference = new PartnerPreference({ userId, essentialPrefs, optionalPrefs });
    await newPreference.save();

    res.status(201).json({ message: "Preferences saved successfully!", preference: newPreference });

  } catch (error) {
    console.error("Error Saving Preference:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// ✅ Update Partner Preference
exports.updatePreference = async (req, res) => {
  try {
    const { userId, essentialPrefs, optionalPrefs } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updatedPreference = await PartnerPreference.findOneAndUpdate(
      { userId },
      { essentialPrefs, optionalPrefs },
      { new: true, runValidators: true }
    );

    if (!updatedPreference) {
      return res.status(404).json({ error: "User preference not found." });
    }

    res.status(200).json({ message: "Preferences updated successfully!", preference: updatedPreference });

  } catch (error) {
    console.error("Error Updating Preference:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// ✅ Get Partner Preferences by User ID
exports.getPreference = async (req, res) => {
  try {
    const preference = await PartnerPreference.findOne({ userId: req.params.userId });

    if (!preference) {
      return res.status(404).json({ error: "Preferences not found" });
    }

    res.status(200).json(preference);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// ✅ Delete Partner Preference
exports.deletePreference = async (req, res) => {
  try {
    await PartnerPreference.findOneAndDelete({ userId: req.params.userId });
    res.status(200).json({ message: "Preferences deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
