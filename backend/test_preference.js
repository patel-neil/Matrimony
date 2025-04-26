const mongoose = require('mongoose');
const Preference = require('./models/Preference');

async function testPreference() {
    try {
        await mongoose.connect('mongodb+srv://neil200417:neil2017@cluster0.s91vbxd.mongodb.net/test');
        console.log('Connected to MongoDB');

        // Create a test preference
        const testPreference = new Preference({
            userId: new mongoose.Types.ObjectId(), // Using a new ObjectId for testing
            essentialPrefs: {
                gender: 'Male',
                ageRange: { min: 25, max: 35 },
                religion: 'Hindu',
                motherTongue: 'Hindi',
                maritalStatus: 'Never Married',
                education: 'Bachelor\'s',
                height: { min: 150, max: 190 },
                income: '₹10-15 Lakh',
                familyType: 'Nuclear',
                weight: { min: 45, max: 90 },
                occupation: 'Engineer'
            },
            optionalPrefs: {
                hobbies: ['Reading', 'Traveling'],
                foodPreferences: ['Vegetarian'],
                location: ['Metro Cities'],
                lifestyleChoices: ['Fitness Enthusiast']
            }
        });

        // Try to save the preference
        const savedPreference = await testPreference.save();
        console.log('Successfully saved preference with gender:', savedPreference.essentialPrefs.gender);

        // Try to find the preference
        const foundPreference = await Preference.findOne({ _id: savedPreference._id });
        console.log('Found preference with gender:', foundPreference.essentialPrefs.gender);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

testPreference(); 