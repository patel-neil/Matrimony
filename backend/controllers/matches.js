// controllers/matches.js

const profiles = [
  {
    id: 1,
    name: "Priya Shah",
    age: 28,
    gender: "female",
    location: "new york", // city only
    religion: "hindu",
    profession: "Software Engineer",
    height: 165, // in cm
    weight: 55,  // in kg
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

module.exports = (req, res) => {

  setTimeout(() => {
    res.json(profiles);
  }, 1000);
};


