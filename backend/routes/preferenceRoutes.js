const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');

router.post('/save', preferenceController.savePreference);
router.put('/update', preferenceController.updatePreference); // ✅ New route for updating preferences
router.get('/:userId', preferenceController.getPreference);
router.delete('/:userId', preferenceController.deletePreference);

module.exports = router;
