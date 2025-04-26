const mongoose = require('mongoose');
const User = require('./models/User');
const UserProfile = require('./models/Profile');
const PartnerPreference = require('./models/Preference');

// Connect to MongoDB
mongoose.connect('mongodb+srv://neil200417:neil2017@cluster0.s91vbxd.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Indian-specific data arrays
const indianFirstNames = {
  Male: [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Ayaan', 'Atharva', 'Krishna', 'Ishaan',
    'Shaurya', 'Rudra', 'Kabir', 'Adhrit', 'Surya', 'Darsh', 'Veer', 'Ranbir', 'Dhruv', 'Karan',
    'Rahul', 'Amit', 'Vikas', 'Raj', 'Rohan', 'Siddharth', 'Akshay', 'Varun', 'Rajiv', 'Rohit',
    'Ajay', 'Vijay', 'Sanjay', 'Anand', 'Nikhil', 'Harish', 'Mohit', 'Aryan', 'Pranav', 'Yash',
    'Kartik', 'Parth', 'Abhishek', 'Vikram', 'Nitin', 'Manish', 'Deepak', 'Mayank', 'Sahil', 'Kunal'
  ],
  Female: [
    'Saanvi', 'Aanya', 'Aadhya', 'Aaradhya', 'Ananya', 'Pari', 'Anika', 'Navya', 'Diya', 'Riya',
    'Aditi', 'Anvi', 'Ishanvi', 'Amyra', 'Avani', 'Kiara', 'Myra', 'Sara', 'Aahana', 'Ira',
    'Priya', 'Neha', 'Anjali', 'Pooja', 'Sneha', 'Divya', 'Kavita', 'Radhika', 'Nisha', 'Meera',
    'Shreya', 'Kajal', 'Tanvi', 'Shweta', 'Rachna', 'Ishita', 'Swati', 'Deepika', 'Anushka', 'Sonam',
    'Nandini', 'Isha', 'Gayatri', 'Preeti', 'Mira', 'Radha', 'Sunita', 'Trisha', 'Aishwarya', 'Sonia'
  ]
};

const indianLastNames = [
  'Sharma', 'Verma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Joshi', 'Yadav', 'Shah', 'Mehta',
  'Iyer', 'Reddy', 'Nair', 'Pillai', 'Agarwal', 'Desai', 'Chatterjee', 'Banerjee', 'Mukherjee', 'Sinha',
  'Mehra', 'Pandey', 'Trivedi', 'Jain', 'Tiwari', 'Suri', 'Kapoor', 'Malhotra', 'Bhatia', 'Choudhury',
  'Das', 'Sen', 'Khanna', 'Kaur', 'Grover', 'Arora', 'Ahuja', 'Bajaj', 'Chawla', 'Basu',
  'Mahajan', 'Chandra', 'Dutta', 'Saxena', 'Bhatt', 'Chopra', 'Sethi', 'Bhat', 'Chauhan', 'Bose',
  'Menon', 'Goel', 'Rajan', 'Kulkarni', 'Gandhi', 'Hegde', 'Deshpande', 'Patil', 'Malik', 'Mishra'
];

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Bhopal', 'Indore', 'Nagpur', 'Surat', 'Coimbatore', 'Visakhapatnam', 'Kochi', 'Guwahati', 'Bhubaneswar',
  'Dehradun', 'Thiruvananthapuram', 'Vadodara', 'Raipur', 'Ranchi', 'Ludhiana', 'Amritsar', 'Varanasi', 'Patna', 'Agra',
  'Mysore', 'Nashik', 'Kanpur', 'Madurai', 'Vijayawada', 'Rajkot', 'Allahabad', 'Gwalior', 'Jabalpur', 'Aurangabad',
  'Jodhpur', 'Mangalore', 'Meerut', 'Ghaziabad', 'Faridabad', 'Thrissur', 'Kozhikode', 'Jalandhar', 'Tiruchirappalli', 'Jammu'
];

const indianStates = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Punjab',
  'Madhya Pradesh', 'Chhattisgarh', 'Odisha', 'Bihar', 'Assam', 'Uttarakhand', 'Kerala', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Jammu and Kashmir', 'Goa', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura', 'Andhra Pradesh', 'Arunachal Pradesh'
];

const indianLanguages = [
  'Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Odia', 'Malayalam',
  'Punjabi', 'Assamese', 'Maithili', 'Sanskrit', 'Kashmiri', 'Nepali', 'Konkani', 'Sindhi', 'Dogri', 'Manipuri'
];

const indianReligions = {
  'Hindu': ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Kayastha', 'Khatri', 'Maratha', 'Rajput', 'Jat', 'Yadav', 'Nair', 'Reddy', 'Agarwal', 'Iyer', 'Iyengar'],
  'Muslim': ['Sunni', 'Shia', 'Sufi', 'Bohra', 'Khoja', 'Memon', 'Pathan', 'Syed', 'Sheikh', 'Qureshi'],
  'Sikh': ['Jat', 'Khatri', 'Arora', 'Ramgarhia', 'Saini', 'Ahluwalia', 'Bhatra', 'Ghumar', 'Jhinwar', 'Mazbhi'],
  'Christian': ['Roman Catholic', 'Protestant', 'Syrian Christian', 'Latin Catholic', 'Marthoma', 'CSI', 'Baptist', 'Methodist', 'Pentecostal', 'Anglican'],
  'Jain': ['Digambar', 'Shwetambar', 'Sthanakavasi', 'Terapanthi', 'Bispanthi', 'Murtipujak', 'Deravasi', 'Sthanakvasi'],
  'Buddhist': ['Mahayana', 'Theravada', 'Vajrayana', 'Zen', 'Pure Land', 'Nichiren', 'Tibetan'],
  'Parsi': ['Irani', 'Shahenshahi', 'Kadmi', 'Qadimi'],
  'Jewish': ['Bene Israel', 'Cochin Jews', 'Baghdadi Jews', 'Bene Ephraim']
};

const indianEducationLevels = [
  'High School', '10+2', 'Diploma', 'B.A.', 'B.Sc.', 'B.Com.', 'B.Tech.', 'BCA', 'BBA', 'M.A.',
  'M.Sc.', 'M.Com.', 'M.Tech.', 'MCA', 'MBA', 'PhD', 'MBBS', 'MD', 'BDS', 'MS',
  'B.Arch', 'M.Arch', 'B.Ed', 'M.Ed', 'LLB', 'LLM', 'CA', 'CS', 'ICWA', 'BFA',
  'MFA', 'B.Pharm', 'M.Pharm', 'BAMS', 'BHMS', 'BVSc', 'B.Music', 'M.Music', 'BHM', 'BCom'
];

const indianOccupations = [
  'Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Government Employee', 'Private Sector Employee',
  'Bank Officer', 'Engineer', 'Lawyer', 'Chartered Accountant', 'Consultant', 'Professor', 'Architect', 'Civil Servant',
  'Scientist', 'Researcher', 'Nurse', 'Dentist', 'Pharmacist', 'Marketing Executive', 'Sales Executive', 'HR Manager',
  'Finance Manager', 'Project Manager', 'Agriculturist', 'Military/Defense', 'Police Officer', 'Chef', 'Designer', 'Journalist',
  'Writer', 'Artist', 'Fashion Designer', 'Interior Designer', 'Content Creator', 'Digital Marketer', 'Data Scientist',
  'Cybersecurity Expert', 'Cloud Engineer', 'Product Manager', 'Investment Banker', 'Financial Analyst', 'Retail Manager',
  'Real Estate Agent', 'Travel Agent', 'Hospitality Manager', 'Healthcare Administrator', 'Physiotherapist', 'Dietitian', 'Psychologist'
];

const indianCompanies = [
  'Tata Consultancy Services', 'Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra', 'Reliance Industries',
  'HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Larsen & Toubro', 'Mahindra & Mahindra',
  'Bajaj Auto', 'Hero MotoCorp', 'Maruti Suzuki', 'Hindustan Unilever', 'ITC Limited', 'Bharti Airtel',
  'ONGC', 'Coal India', 'NTPC', 'Indian Oil Corporation', 'Bharat Petroleum', 'Hindustan Petroleum',
  'Adani Group', 'JSW Steel', 'Tata Steel', 'Grasim Industries', 'UltraTech Cement', 'Asian Paints',
  'Sun Pharmaceutical', 'Apollo Hospitals', 'Cipla', 'Dr. Reddy\'s Labs', 'Lupin', 'Biocon',
  'Zomato', 'Flipkart', 'Swiggy', 'BYJU\'S', 'Paytm', 'Ola', 'OYO', 'MakeMyTrip', 'Nykaa', 'PolicyBazaar'
];

const indianHobbies = [
  'Cricket', 'Reading', 'Traveling', 'Cooking', 'Dancing', 'Singing', 'Yoga', 'Meditation', 'Photography',
  'Painting', 'Chess', 'Badminton', 'Table Tennis', 'Football', 'Hockey', 'Volleyball', 'Gardening',
  'Watching Movies', 'Listening to Music', 'Playing Musical Instruments', 'Writing', 'Swimming', 'Cycling',
  'Hiking', 'Camping', 'Bird Watching', 'Numismatics', 'Philately', 'Calligraphy', 'Embroidery',
  'Knitting', 'Pottery', 'Sculpture', 'Baking', 'Astronomy', 'Martial Arts', 'Classical Dance',
  'Folk Dance', 'Acting', 'Volunteering', 'Blogging', 'Sketching', 'Origami', 'Carrom',
  'Tennis', 'Kho-Kho', 'Kabaddi', 'Marathons', 'Trekking', 'Poetry'
];

// Helper function to generate random date between two dates
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to get random array element
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get random elements from array
const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to generate Indian address
const generateIndianAddress = () => {
  const city = getRandomElement(indianCities);
  const state = getRandomElement(indianStates);
  const pincode = Math.floor(100000 + Math.random() * 900000).toString();
  
  const houseNo = Math.floor(1 + Math.random() * 999);
  const streets = ['Main Road', 'Colony', 'Nagar', 'Street', 'Marg', 'Avenue', 'Layout', 'Extension', 'Sector', 'Phase'];
  const areas = ['Puram', 'Vihar', 'Enclave', 'Garden', 'Heights', 'Township', 'Hills', 'City', 'Complex', 'Park'];
  
  const street = `${getRandomElement(streets)}`;
  const area = `${getRandomElement(areas)}`;
  
  return {
    houseNo: `${houseNo}`,
    street,
    area,
    city,
    state,
    country: 'India',
    pincode
  };
};

// Helper function to generate income in lakhs
const generateIncome = () => {
  const incomeInLakhs = (Math.random() * 50 + 3).toFixed(2);
  return parseFloat(incomeInLakhs) * 100000; // Convert to actual number
};

// Generate fake profile data with Indian context
const generateIndianProfile = (userId) => {
  const gender = getRandomElement(['Male', 'Female']);
  const firstName = getRandomElement(indianFirstNames[gender]);
  const lastName = getRandomElement(indianLastNames);
  const religion = getRandomElement(Object.keys(indianReligions));
  const caste = religion ? getRandomElement(indianReligions[religion]) : '';
  const education = getRandomElement(indianEducationLevels);
  const occupation = getRandomElement(indianOccupations);
  const address = generateIndianAddress();
  
  const heightCm = gender === 'Male' ? 
    Math.floor(Math.random() * 21) + 160 : // 160-180 cm for males
    Math.floor(Math.random() * 21) + 150;  // 150-170 cm for females
  
  return {
    userId,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@gmail.com`,
    phone: `+91${Math.floor(7000000000 + Math.random() * 3000000000)}`,
    dateOfBirth: getRandomDate(new Date(1980, 0, 1), new Date(2000, 0, 1)),
    gender,
    maritalStatus: getRandomElement(['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']),
    height: `${heightCm} cm`,
    weight: gender === 'Male' ? 
      Math.floor(Math.random() * 31) + 60 : // 60-90 kg for males
      Math.floor(Math.random() * 31) + 45,  // 45-75 kg for females
    bodyType: getRandomElement(['Slim', 'Average', 'Athletic', 'Heavy']),
    skinTone: getRandomElement(['Very Fair', 'Fair', 'Wheatish', 'Wheatish Brown', 'Dark']),
    bloodGroup: getRandomElement(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-']),
    houseNo: address.houseNo,
    street: address.street,
    area: address.area,
    city: address.city,
    state: address.state,
    country: address.country,
    pincode: address.pincode,
    religion,
    caste,
    education,
    occupation,
    employer: getRandomElement(indianCompanies),
    annualIncome: generateIncome(),
    workLocation: getRandomElement(indianCities),
    hobbies: getRandomElements(indianHobbies, Math.floor(Math.random() * 4) + 1),
    interests: getRandomElements(indianHobbies, Math.floor(Math.random() * 4) + 1),
    diet: getRandomElement(['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain']),
    smoking: getRandomElement(['No', 'Occasionally', 'Yes']),
    drinking: getRandomElement(['No', 'Occasionally', 'Yes']),
    profileVisibility: getRandomElement(['Public', 'Members Only', 'Premium Members']),
    contactPreference: getRandomElement(['Email', 'Phone', 'In-App Messages']),
    showPhone: Math.random() > 0.5,
    showEmail: Math.random() > 0.5,
    aboutYourself: `Hi, I am ${firstName} ${lastName}, a ${getRandomElement(['simple', 'humble', 'straightforward', 'honest', 'down-to-earth'])} ${gender === 'Male' ? 'man' : 'woman'} looking for a ${gender === 'Male' ? 'life partner' : 'soulmate'}. I work as a ${occupation} and enjoy ${getRandomElements(indianHobbies, 2).join(' and ')}. I value ${getRandomElement(['family', 'honesty', 'loyalty', 'respect', 'understanding'])} and looking for someone with similar values.`,
    motherTongue: getRandomElement(indianLanguages),
    familyType: getRandomElement(['Nuclear', 'Joint', 'Extended']),
    familyStatus: getRandomElement(['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent']),
    brothers: Math.floor(Math.random() * 4),
    sisters: Math.floor(Math.random() * 4),
    fitnessLevel: getRandomElement(['Very Active', 'Active', 'Moderate', 'Not so Active']),
    profileCreatedOn: new Date(),
    profileUpdatedOn: new Date(),
    profileCompletionPercentage: Math.floor(Math.random() * 41) + 60 // 60-100%
  };
};

// Generate partner preference data with Indian context
const generateIndianPreference = (userId, userProfile) => {
  const oppositeGender = userProfile.gender === 'Male' ? 'Female' : 'Male';
  const ageMin = Math.floor(Math.random() * 5) + (oppositeGender === 'Female' ? 21 : 23);
  const ageMax = ageMin + Math.floor(Math.random() * 8) + 4;
  
  // Height preferences based on gender
  let heightMin, heightMax;
  if (oppositeGender === 'Female') {
    heightMin = Math.floor(Math.random() * 15) + 150; // 150-164 cm for females
    heightMax = heightMin + Math.floor(Math.random() * 16) + 5; // +5-20 cm
  } else {
    heightMin = Math.floor(Math.random() * 15) + 160; // 160-174 cm for males
    heightMax = heightMin + Math.floor(Math.random() * 16) + 5; // +5-20 cm
  }

  // Weight preferences based on gender
  let weightMin, weightMax;
  if (oppositeGender === 'Female') {
    weightMin = Math.floor(Math.random() * 15) + 45; // 45-59 kg for females
    weightMax = weightMin + Math.floor(Math.random() * 16) + 5; // +5-20 kg
  } else {
    weightMin = Math.floor(Math.random() * 15) + 60; // 60-74 kg for males
    weightMax = weightMin + Math.floor(Math.random() * 16) + 5; // +5-20 kg
  }
  
  return {
    userId,
    essentialPrefs: {
      ageRange: {
        min: ageMin,
        max: ageMax
      },
      religion: Math.random() > 0.7 ? userProfile.religion : getRandomElement(Object.keys(indianReligions)),
      motherTongue: Math.random() > 0.5 ? userProfile.motherTongue : getRandomElement(indianLanguages),
      maritalStatus: getRandomElement(['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']),
      education: getRandomElement(indianEducationLevels),
      height: {
        min: heightMin,
        max: heightMax
      },
      weight: {
        min: weightMin,
        max: weightMax
      },
      income: getRandomElement(['3-5 Lakhs', '5-10 Lakhs', '10-20 Lakhs', '20+ Lakhs']),
      familyType: getRandomElement(['Nuclear', 'Joint', 'Extended']),
      caste: Math.random() > 0.6 ? userProfile.caste : 'Any',
      occupation: getRandomElement(indianOccupations)
    },
    optionalPrefs: {
      hobbies: getRandomElements(indianHobbies, Math.floor(Math.random() * 4) + 1),
      foodPreferences: getRandomElements(['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain'], Math.floor(Math.random() * 2) + 1),
      location: getRandomElements(indianCities, Math.floor(Math.random() * 5) + 1),
      states: getRandomElements(indianStates, Math.floor(Math.random() * 3) + 1),
      occupation: getRandomElements(indianOccupations, Math.floor(Math.random() * 5) + 1),
      smoking: getRandomElement(['No', 'Occasionally', 'Yes', 'Any']),
      drinking: getRandomElement(['No', 'Occasionally', 'Yes', 'Any']),
      lifestyleChoices: getRandomElements(['Fitness Enthusiast', 'Foodie', 'Traveler', 'Homebody', 'Social Butterfly', 'Career Oriented'], Math.floor(Math.random() * 3) + 1)
    },
    preferencesUpdatedOn: new Date()
  };
};

// Function to seed the database with 1000 records
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await UserProfile.deleteMany({});
    await PartnerPreference.deleteMany({});
    
    console.log('Starting to seed 1000 entries...');

    // Generate and insert 1000 profiles with preferences
    for (let i = 0; i < 1000; i++) {
      // Create a user first
      const user = new User({
        clerkId: `clk_${Math.random().toString(36).substring(2, 15)}`,
        username: `user${i+1}`,
        email: `user${i+1}@example.com`,
        phoneNumber: `+91${Math.floor(7000000000 + Math.random() * 3000000000)}`
      });
      await user.save();

      // Create profile
      const profile = new UserProfile(generateIndianProfile(user._id));
      await profile.save();

      // Create preferences
      const preference = new PartnerPreference(generateIndianPreference(user._id, profile));
      await preference.save();

      if ((i + 1) % 100 === 0) {
        console.log(`Created ${i + 1} profiles and preferences`);
      }
    }

    console.log('Database seeded successfully with 1000 Indian matrimonial profiles!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 