const express = require("express");
const { getPendingApprovals, updateDocumentStatus } = require("../controllers/adminDocumentController");
const { adminAuth } = require("../middlewares/adminAuth");

const router = express.Router();

// Get all pending documents
router.get("/pending-approvals", adminAuth, getPendingApprovals);

// Approve or Reject a document
router.post("/document-approval", adminAuth, updateDocumentStatus);

module.exports = router;
