import React, { useState, useEffect } from 'react';
import { Upload, Camera, MapPin, Book, Briefcase, Heart, Lock, CheckCircle, Share2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileSystem = () => {
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
  //
    // Physical Information
    height: '',
    weight: '',
    bodyType: '',
    skinTone: '',
    physicalDisability: '',
    disabilityDetails: '',
    bloodGroup: '',
    hairTypeColor: '',
    eyeColor: '',
    medicalConditions: '',
    pastSurgeries: '',
    surgeryDetails: '',
    piercingsTattoos: '',


  //
    // Location
    city: '',
    country: '',
    state: '',
    pincode: '',

    // Religion & Community
    religion: '',
    caste: '',
    subCaste: '',
    community: '',

    // Horoscope
    birthTime: '',
    birthPlace: '',
    gothra: '',
    manglik: '',
    
    // Education & Career
    education: '',
    occupation: '',
    employer: '',
    annualIncome: '',
    workLocation: '',

    // Lifestyle & Interests
    hobbies: [],
    interests: [],
    diet: '',
    smoking: '',
    drinking: '',

    // Privacy Settings
    profileVisibility: 'all',
    contactPreference: 'all',
    showPhone: false,
    showEmail: false,

    // Social Media
    linkedin: '',
    instagram: '',

    // Documents
    aadharCard: null,
    educationCertificate: null,
    incomeCertificate: null,

    // Partner Preferences
    partnerAgeRange: '',
    partnerHeight: '',
    partnerEducation: '',
    partnerOccupation: '',
    partnerLocation: '',
    partnerIncome: '',

    // About Yourself
    aboutYourself: ''
  });

  const TOTAL_STEPS = 10;

  useEffect(() => {
    // Load saved form data from localStorage
    const savedData = localStorage.getItem('matrimonialFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-save after 1 second of inactivity
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const timer = setTimeout(() => {
      localStorage.setItem('matrimonialFormData', JSON.stringify({
        ...formData,
        [name]: value
      }));
    }, 1000);
    setAutoSaveTimer(timer);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (type, file) => {
    setFormData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleHobbiesChange = (hobby) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby]
    }));
  };

  const renderProfilePicture = () => (
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative w-32 h-32">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600"
          >
            <Upload className="w-4 h-4 text-white" />
          </label>
          <input
            id="profile-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <p className="text-sm text-gray-500">
            Add a clear, recent photo to increase profile visibility
          </p>
        </div>
      </div>
    </div>
  );
  

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Basic Information</h2>
      
      {renderProfilePicture()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
  
  const renderPhysicalInformation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Physical Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height
          </label>
          <input
            type="text"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder='Enter Height (e.g., 5"8")'
            required
          />
        </div>
  
        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Weight (Optional)"
          />
        </div>
  
        {/* Body Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Body Type
          </label>
          <select
            name="bodyType"
            value={formData.bodyType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Body Type</option>
            <option value="slim">Slim</option>
            <option value="athletic">Athletic</option>
            <option value="average">Average</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>
  
        {/* Skin Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skin Tone
          </label>
          <select
            name="skinTone"
            value={formData.skinTone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Skin Tone</option>
            <option value="fair">Fair</option>
            <option value="wheatish">Wheatish</option>
            <option value="dusky">Dusky</option>
            <option value="dark">Dark</option>
          </select>
        </div>
  
        {/* Physical Disability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Physical Disability
          </label>
          <select
            name="physicalDisability"
            value={formData.physicalDisability}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          {formData.physicalDisability === 'yes' && (
            <input
              type="text"
              name="disabilityDetails"
              value={formData.disabilityDetails}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please specify the disability"
            />
          )}
        </div>
  
        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Blood Group</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
  
        {/* Hair Type & Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hair Type & Color
          </label>
          <input
            type="text"
            name="hairTypeColor"
            value={formData.hairTypeColor}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Straight Black, Curly Brown, Balding"
          />
        </div>
  
        {/* Eye Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Eye Color
          </label>
          <select
            name="eyeColor"
            value={formData.eyeColor}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Eye Color</option>
            <option value="black">Black</option>
            <option value="brown">Brown</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="hazel">Hazel</option>
          </select>
        </div>
  
        {/* Medical Conditions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medical Conditions
          </label>
          <input
            type="text"
            name="medicalConditions"
            value={formData.medicalConditions}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Diabetes, Hypertension (Optional)"
          />
        </div>
  
        {/* Past Surgeries or Major Health Issues */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Past Surgeries / Major Health Issues
          </label>
          <select
            name="pastSurgeries"
            value={formData.pastSurgeries}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          {formData.pastSurgeries === 'yes' && (
            <input
              type="text"
              name="surgeryDetails"
              value={formData.surgeryDetails}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Specify surgery/health issue details"
            />
          )}
        </div>
  
        {/* Piercings / Tattoos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Piercings / Tattoos
          </label>
          <select
            name="piercingsTattoos"
            value={formData.piercingsTattoos}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
  
        {/* Fitness Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fitness Level
          </label>
          <select
            name="fitnessLevel"
            value={formData.fitnessLevel}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Fitness Level</option>
            <option value="sedentary">Sedentary</option>
            <option value="active">Active</option>
            <option value="veryFit">Very Fit</option>
          </select>
        </div>
      </div>
    </div>
  );
  

  const renderReligionCommunity = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Religion & Community</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Religion
          </label>
          <select
            name="religion"
            value={formData.religion}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Religion</option>
            <option value="hindu">Hindu</option>
            <option value="muslim">Muslim</option>
            <option value="christian">Christian</option>
            <option value="sikh">Sikh</option>
            <option value="buddhist">Buddhist</option>
            <option value="jain">Jain</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Caste (Optional)
          </label>
          <input
            type="text"
            name="caste"
            value={formData.caste}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Community
          </label>
          <input
            type="text"
            name="community"
            value={formData.community}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderHoroscope = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Horoscope Details (Optional)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time of Birth
          </label>
          <input
           type="date"
           name="dateOfBirth"
           value={formData.dateOfBirth}
           onChange={handleInputChange}
           className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
           />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Place of Birth
          </label>
          <input
            type="text"
            name="birthPlace"
            value={formData.birthPlace}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Document Verification</h2>
      
      <div className="space-y-4">
        {[
          { key: 'aadharCard', label: 'Aadhar Card', required: true },
          { key: 'educationCertificate', label: 'Education Certificate', required: true },
          { key: 'incomeCertificate', label: 'Income Certificate', required: false }
        ].map(({ key, label, required }) => (
          <div key={key} className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {required && '*'}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                onChange={(e) => handleDocumentUpload(key, e.target.files[0])}
                className="hidden"
                id={`file-${key}`}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label
                htmlFor={`file-${key}`}
                className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-md cursor-pointer hover:border-blue-500"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-sm text-gray-600">
                    {formData[key] ? formData[key].name : 'Click to upload'}
                  </span>
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Location Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
//

const renderBasicDetails = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Basic Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marital Status
          </label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Marital Status</option>
            <option value="neverMarried">Never Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
          </select>
        </div>
  
       
  
       
  
       
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mother Tongue
          </label>
          <select
            name="motherTongue"
            value={formData.motherTongue}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Mother Tongue</option>
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
            <option value="tamil">Tamil</option>
            <option value="telugu">Telugu</option>
            <option value="bengali">Bengali</option>
            <option value="marathi">Marathi</option>
            <option value="punjabi">Punjabi</option>
            <option value="gujarati">Gujarati</option>
            <option value="other">Other</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Community
          </label>
          <input
            type="text"
            name="community"
            value={formData.community}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Community"
            required
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub-Community
          </label>
          <input
            type="text"
            name="subCommunity"
            value={formData.subCommunity}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Sub-Community"
            required
          />
        </div>
      </div>
    </div>
  );
  

//
  const renderEducationCareer = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Education & Career</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Highest Education
          </label>
          <select
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Education</option>
            <option value="highschool">High School</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="phd">PhD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Employer
          </label>
          <input
            type="text"
            name="employer"
            value={formData.employer}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Income
          </label>
          <input
            type="number"
            name="annualIncome"
            value={formData.annualIncome}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
         
         
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Location
          </label>
          <input
            type="text"
            name="workLocation"
            value={formData.workLocation}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderLifestyleInterests = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Lifestyle & Interests</h2>
      
      {/* Hobbies */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Hobbies</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Reading', 'Traveling', 'Music', 'Sports', 'Cooking', 'Photography', 'Dancing', 'Writing', 'Art'].map(hobby => (
            <label key={hobby} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.hobbies.includes(hobby)}
                onChange={() => handleHobbiesChange(hobby)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{hobby}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Diet, Smoking, Drinking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diet Preference
          </label>
          <select
            name="diet"
            value={formData.diet}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Diet</option>
            <option value="veg">Vegetarian</option>
            <option value="nonveg">Non-Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Smoking Habits
          </label>
          <select
            name="smoking"
            value={formData.smoking}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Smoking Habits</option>
            <option value="never">Never</option>
            <option value="occasionally">Occasionally</option>
            <option value="regularly">Regularly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Drinking Habits
          </label>
          <select
            name="drinking"
            value={formData.drinking}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Drinking Habits</option>
            <option value="never">Never</option>
            <option value="occasionally">Occasionally</option>
            <option value="regularly">Regularly</option>
          </select>
        </div>
      </div>
    </div>
  );
  const renderFamilyDetails = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Family Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Family Type *</label>
          <select
            name="familyType"
            value={formData.familyType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Family Type</option>
            <option value="joint">Joint</option>
            <option value="nuclear">Nuclear</option>
            <option value="extended">Extended</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Family Status *</label>
          <select
            name="familyStatus"
            value={formData.familyStatus}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Family Status</option>
            <option value="middle">Middle Class</option>
            <option value="upperMiddle">Upper Middle Class</option>
            <option value="affluent">Affluent</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Family Values *</label>
          <select
            name="familyValues"
            value={formData.familyValues}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Family Values</option>
            <option value="traditional">Traditional</option>
            <option value="moderate">Moderate</option>
            <option value="liberal">Liberal</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
          <input
            type="text"
            name="fatherOccupation"
            value={formData.fatherOccupation}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Retired Teacher, Businessman"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Occupation</label>
          <input
            type="text"
            name="motherOccupation"
            value={formData.motherOccupation}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Homemaker, Doctor"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Brothers</label>
          <input
            type="number"
            name="brothers"
            value={formData.brothers}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            placeholder="e.g., 2"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Sisters</label>
          <input
            type="number"
            name="sisters"
            value={formData.sisters}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            placeholder="e.g., 1"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Family Contact Number</label>
          <input
            type="tel"
            name="familyContact"
            value={formData.familyContact}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., +91 9876543210"
          />
        </div>
  
      </div>
    </div>
  );
  

  const renderAboutYourself = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">About Yourself</h2>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Tell us about yourself (maximum 200 words)
        </label>
        <textarea
          name="aboutYourself"
          value={formData.aboutYourself}
          onChange={handleInputChange}
          rows={6}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={1000} // Approximately 200 words
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formData.aboutYourself ? formData.aboutYourself.length : 0}/1000 characters</span>
          <span>{200 - Math.ceil((formData.aboutYourself ? formData.aboutYourself.split(/\s+/).length : 0))} words remaining</span>
        </div>
      </div>
    </div>
  );

  const getStepContent = () => {
    switch (step) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderBasicDetails();
      case 3:
        return renderLocation();
        
      case 4:
        return renderReligionCommunity();
       
      case 5:

        return renderEducationCareer();
      case 6:
        return renderLifestyleInterests();
      case 7:
        return renderHoroscope();
        case 8:
        return renderPhysicalInformation();

        case 9:
        return renderFamilyDetails();
        case 10:
            return  renderAboutYourself();
      default:
        return null;
    }
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const submitProfile = async () => {
    setLoading(true);
    try {
      // Here you would normally:
      // 1. Upload images to S3/Cloudinary
      // 2. Upload documents
      // 3. Submit form data to backend
      // 4. Handle verification process
      
      console.log('Profile submitted:', formData);
      Navigate('/');
      setVerificationStatus('pending');
    } catch (error) {
      console.error('Error submitting profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    return Math.round((step / TOTAL_STEPS) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-medium">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>

          {getStepContent()}

          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-4 py-2 rounded-md ${
                step === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            <button
              onClick={step === TOTAL_STEPS ? submitProfile : nextStep}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{step === TOTAL_STEPS ? 'Submit Profile' : 'Next'}</span>
              )}
            </button>
          </div>
        </div>

        {/* Verification Status Panel */}
        {verificationStatus && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className={`w-6 h-6 ${
                verificationStatus === 'verified' ? 'text-green-500' :
                verificationStatus === 'pending' ? 'text-yellow-500' :
                'text-red-500'
              }`} />
              <h3 className="text-lg font-medium">Verification Status</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">Profile Verification</p>
                  <p className="text-sm text-gray-500">
                    {verificationStatus === 'verified' ? 'Your profile is verified' :
                     verificationStatus === 'pending' ? 'Under review by our team' :
                     'Verification required'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                  verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
                </span>
              </div>

              {/* Document Verification Status */}
              <div className="space-y-2">
                {['Aadhar Card', 'Education Certificate', 'Income Certificate'].map((doc) => (
                  <div key={doc} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-sm">{doc}</span>
                    <span className="text-sm text-gray-500">
                      {formData[doc.toLowerCase().replace(/ /g, '')] ? 'Uploaded' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings Panel */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-medium">Privacy Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select
                name="profileVisibility"
                value={formData.profileVisibility}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Visible to All Members</option>
                <option value="premium">Premium Members Only</option>
                <option value="matches">Matched Profiles Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Preferences
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showPhone"
                    checked={formData.showPhone}
                    onChange={(e) => handleInputChange({
                      target: { name: 'showPhone', value: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Show phone number to matches</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showEmail"
                    checked={formData.showEmail}
                    onChange={(e) => handleInputChange({
                      target: { name: 'showEmail', value: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Show email to matches</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        Social Media Links
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Share2 className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-medium">Social Media Links</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile (Optional)
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Profile (Optional)
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourprofile"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Auto-save Indicator */}
        {autoSaveTimer && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-white"></div>
            <span>Saving changes...</span>
          </div>
        )}
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ProfileSystem;
=======
export default ProfileSystem;
>>>>>>> a8218027fdeaea373ba96f65cefd752f3efef181
