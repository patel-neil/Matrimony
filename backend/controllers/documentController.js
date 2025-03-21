const Document = require('../models/Document'); // Ensure correct path

exports.uploadDocument = async (req, res) => {
  try {
    console.log("🔹 Request Body:", req.body);
    console.log("🔹 Uploaded File:", req.file);

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

    // Generate a URL to fetch the document later.
    // Ensure you have an endpoint (e.g., GET /api/documents/get/:id) to serve the document.
    const fileUrl = `${req.protocol}://${req.get('host')}/api/documents/get/${newDocument._id}`;

    return res.status(200).json({
      message: "Document uploaded successfully",
      documentId: newDocument._id,
      fileUrl, // Return the persistent URL
    });
  } catch (error) {
    console.error("❌ Error uploading document:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.set("Content-Type", document.contentType);
    res.set("Content-Disposition", `inline; filename="${document.fileName}"`);
    res.send(document.data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getUserDocuments = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const documents = await Document.find({ userEmail }).select("fileName fileUrl status docType");

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: "No documents found for this user." });
    }

    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching user documents:", error);
    res.status(500).json({ message: "Error retrieving documents" });
  }
};