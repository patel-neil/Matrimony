const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const User = require('../models/User');
const PartnerPreference = require('../models/Preference');

// Endpoint to get recommendations for a user
router.get('/recommendations/:clerkId', async (req, res) => {
    try {
        const clerkId = req.params.clerkId;
        
        if (!clerkId || typeof clerkId !== 'string' || clerkId.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Invalid clerkId format',
                details: 'The provided clerkId is invalid or empty'
            });
        }
        
        console.log('Looking for user with clerkId:', clerkId);
        
        // Find the user in our database using the Clerk user ID
        const user = await User.findOne({ clerkId });
        
        if (!user) {
            console.log('User not found with clerkId:', clerkId);
            return res.status(404).json({
                success: false,
                error: 'User not found',
                details: 'No user found with the provided Clerk ID'
            });
        }

        console.log('Found user:', user);
        
        // Get user's preferences
        const preferences = await PartnerPreference.findOne({ userId: user._id });
        
        if (!preferences) {
            console.log('Preferences not found for user:', user._id);
            return res.status(404).json({
                success: false,
                error: 'User preferences not found',
                details: 'Please set your partner preferences before getting recommendations'
            });
        }

        console.log('Found preferences:', JSON.stringify(preferences, null, 2));
        
        // Validate essential preferences
        if (!preferences.essentialPrefs) {
            console.error('Essential preferences missing');
            return res.status(400).json({
                success: false,
                error: 'Essential preferences are missing',
                details: 'Required preferences are not set'
            });
        }

        // Map preference fields to ML model input fields with validation
        const inputData = {
            preferences: {
                gender: user.gender === 'Male' ? 'Female' : 'Male', // Opposite gender for matching
                age_range: [
                    preferences.essentialPrefs.ageRange?.min || 18,
                    preferences.essentialPrefs.ageRange?.max || 99
                ],
                religion: preferences.essentialPrefs.religion || 'Any',
                mother_tongue: preferences.essentialPrefs.motherTongue || 'Any',
                marital_status: preferences.essentialPrefs.maritalStatus || 'Single',
                education: preferences.essentialPrefs.education || 'Any',
                height_range: [
                    preferences.essentialPrefs.height?.min || 0,
                    preferences.essentialPrefs.height?.max || 300
                ],
                weight_range: [
                    preferences.essentialPrefs.weight?.min || 0,
                    preferences.essentialPrefs.weight?.max || 300
                ],
                income_range: [
                    preferences.essentialPrefs.income || 'Any',
                    preferences.essentialPrefs.income || 'Any'
                ],
                family_type: preferences.essentialPrefs.familyType || 'Any',
                occupation: preferences.essentialPrefs.occupation || 'Any'
            }
        };

        // Convert input data to JSON string with proper formatting
        const inputJson = JSON.stringify(inputData, null, 2);
        console.log('Sending data to Python script:', inputJson);

        // Execute Python script with proper error handling
        const pythonProcess = spawn('python', ['matchmaking_model.py', '--recommend', inputJson], {
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
        });

        let output = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
            console.error('Python script debug:', data.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Python script exited with code:', code);
                console.error('Error output:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to generate recommendations',
                    details: error || 'Unknown error occurred'
                });
            }

            try {
                // Clean the output by removing any non-JSON content and extra whitespace
                const cleanOutput = output.trim().replace(/\s+/g, ' ');
                if (!cleanOutput) {
                    throw new Error('No output received from Python script');
                }

                // Try to parse the output directly first
                try {
                    const result = JSON.parse(cleanOutput);
                    if (!result.success) {
                        return res.status(404).json(result);
                    }
                    
                    // Ensure all user IDs are strings and clean up the response
                    if (result.matches) {
                        const recommendations = result.matches.map(match => ({
                            ...match,
                            user_id: match.user_id ? String(match.user_id) : match.user_id,
                            age: String(match.age),
                            height_cm: String(match.height_cm),
                            weight_kg: String(match.weight_kg),
                            income_usd: String(match.income_usd)
                        }));

                        return res.json({
                            success: true,
                            recommendations: recommendations,
                            debug: result.debug
                        });
                    }
                    
                    return res.json({
                        success: true,
                        recommendations: [],
                        debug: result.debug
                    });
                } catch (parseError) {
                    // If direct parsing fails, try to find the last JSON object
                    const jsonMatch = cleanOutput.match(/\{[\s\S]*\}/);
                    if (!jsonMatch) {
                        throw new Error('No valid JSON found in output');
                    }

                    const result = JSON.parse(jsonMatch[0]);
                    if (!result.success) {
                        return res.status(404).json(result);
                    }
                    
                    // Ensure all user IDs are strings and clean up the response
                    if (result.matches) {
                        const recommendations = result.matches.map(match => ({
                            ...match,
                            user_id: match.user_id ? String(match.user_id) : match.user_id,
                            age: String(match.age),
                            height_cm: String(match.height_cm),
                            weight_kg: String(match.weight_kg),
                            income_usd: String(match.income_usd)
                        }));

                        return res.json({
                            success: true,
                            recommendations: recommendations,
                            debug: result.debug
                        });
                    }
                    
                    return res.json({
                        success: true,
                        recommendations: [],
                        debug: result.debug
                    });
                }
            } catch (error) {
                console.error('Error processing Python script output:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to process recommendations',
                    details: error.message
                });
            }
        });

    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

module.exports = router;
