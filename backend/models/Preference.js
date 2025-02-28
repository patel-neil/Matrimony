const mongoose = require('mongoose');

const partnerPreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // ✅ Ensure one preference per user
  essentialPrefs: {
    ageRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    religion: { type: String, required: true },
    motherTongue: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    education: { type: String, required: true },
    height: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    income: { type: String, required: true },
    familyType: { type: String, required: true },
    weight: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    occupation: { type: String, required: true }
  },
  optionalPrefs: {
    hobbies: [{ type: String }],
    foodPreferences: [{ type: String }],
    location: [{ type: String }],
    lifestyleChoices: [{ type: String }]
  }
}, { timestamps: true });

module.exports = mongoose.model('PartnerPreference', partnerPreferenceSchema);
