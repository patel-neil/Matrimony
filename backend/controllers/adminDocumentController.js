const Document = require("../models/Document");

// Get all pending document approvals
exports.getPendingApprovals = async (req, res) => {
  try {
    const pendingDocuments = await Document.find({ status: 'pending' });
    // Map each document to include a computed documentUrl and userId (using userEmail)
    const updatedDocuments = pendingDocuments.map(doc => ({
      _id: doc._id,
      userEmail: doc.userEmail,
      userId: doc.userEmail, // using email as the user ID
      docType: doc.docType,
      fileName: doc.fileName,
      status: doc.status,
      uploadedAt: doc.uploadedAt,
      documentUrl: `${req.protocol}://${req.get('host')}/api/documents/get/${doc._id}`
    }));
    res.json(updatedDocuments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending documents", error });
  }
};

  

// Approve or Reject Document
exports.updateDocumentStatus = async (req, res) => {
  try {
    const { documentId, isValid, adminRemarks } = req.body;

    if (!documentId || typeof isValid !== 'boolean') {
      return res.status(400).json({ message: "Invalid request parameters." });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    // Update document status
    document.status = isValid ? "approved" : "rejected";
    document.adminRemarks = adminRemarks || ""; // Save remarks if provided
    await document.save();

    res.json({ message: "Document updated successfully.", document });
  } catch (error) {
    res.status(500).json({ message: "Error updating document status", error });
  }
};
