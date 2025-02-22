import React, { useState, useEffect } from 'react';

const PartnerPreferencePage = () => {
  // Essential Preferences (Mandatory)
  const [essentialPrefs, setEssentialPrefs] = useState({
    ageRange: { min: 25, max: 35 },
    religion: '',
    motherTongue: '',
    maritalStatus: '',
    education: '',
    height: { min: 150, max: 190 }, // in cm
    income: '',
    familyType: '',
    weight: { min: 45, max: 90 }, // in kg
    occupation: '',
  });

  // Optional Preferences (Multi-selectable)
  const [optionalPrefs, setOptionalPrefs] = useState({
    hobbies: [],
    foodPreferences: [],
    location: [],
    lifestyleChoices: []
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Options for dropdown menus
  const options = {
    religion: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'No Religion', 'Spiritual', 'Other'],
    motherTongue: ['Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada', 'Odia', 'Punjabi', 'Malayalam', 'English'],
    maritalStatus: ['Never Married', 'Divorced', 'Widowed', 'Separated'],
    education: ['High School', 'Bachelor\'s', 'Master\'s', 'Doctorate', 'Diploma', 'Trade School'],
    income: ['Below ₹5 Lakh', '₹5-10 Lakh', '₹10-15 Lakh', '₹15-20 Lakh', '₹20-30 Lakh', '₹30-50 Lakh', '₹50 Lakh-1 Crore', 'Above ₹1 Crore'],
    familyType: ['Nuclear', 'Joint', 'Extended', 'Single Parent'],
    occupation: ['IT Professional', 'Doctor', 'Engineer', 'Teacher/Professor', 'Business Owner', 'Government Employee', 'Finance Professional', 'Lawyer', 'Artist', 'Self-Employed', 'Homemaker', 'Student'],
    hobbies: ['Reading', 'Cooking', 'Traveling', 'Photography', 'Music', 'Dancing', 'Painting', 'Writing', 'Sports', 'Yoga', 'Meditation', 'Gardening', 'Hiking'],
    foodPreferences: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian', 'Jain Food'],
    location: ['North India', 'South India', 'East India', 'West India', 'Central India', 'Northeast India', 'Metro Cities', 'Tier 2 Cities', 'Rural Areas', 'Willing to Relocate'],
    lifestyleChoices: ['Early Riser', 'Night Owl', 'Fitness Enthusiast', 'Homebody', 'Social Butterfly', 'Pet Lover', 'Environmentally Conscious', 'Minimalist']
  };

  // Handle changes for essential preferences
  const handleEssentialChange = (field, value) => {
    setEssentialPrefs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle changes for age and height range sliders
  const handleRangeChange = (field, key, value) => {
    setEssentialPrefs(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: parseInt(value)
      }
    }));
  };

  // Handle changes for optional preferences (multi-select)
  const handleOptionalChange = (field, value) => {
    setOptionalPrefs(prev => {
      // If value is already selected, remove it
      if (prev[field].includes(value)) {
        return {
          ...prev,
          [field]: prev[field].filter(item => item !== value)
        };
      }
      // Otherwise add it
      return {
        ...prev,
        [field]: [...prev[field], value]
      };
    });
  };

  // Form validation
  useEffect(() => {
    if (submitted) {
      validateForm();
    }
  }, [essentialPrefs, submitted]);

  const validateForm = () => {
    const newErrors = {};
    
    // Check if essential fields are filled
    if (!essentialPrefs.religion) newErrors.religion = 'Religion is required';
    if (!essentialPrefs.motherTongue) newErrors.motherTongue = 'Mother tongue is required';
    if (!essentialPrefs.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
    if (!essentialPrefs.education) newErrors.education = 'Education is required';
    if (!essentialPrefs.income) newErrors.income = 'Income is required';
    if (!essentialPrefs.familyType) newErrors.familyType = 'Family type is required';
    if (!essentialPrefs.occupation) newErrors.occupation = 'Occupation is required';
    
    // Validate ranges
    if (essentialPrefs.ageRange.min >= essentialPrefs.ageRange.max) {
      newErrors.ageRange = 'Minimum age should be less than maximum age';
    }
    
    if (essentialPrefs.height.min >= essentialPrefs.height.max) {
      newErrors.height = 'Minimum height should be less than maximum height';
    }
    
    if (essentialPrefs.weight.min >= essentialPrefs.weight.max) {
      newErrors.weight = 'Minimum weight should be less than maximum weight';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (validateForm()) {
      // In a real app, you would send this data to your backend
      console.log("Form submitted successfully!", {
        essentialPreferences: essentialPrefs,
        optionalPreferences: optionalPrefs
      });
      
      // Show success message or redirect
      alert("Partner preferences saved successfully!");
    } else {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Helper function to format height
  const formatHeight = (cm) => {
    const feet = Math.floor(cm / 30.48);
    const inches = Math.round((cm - (feet * 30.48)) / 2.54);
    return `${feet}'${inches}" (${cm}cm)`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-rose-100 p-6">
          <h1 className="text-3xl font-serif text-rose-800 text-center">Partner Preferences</h1>
          <p className="text-center text-gray-600 mt-2">Tell us about your ideal life partner</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {/* Essential Preferences Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-serif text-rose-700 mb-6 pb-2 border-b border-rose-200">
              Essential Preferences <span className="text-sm text-rose-500 font-sans">(Required)</span>
            </h2>
            
            {/* Age Range */}
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2" id="ageRange">
                Age Range (years)
              </label>
              <div className="flex flex-wrap items-center gap-6">
                <div className="w-full md:w-2/3">
                  <div className="flex justify-between mb-1 text-sm text-gray-500">
                    <span>18</span>
                    <span>60</span>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="18"
                      max="60"
                      value={essentialPrefs.ageRange.min}
                      onChange={(e) => handleRangeChange('ageRange', 'min', e.target.value)}
                      className="w-full accent-rose-500"
                    />
                    <input
                      type="range"
                      min="18"
                      max="60"
                      value={essentialPrefs.ageRange.max}
                      onChange={(e) => handleRangeChange('ageRange', 'max', e.target.value)}
                      className="w-full accent-rose-500"
                    />
                  </div>
                </div>
                <div className="text-rose-700">
                  {essentialPrefs.ageRange.min} - {essentialPrefs.ageRange.max} years
                </div>
              </div>
              {errors.ageRange && <p className="text-red-500 text-sm mt-1">{errors.ageRange}</p>}
            </div>
            
            {/* Religion */}
            <div className="mb-6">
              <label htmlFor="religion" className="block text-gray-700 font-medium mb-2">
                Religion
              </label>
              <select
                id="religion"
                value={essentialPrefs.religion}
                onChange={(e) => handleEssentialChange('religion', e.target.value)}
                className={`w-full p-3 border ${errors.religion ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50`}
              >
                <option value="">Select Religion</option>
                {options.religion.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.religion && <p className="text-red-500 text-sm mt-1">{errors.religion}</p>}
            </div>
            
            {/* Mother Tongue */}
            <div className="mb-6">
              <label htmlFor="motherTongue" className="block text-gray-700 font-medium mb-2">
                Mother Tongue
              </label>
              <select
                id="motherTongue"
                value={essentialPrefs.motherTongue}
                onChange={(e) => handleEssentialChange('motherTongue', e.target.value)}
                className={`w-full p-3 border ${errors.motherTongue ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50`}
              >
                <option value="">Select Mother Tongue</option>
                {options.motherTongue.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.motherTongue && <p className="text-red-500 text-sm mt-1">{errors.motherTongue}</p>}
            </div>
            
            {/* Marital Status */}
            <div className="mb-6">
              <fieldset>
                <legend className="block text-gray-700 font-medium mb-2">Marital Status</legend>
                <div className="flex flex-wrap gap-4">
                  {options.maritalStatus.map(status => (
                    <div key={status} className="flex items-center">
                      <input
                        type="radio"
                        id={`marital-${status}`}
                        name="maritalStatus"
                        value={status}
                        checked={essentialPrefs.maritalStatus === status}
                        onChange={(e) => handleEssentialChange('maritalStatus', e.target.value)}
                        className="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                      />
                      <label htmlFor={`marital-${status}`} className="ml-2 text-gray-700">
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
              </fieldset>
            </div>
            
            {/* Education */}
            <div className="mb-6">
              <label htmlFor="education" className="block text-gray-700 font-medium mb-2">
                Minimum Education
              </label>
              <select
                id="education"
                value={essentialPrefs.education}
                onChange={(e) => handleEssentialChange('education', e.target.value)}
                className={`w-full p-3 border ${errors.education ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50`}
              >
                <option value="">Select Education Level</option>
                {options.education.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
            </div>
            
            {/* Income */}
            <div className="mb-6">
              <label htmlFor="income" className="block text-gray-700 font-medium mb-2">
                Annual Income
              </label>
              <select
                id="income"
                value={essentialPrefs.income}
                onChange={(e) => handleEssentialChange('income', e.target.value)}
                className={`w-full p-3 border ${errors.income ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50`}
              >
                <option value="">Select Income Range</option>
                {options.income.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.income && <p className="text-red-500 text-sm mt-1">{errors.income}</p>}
            </div>
            
            {/* Family Type */}
            <div className="mb-6">
              <fieldset>
                <legend className="block text-gray-700 font-medium mb-2">Family Type</legend>
                <div className="flex flex-wrap gap-4">
                  {options.familyType.map(type => (
                    <div key={type} className="flex items-center">
                      <input
                        type="radio"
                        id={`family-${type}`}
                        name="familyType"
                        value={type}
                        checked={essentialPrefs.familyType === type}
                        onChange={(e) => handleEssentialChange('familyType', e.target.value)}
                        className="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                      />
                      <label htmlFor={`family-${type}`} className="ml-2 text-gray-700">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.familyType && <p className="text-red-500 text-sm mt-1">{errors.familyType}</p>}
              </fieldset>
            </div>
            
            {/* Occupation */}
            <div className="mb-6">
              <label htmlFor="occupation" className="block text-gray-700 font-medium mb-2">
                Occupation
              </label>
              <select
                id="occupation"
                value={essentialPrefs.occupation}
                onChange={(e) => handleEssentialChange('occupation', e.target.value)}
                className={`w-full p-3 border ${errors.occupation ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50`}
              >
                <option value="">Select Occupation</option>
                {options.occupation.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
            </div>
            
            {/* Height Range */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" id="height">
                Height Range
              </label>
              <div className="flex flex-wrap items-center gap-6">
                <div className="w-full md:w-2/3">
                  <div className="flex justify-between mb-1 text-sm text-gray-500">
                    <span>4'7" (140cm)</span>
                    <span>6'6" (198cm)</span>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="140"
                      max="198"
                      value={essentialPrefs.height.min}
                      onChange={(e) => handleRangeChange('height', 'min', e.target.value)}
                      className="w-full accent-rose-500"
                    />
                    <input
                      type="range"
                      min="140"
                      max="198"
                      value={essentialPrefs.height.max}
                      onChange={(e) => handleRangeChange('height', 'max', e.target.value)}
                      className="w-full accent-rose-500"
                    />
                  </div>
                </div>
                <div className="text-rose-700">
                  {formatHeight(essentialPrefs.height.min)} - {formatHeight(essentialPrefs.height.max)}
                </div>
              </div>
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>
            
            {/* Weight Range */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" id="weight">
                Weight Range (kg)
              </label>
              <div className="flex flex-wrap items-center gap-6">
                <div className="w-full md:w-2/3">
                  <div className="flex justify-between mb-1 text-sm text-gray-500">
                    <span>45 kg</span>
                    <span>120 kg</span>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="45"
                      max="120"
                      value={essentialPrefs.weight.min}
                      onChange={(e) => handleRangeChange('weight', 'min', e.target.value)}
                      className="w-full accent-rose-500"
                    />
                    <input
                      type="range"
                      min="45"
                      max="120"
                      value={essentialPrefs.weight.max}
                      onChange={(e) => handleRangeChange('weight', 'max', e.target.value)}
                      className="w-full accent-rose-500"
                    />
                  </div>
                </div>
                <div className="text-rose-700">
                  {essentialPrefs.weight.min} - {essentialPrefs.weight.max} kg
                </div>
              </div>
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>
          </div>
          
          {/* Optional Preferences Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-serif text-rose-700 mb-6 pb-2 border-b border-rose-200">
              Optional Preferences <span className="text-sm text-rose-500 font-sans">(Select multiple as applicable)</span>
            </h2>
            
            {/* Hobbies */}
            <div className="mb-8">
              <fieldset>
                <legend className="block text-gray-700 font-medium mb-2">Hobbies & Interests</legend>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {options.hobbies.map(hobby => (
                    <div key={hobby} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`hobby-${hobby}`}
                        checked={optionalPrefs.hobbies.includes(hobby)}
                        onChange={() => handleOptionalChange('hobbies', hobby)}
                        className="h-4 w-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
                      />
                      <label htmlFor={`hobby-${hobby}`} className="ml-2 text-gray-700">
                        {hobby}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            
            {/* Food Preferences */}
            <div className="mb-8">
              <fieldset>
                <legend className="block text-gray-700 font-medium mb-2">Food Preferences</legend>
                <div className="flex flex-wrap gap-4">
                  {options.foodPreferences.map(pref => (
                    <div key={pref} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`food-${pref}`}
                        checked={optionalPrefs.foodPreferences.includes(pref)}
                        onChange={() => handleOptionalChange('foodPreferences', pref)}
                        className="h-4 w-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
                      />
                      <label htmlFor={`food-${pref}`} className="ml-2 text-gray-700">
                        {pref}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            
            {/* Location Preferences */}
            <div className="mb-8">
              <fieldset>
                <legend className="block text-gray-700 font-medium mb-2">Location Preferences</legend>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {options.location.map(loc => (
                    <div key={loc} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`location-${loc}`}
                        checked={optionalPrefs.location.includes(loc)}
                        onChange={() => handleOptionalChange('location', loc)}
                        className="h-4 w-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
                      />
                      <label htmlFor={`location-${loc}`} className="ml-2 text-gray-700">
                        {loc}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            
            {/* Lifestyle Choices */}
            <div className="mb-6">
              <fieldset>
                <legend className="block text-gray-700 font-medium mb-2">Lifestyle Choices</legend>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {options.lifestyleChoices.map(choice => (
                    <div key={choice} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`lifestyle-${choice}`}
                        checked={optionalPrefs.lifestyleChoices.includes(choice)}
                        onChange={() => handleOptionalChange('lifestyleChoices', choice)}
                        className="h-4 w-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
                      />
                      <label htmlFor={`lifestyle-${choice}`} className="ml-2 text-gray-700">
                        {choice}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
          
          {/* Preference Summary Card */}
          <div className="bg-rose-50 p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-xl font-serif text-rose-700 mb-4">Your Preference Summary</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Essential Preferences</h4>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li>Age: {essentialPrefs.ageRange.min} - {essentialPrefs.ageRange.max} years</li>
                  <li>Religion: {essentialPrefs.religion || "Not specified"}</li>
                  <li>Mother Tongue: {essentialPrefs.motherTongue || "Not specified"}</li>
                  <li>Marital Status: {essentialPrefs.maritalStatus || "Not specified"}</li>
                  <li>Education: {essentialPrefs.education || "Not specified"}</li>
                  <li>Income: {essentialPrefs.income || "Not specified"}</li>
                  <li>Family Type: {essentialPrefs.familyType || "Not specified"}</li>
                  <li>Occupation: {essentialPrefs.occupation || "Not specified"}</li>
                  <li>Height: {formatHeight(essentialPrefs.height.min)} - {formatHeight(essentialPrefs.height.max)}</li>
                  <li>Weight: {essentialPrefs.weight.min} - {essentialPrefs.weight.max} kg</li>
                </ul>
              </div>
              
              {/* Only show optional preferences that have been selected */}
              {Object.entries(optionalPrefs).some(([_, value]) => value.length > 0) && (
                <div>
                  <h4 className="font-medium text-gray-700">Optional Preferences</h4>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    {optionalPrefs.hobbies.length > 0 && (
                      <li>Hobbies & Interests: {optionalPrefs.hobbies.join(", ")}</li>
                    )}
                    {optionalPrefs.foodPreferences.length > 0 && (
                      <li>Food Preferences: {optionalPrefs.foodPreferences.join(", ")}</li>
                    )}
                    {optionalPrefs.location.length > 0 && (
                      <li>Location Preferences: {optionalPrefs.location.join(", ")}</li>
                    )}
                    {optionalPrefs.lifestyleChoices.length > 0 && (
                      <li>Lifestyle Choices: {optionalPrefs.lifestyleChoices.join(", ")}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-rose-600 text-white font-medium rounded-md shadow-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 transition-colors"
            >
              Save My Partner Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerPreferencePage;