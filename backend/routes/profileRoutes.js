const express = require('express');
const { getUserProfile, saveUserProfile } = require('../controllers/profileController');

const router = express.Router();

router.get('/getUser/:email', getUserProfile);
router.post('/save', saveUserProfile);

module.exports = router;
