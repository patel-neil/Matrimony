const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadDocument, getDocument,getUserDocuments } = require('../controllers/documentController');

// Configure Multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle a single file upload. Expect the file field to be named "file"
router.post('/upload', upload.single('file'), uploadDocument);

router.get("/get/:id", getDocument);

router.get("/user-documents/:email", getUserDocuments);

module.exports = router;
