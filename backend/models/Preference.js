const mongoose = require('mongoose');

const partnerPreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // ✅ Ensure one preference per user
  essentialPrefs: {
    gender: { type: String, required: true, enum: ['Male', 'Female'] },
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
    income: { 
      type: String, 
      required: true, 
      enum: [
        'Below ₹2 Lakh',
        '₹2-5 Lakh',
        '₹5-10 Lakh',
        '₹10-20 Lakh',
        '₹20-30 Lakh',
        '₹30-50 Lakh',
        '₹50 Lakh-1 Crore',
        '₹1-2 Crore',
        '₹2-5 Crore',
        'Above ₹5 Crore',
        'Any'
      ] 
    },
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
