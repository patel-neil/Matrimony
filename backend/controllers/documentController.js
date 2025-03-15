const Document = require('../models/Document'); // Ensure correct path


exports.uploadDocument = async (req, res) => {
    try {
      console.log("🔹 Request Body:", req.body);  // Debugging
      console.log("🔹 Uploaded File:", req.file); // Debugging
  
      const { userEmail, docType } = req.body;
  
      // Ensure all required fields are present
      if (!userEmail || !docType || !req.file) {
        console.error("❌ Missing required fields:", { userEmail, docType, file: req.file });
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Extract file details from Multer
      const { originalname, mimetype, buffer } = req.file;
  
      // Create a new document entry
      const newDocument = new Document({
        userEmail,
        docType,
        fileName: originalname,
        contentType: mimetype,
        data: buffer, // Store file as binary data in MongoDB
      });
  
      await newDocument.save();
  
      return res.status(200).json({
        message: "Document uploaded successfully",
        documentId: newDocument._id,
      });
    } catch (error) {
      console.error("❌ Error uploading document:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  