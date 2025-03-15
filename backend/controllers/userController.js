const User = require("../models/User");
const Document = require("../models/Document"); // Ensure this is correctly pointing to your model

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
        phoneNumber, // Ensure this field is stored
        createdAt,
      });

      await user.save();
    }

    res.status(200).json({ message: "User saved successfully", user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Error saving user", error });
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
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { saveUser, getUserByEmail };
