const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  docType: { type: String, required: true }, // e.g., 'aadharCard', 'educationCertificate'
  fileName: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', DocumentSchema);
