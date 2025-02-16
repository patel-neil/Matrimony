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

module.exports = { saveUser };
