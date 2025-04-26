const UserProfile = require('../models/Profile');
const PartnerPreference = require('../models/Preference');

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Helper function to extract height in cm from string
const extractHeight = (heightString) => {
  const match = heightString.match(/(\d+)\s*cm/i);
  return match ? parseInt(match[1]) : null;
};

const searchProfiles = async (req, res) => {
  try {
    const {
      gender,
      ageRange,
      religion,
      caste,
      education,
      occupation,
      location,
      incomeRange,
      maritalStatus,
      heightRange,
      weightRange,
      page = 1,
      limit = 50
    } = req.query;

    // Build the search query
    const query = {};

    // Basic filters
    if (gender) query.gender = gender;
    if (religion) query.religion = religion;
    if (caste) query.caste = caste;
    if (education) query.education = education;
    if (occupation) query.occupation = occupation;
    if (maritalStatus) query.maritalStatus = maritalStatus;
    if (location) {
      query.$or = [
        { city: new RegExp(location, 'i') },
        { state: new RegExp(location, 'i') }
      ];
    }

    // Age range filter
    if (ageRange) {
      const [minAge, maxAge] = ageRange.split('-').map(Number);
      const currentDate = new Date();
      const minBirthDate = new Date(currentDate.getFullYear() - maxAge, currentDate.getMonth(), currentDate.getDate());
      const maxBirthDate = new Date(currentDate.getFullYear() - minAge, currentDate.getMonth(), currentDate.getDate());
      
      query.dateOfBirth = {
        $gte: minBirthDate,
        $lte: maxBirthDate
      };
    }

    // Height range filter
    if (heightRange) {
      const [minHeight, maxHeight] = heightRange.split('-').map(Number);
      query.$expr = {
        $and: [
          { $gte: [{ $toInt: { $substr: ["$height", 0, { $subtract: [{ $strLenCP: "$height" }, 3] }] } }, minHeight] },
          { $lte: [{ $toInt: { $substr: ["$height", 0, { $subtract: [{ $strLenCP: "$height" }, 3] }] } }, maxHeight] }
        ]
      };
    }

    // Weight range filter
    if (weightRange) {
      const [minWeight, maxWeight] = weightRange.split('-').map(Number);
      query.weight = {
        $gte: minWeight,
        $lte: maxWeight
      };
    }

    // Income range filter
    if (incomeRange) {
      const [minIncome, maxIncome] = incomeRange.split('-').map(Number);
      query.annualIncome = {
        $gte: minIncome * 100000, // Convert lakhs to actual amount
        $lte: maxIncome * 100000
      };
    }

    // Execute the search with pagination
    const skip = (page - 1) * limit;
    
    const [profiles, total] = await Promise.all([
      UserProfile.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      UserProfile.countDocuments(query)
    ]);

    // Calculate age for each profile
    const profilesWithAge = profiles.map(profile => ({
      ...profile.toObject(),
      age: calculateAge(profile.dateOfBirth)
    }));

    res.json({
      success: true,
      data: profilesWithAge,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching profiles',
      error: error.message
    });
  }
};

// Advanced search based on preferences
const advancedSearch = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Get user's preferences
    const userPreferences = await PartnerPreference.findOne({ userId });
    if (!userPreferences) {
      return res.status(404).json({
        success: false,
        message: 'User preferences not found'
      });
    }

    const { essentialPrefs } = userPreferences;
    const currentDate = new Date();

    // Build the search query based on preferences
    const query = {
      gender: req.query.gender, // Assuming we know the gender preference
      religion: essentialPrefs.religion,
      maritalStatus: essentialPrefs.maritalStatus,
      education: essentialPrefs.education,
      occupation: essentialPrefs.occupation,
      familyType: essentialPrefs.familyType,
      dateOfBirth: {
        $gte: new Date(currentDate.getFullYear() - essentialPrefs.ageRange.max, currentDate.getMonth(), currentDate.getDate()),
        $lte: new Date(currentDate.getFullYear() - essentialPrefs.ageRange.min, currentDate.getMonth(), currentDate.getDate())
      },
      $expr: {
        $and: [
          { $gte: [{ $toInt: { $substr: ["$height", 0, { $subtract: [{ $strLenCP: "$height" }, 3] }] } }, essentialPrefs.height.min] },
          { $lte: [{ $toInt: { $substr: ["$height", 0, { $subtract: [{ $strLenCP: "$height" }, 3] }] } }, essentialPrefs.height.max] }
        ]
      },
      weight: {
        $gte: essentialPrefs.weight.min,
        $lte: essentialPrefs.weight.max
      }
    };

    // Execute the search with pagination
    const skip = (page - 1) * limit;
    
    const [profiles, total] = await Promise.all([
      UserProfile.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      UserProfile.countDocuments(query)
    ]);

    // Calculate age for each profile
    const profilesWithAge = profiles.map(profile => ({
      ...profile.toObject(),
      age: calculateAge(profile.dateOfBirth)
    }));

    res.json({
      success: true,
      data: profilesWithAge,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in advanced search',
      error: error.message
    });
  }
};

module.exports = {
  searchProfiles,
  advancedSearch
}; 