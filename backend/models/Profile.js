const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    
    // Basic Info
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    dateOfBirth: String,
    gender: String,
    maritalStatus: String,

    // Physical Information
    height: String,
    weight: String,
    bodyType: String,
    skinTone: String,
    physicalDisability: String,
    disabilityDetails: String,
    bloodGroup: String,
    hairTypeColor: String,
    eyeColor: String,
    medicalConditions: String,
    pastSurgeries: String,
    surgeryDetails: String,
    piercingsTattoos: String,

    // Location
    city: String,
    country: String,
    state: String,
    pincode: String,

    // Religion & Community
    religion: String,
    caste: String,
    subCaste: String,
    community: String,

    // Horoscope
    birthTime: String,
    birthPlace: String,
    gothra: String,
    manglik: String,

    // Education & Career
    education: String,
    occupation: String,
    employer: String,
    annualIncome: String,
    workLocation: String,

    // Lifestyle & Interests
    hobbies: [String],
    interests: [String],
    diet: String,
    smoking: String,
    drinking: String,

    // Privacy Settings
    profileVisibility: { type: String, default: "all" },
    contactPreference: { type: String, default: "all" },
    showPhone: { type: Boolean, default: false },
    showEmail: { type: Boolean, default: false },

    // Social Media
    linkedin: String,
    instagram: String,

    // Documents (store file paths)
    aadharCard: String,
    educationCertificate: String,
    incomeCertificate: String,

    // Partner Preferences
    partnerAgeRange: String,
    partnerHeight: String,
    partnerEducation: String,
    partnerOccupation: String,
    partnerLocation: String,
    partnerIncome: String,

    // About Yourself
    aboutYourself: String
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
