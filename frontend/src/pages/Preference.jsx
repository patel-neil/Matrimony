import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react"; // ✅ Import Clerk's authentication hook
import Layout from "../Components/Layout";

const PartnerPreferencePage = () => {

  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const [userId, setUserId] = useState(null);

  // Essential Preferences (Mandatory)
  const [essentialPrefs, setEssentialPrefs] = useState({
    gender: '',
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

  // Form validation state
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    const fetchUserId = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/getUser/${userEmail}`);
        
        // ✅ Log raw response to debug
        const text = await response.text();
        console.log("Raw response:", text);

        const data = JSON.parse(text);
        if (response.ok) {
          setUserId(data.userId);
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserId();
  }, [userEmail]);

  useEffect(() => {
    if (!userId) return;

    const fetchPreferences = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/preferences/${userId}`);
        if (response.ok) {
          const data = await response.json();
          // Set all essential preferences including gender
          setEssentialPrefs({
            gender: data.essentialPrefs.gender || '',
            ageRange: data.essentialPrefs.ageRange || { min: 25, max: 35 },
            religion: data.essentialPrefs.religion || '',
            motherTongue: data.essentialPrefs.motherTongue || '',
            maritalStatus: data.essentialPrefs.maritalStatus || '',
            education: data.essentialPrefs.education || '',
            height: data.essentialPrefs.height || { min: 150, max: 190 },
            income: data.essentialPrefs.income || '',
            familyType: data.essentialPrefs.familyType || '',
            weight: data.essentialPrefs.weight || { min: 45, max: 90 },
            occupation: data.essentialPrefs.occupation || ''
          });
          setIsUpdate(true);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPreferences();
  }, [userId]);

  // Options for dropdown menus
  const options = {
    gender: ['Male', 'Female'],
    religion: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'No Religion', 'Spiritual', 'Other', 'Any'],
    motherTongue: ['Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada', 'Odia', 'Punjabi', 'Malayalam', 'English', 'Other', 'Any'],
    maritalStatus: ['Never Married', 'Divorced', 'Widowed', 'Separated', 'Awaiting Divorce', 'Any'],
    education: ['Any', 'High School', '10+2', 'Diploma', 'B.Tech.', 'B.E.', 'B.Com.', 'BCom', 'B.Sc.', 'BCA', 'BBA', 'B.A.', 'B.Arch', 'BFA', 'B.Music', 'B.Pharm', 'BHM', 'BHMS', 'BAMS', 'BDS', 'BVSc', 'B.Ed', 'M.Tech.', 'MBA', 'MCA', 'M.Sc.', 'M.A.', 'M.Com.', 'M.Arch', 'M.Pharm', 'M.Ed', 'M.Music', 'MFA', 'MS', 'MBBS', 'MD', 'CA', 'CS', 'ICWA', 'LLB', 'LLM', 'PhD'],
    income: [
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
    ],
    familyType: ['Any', 'Nuclear', 'Joint', 'Extended', 'Single Parent'],
    occupation: ['Any', 'IT Professional', 'Doctor', 'Engineer', 'Teacher/Professor', 'Business Owner', 'Government Employee', 'Finance Professional', 'Lawyer', 'Artist', 'Self-Employed', 'Homemaker', 'Student', 'Professional', 'Service', 'Business', 'Other'],
  };

  // Handle changes for essential preferences
  const handleEssentialChange = (field, value) => {
    setEssentialPrefs(prev => ({
      ...prev,
      [field]: value // Keep the actual value, including 'Any'
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

  // Form validation
  useEffect(() => {
    if (submitted) {
      validateForm();
    }
  }, [essentialPrefs, submitted]);

  const validateForm = () => {
    const newErrors = {};
    
    // Only validate absolutely essential fields
    if (!essentialPrefs.gender) newErrors.gender = 'Gender is required';
    if (!essentialPrefs.religion) newErrors.religion = 'Religion is required';
    if (!essentialPrefs.motherTongue) newErrors.motherTongue = 'Mother tongue is required';
    if (!essentialPrefs.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
    if (!essentialPrefs.education) newErrors.education = 'Education is required';
    if (!essentialPrefs.income) newErrors.income = 'Income is required';
    if (!essentialPrefs.familyType) newErrors.familyType = 'Family type is required';
    if (!essentialPrefs.occupation) newErrors.occupation = 'Occupation is required';
    
    // Make other fields optional but validate ranges if provided
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
      console.log("Submitting preferences:", { essentialPrefs });
      savePreferences();
    } else {
      alert("Please fix the errors before submitting.");
    }
  };

  const savePreferences = async () => {
    if (!userId) {
      alert("User ID not found. Please refresh.");
      return;
    }

    try {
      const endpoint = isUpdate
        ? "http://localhost:5000/api/preferences/update"
        : "http://localhost:5000/api/preferences/save";

      const response = await fetch(endpoint, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, essentialPrefs }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(isUpdate ? "Preferences updated!" : "Preferences saved!");
        setIsUpdate(true);
        setTimeout(() => {
          window.location.href = '/matches';
        }, 2000);
      } else {
        alert(`Error: ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Network error. Check backend.");
    }
  };
  

  // Helper function to format height
  const formatHeight = (cm) => {
    const feet = Math.floor(cm / 30.48);
    const inches = Math.round((cm - (feet * 30.48)) / 2.54);
    return `${feet}'${inches}" (${cm}cm)`;
  };

  return (
    <Layout>
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
              
              {/* Gender */}
              <div className="mb-6">
                <fieldset>
                  <legend className="block text-gray-700 font-medium mb-2">Preferred Gender</legend>
                  <div className="flex flex-wrap gap-4">
                    {options.gender.map(type => (
                      <div key={type} className="flex items-center">
                        <input
                          type="radio"
                          id={`gender-${type}`}
                          name="gender"
                          value={type}
                          checked={essentialPrefs.gender === type}
                          onChange={(e) => handleEssentialChange('gender', e.target.value)}
                          className="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                        />
                        <label htmlFor={`gender-${type}`} className="ml-2 text-gray-700">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </fieldset>
              </div>
              
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
            
            {/* Preference Summary Card */}
            <div className="bg-rose-50 p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-xl font-serif text-rose-700 mb-4">Your Preference Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Essential Preferences</h4>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>Preferred Gender: {essentialPrefs.gender || "Not specified"}</li>
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
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-rose-600 text-white font-medium rounded-md shadow-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 transition-colors"
              >
                Save My Partner Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PartnerPreferencePage;