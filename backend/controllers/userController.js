const User = require("../models/User");
const Document = require("../models/Document"); // Ensure this is correctly pointing to your model

// Save user details after Clerk authentication
const saveUser = async (req, res) => {
  try {
    console.log("▶️ [saveUser] req.body =", req.body);

    const { clerkId, username, email, phoneNumber, createdAt } = req.body;

    if (!clerkId) {
      return res.status(400).json({ message: "Missing clerkId in request body" });
    }

    // Check if the user already exists
    let user = await User.findOne({ clerkId });

    if (user) {
      console.log("ℹ️ User already exists:", user._id);
    } else {
      console.log("➕ No user found, creating new one...");
      user = new User({
        clerkId,
        username,
        email,
        phoneNumber,
        createdAt,
      });
      console.log("Incoming data:", req.body);

      await user.save();
      console.log("✅ New user saved:", user._id);
    }

    res.status(200).json({ message: "User saved successfully", user });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ message: "Error saving user", error: error.message });
  }
};

// Fetch user email and phone by email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch only email and phoneNumber fields from User
    const user = await User.findOne({ email }, "email phoneNumber");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch user's documents from the Document collection
    const documents = await Document.find({ userEmail: email }, "docType fileName _id");

    // Map documents to include the file URL. Ensure the URL format matches the one you generated.
    const docsWithUrl = documents.map(doc => {
      const fileUrl = `${req.protocol}://${req.get('host')}/api/documents/get/${doc._id}`;
      return {
        docType: doc.docType,
        fileName: doc.fileName,
        fileUrl,
      };
    });

    res.status(200).json({
      userId: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      documents: docsWithUrl, // Include the document details
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { saveUser, getUserByEmail };
