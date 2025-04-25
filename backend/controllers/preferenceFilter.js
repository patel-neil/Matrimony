// controllers/preferenceFilter.js
const profiles = [
  {
    id: 1,
    name: "Priya Shah",
    age: 28,
    gender: "female",
    location: "new york",
    religion: "hindu",
    profession: "Software Engineer",
    height: 165,
    weight: 55,
    annualIncome: 60000,
    phone: "1234567890",
    email: "priyashah@example.com",
    maritalStatus: "Single",
    education: "B.Tech in Computer Science",
    hobbies: "Reading, Travelling"
  },
  {
    id: 2,
    name: "Rahul Patel",
    age: 30,
    gender: "male",
    location: "mumbai",
    religion: "hindu",
    profession: "Doctor",
    height: 170,
    weight: 70,
    annualIncome: 80000,
    phone: "2345678901",
    email: "rahulpatel@example.com",
    maritalStatus: "Married",
    education: "MBBS",
    hobbies: "Cycling, Music"
  },
  {
    id: 3,
    name: "Aisha Khan",
    age: 26,
    gender: "female",
    location: "dubai",
    religion: "muslim",
    profession: "Teacher",
    height: 160,
    weight: 50,
    annualIncome: 50000,
    phone: "3456789012",
    email: "aishakhan@example.com",
    maritalStatus: "Single",
    education: "BA in English",
    hobbies: "Dancing, Painting"
  },
  {
    id: 4,
    name: "Sanjay Verma",
    age: 35,
    gender: "male",
    location: "delhi",
    religion: "hindu",
    profession: "Businessman",
    height: 175,
    weight: 80,
    annualIncome: 120000,
    phone: "4567890123",
    email: "sanjayverma@example.com",
    maritalStatus: "Married",
    education: "MBA",
    hobbies: "Golf, Travelling"
  },
  {
    id: 5,
    name: "Neha Gupta",
    age: 29,
    gender: "female",
    location: "bangalore",
    religion: "hindu",
    profession: "Designer",
    height: 162,
    weight: 52,
    annualIncome: 70000,
    phone: "5678901234",
    email: "nehagupta@example.com",
    maritalStatus: "Single",
    education: "B.Des",
    hobbies: "Photography, Yoga"
  },
];

// Candidate Preference for filtering (for demonstration)
// - Gender: "female" (compulsory)
// - Age Range: 25 to 30 years
// - Religion: "hindu"
// - Annual Income Range: $50,000 to $80,000
const candidatePreference = {
  gender: "male",
  ageRange: { min: 25, max: 35 },
  religion: "hindu",
  incomeRange: { min: 5000, max: 80000 },
};

module.exports = (req, res) => {
  // Filter profiles based on candidate preference
  const filteredProfiles = profiles.filter((profile) => {
    return (
      profile.gender.toLowerCase() === candidatePreference.gender.toLowerCase() &&
      profile.age >= candidatePreference.ageRange.min &&
      profile.age <= candidatePreference.ageRange.max &&
      profile.religion.toLowerCase() === candidatePreference.religion.toLowerCase() &&
      profile.annualIncome >= candidatePreference.incomeRange.min &&
      profile.annualIncome <= candidatePreference.incomeRange.max
    );
  });

  // Append a random compatibility score (between 70 and 85) to each matching profile
  const enhancedProfiles = filteredProfiles.map(profile => ({
    ...profile,
    compatibilityScore: Math.floor(Math.random() * (85 - 70 + 1)) + 70,
  }));

  // Simulate a 1-second delay
  setTimeout(() => {
    res.json(enhancedProfiles);
  }, 1000);
};
