const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
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

// Helper function to generate random date between two dates
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate fake profile data
const generateProfile = (userId) => {
  const gender = faker.helpers.arrayElement(['Male', 'Female']);
  const maritalStatus = faker.helpers.arrayElement(['Never Married', 'Divorced', 'Widowed']);
  const religion = faker.helpers.arrayElement(['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist']);
  const education = faker.helpers.arrayElement(['B.Tech', 'MBA', 'B.Sc', 'M.Sc', 'B.Com', 'M.Com', 'B.A', 'M.A']);
  const occupation = faker.helpers.arrayElement(['Software Engineer', 'Doctor', 'Teacher', 'Business', 'Government Job', 'Private Job']);

  return {
    userId,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number('+91##########'),
    dateOfBirth: getRandomDate(new Date(1980, 0, 1), new Date(2000, 0, 1)),
    gender,
    maritalStatus,
    height: `${faker.number.int({ min: 150, max: 190 })} cm`,
    weight: faker.number.int({ min: 45, max: 100 }),
    bodyType: faker.helpers.arrayElement(['Slim', 'Average', 'Athletic', 'Heavy']),
    skinTone: faker.helpers.arrayElement(['Very Fair', 'Fair', 'Wheatish', 'Dark']),
    bloodGroup: faker.helpers.arrayElement(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-']),
    city: faker.location.city(),
    state: faker.location.state(),
    country: 'India',
    pincode: faker.location.zipCode('######'),
    religion,
    caste: faker.helpers.arrayElement(['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra']),
    education,
    occupation,
    employer: faker.company.name(),
    annualIncome: faker.number.int({ min: 300000, max: 2000000 }),
    workLocation: faker.location.city(),
    hobbies: faker.helpers.arrayElements(['Reading', 'Traveling', 'Music', 'Dancing', 'Cooking', 'Sports', 'Photography'], 3),
    interests: faker.helpers.arrayElements(['Technology', 'Business', 'Art', 'Science', 'Politics', 'Sports'], 3),
    diet: faker.helpers.arrayElement(['Vegetarian', 'Non-Vegetarian', 'Eggetarian']),
    smoking: faker.helpers.arrayElement(['No', 'Occasionally', 'Yes']),
    drinking: faker.helpers.arrayElement(['No', 'Occasionally', 'Yes']),
    profileVisibility: 'Public',
    contactPreference: 'Email',
    showPhone: faker.datatype.boolean(),
    showEmail: faker.datatype.boolean(),
    aboutYourself: faker.lorem.paragraph(),
    motherTongue: faker.helpers.arrayElement(['Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi']),
    familyType: faker.helpers.arrayElement(['Nuclear', 'Joint']),
    familyStatus: faker.helpers.arrayElement(['Middle Class', 'Upper Middle Class', 'Rich']),
    brothers: faker.number.int({ min: 0, max: 3 }),
    sisters: faker.number.int({ min: 0, max: 3 }),
    fitnessLevel: faker.helpers.arrayElement(['Active', 'Moderate', 'Sedentary'])
  };
};

// Generate fake preference data
const generatePreference = (userId) => {
  return {
    userId,
    essentialPrefs: {
      ageRange: {
        min: faker.number.int({ min: 25, max: 30 }),
        max: faker.number.int({ min: 31, max: 40 })
      },
      religion: faker.helpers.arrayElement(['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist']),
      motherTongue: faker.helpers.arrayElement(['Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi']),
      maritalStatus: faker.helpers.arrayElement(['Never Married', 'Divorced', 'Widowed']),
      education: faker.helpers.arrayElement(['B.Tech', 'MBA', 'B.Sc', 'M.Sc', 'B.Com', 'M.Com', 'B.A', 'M.A']),
      height: {
        min: faker.number.int({ min: 150, max: 160 }),
        max: faker.number.int({ min: 161, max: 190 })
      },
      income: faker.helpers.arrayElement(['3-5 Lakhs', '5-10 Lakhs', '10-20 Lakhs', '20+ Lakhs']),
      familyType: faker.helpers.arrayElement(['Nuclear', 'Joint']),
      weight: {
        min: faker.number.int({ min: 45, max: 60 }),
        max: faker.number.int({ min: 61, max: 80 })
      },
      occupation: faker.helpers.arrayElement(['Software Engineer', 'Doctor', 'Teacher', 'Business', 'Government Job', 'Private Job'])
    },
    optionalPrefs: {
      hobbies: faker.helpers.arrayElements(['Reading', 'Traveling', 'Music', 'Dancing', 'Cooking', 'Sports', 'Photography'], 3),
      foodPreferences: faker.helpers.arrayElements(['Vegetarian', 'Non-Vegetarian', 'Eggetarian'], 1),
      location: faker.helpers.arrayElements(['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'], 2),
      lifestyleChoices: faker.helpers.arrayElements(['Fitness Enthusiast', 'Foodie', 'Traveler', 'Homebody', 'Social Butterfly'], 2)
    }
  };
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await UserProfile.deleteMany({});
    await PartnerPreference.deleteMany({});

    // Generate and insert 50 profiles with preferences
    for (let i = 0; i < 50; i++) {
      // Create a user first
      const user = new User({
        clerkId: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number('+91##########')
      });
      await user.save();

      // Create profile
      const profile = new UserProfile(generateProfile(user._id));
      await profile.save();

      // Create preferences
      const preference = new PartnerPreference(generatePreference(user._id));
      await preference.save();

      console.log(`Created profile and preferences for user ${i + 1}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 