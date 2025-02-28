const User = require("../models/User");

// Save user details after Clerk authentication
const saveUser = async (req, res) => {
  try {
    const { id, username, email, phoneNumber, createdAt } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ clerkId: id });

    if (!user) {
      user = new User({
        clerkId: id,
        username,
        email,
        phoneNumber,
        createdAt,
      });

      await user.save();
    }

    res.status(200).json({ message: "User saved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error saving user", error });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ userId: user._id, email: user.email });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { saveUser, getUserByEmail };
