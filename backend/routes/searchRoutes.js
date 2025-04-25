const express = require('express');
const router = express.Router();
const { searchProfiles, advancedSearch } = require('../controllers/searchController');

// Basic search route
router.get('/profiles', searchProfiles);

// Advanced search based on user preferences
router.get('/profiles/advanced/:userId', advancedSearch);

module.exports = router; 