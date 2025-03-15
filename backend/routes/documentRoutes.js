const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadDocument } = require('../controllers/documentController');

// Configure Multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle a single file upload. Expect the file field to be named "file"
router.post('/upload', upload.single('file'), uploadDocument);

module.exports = router;
