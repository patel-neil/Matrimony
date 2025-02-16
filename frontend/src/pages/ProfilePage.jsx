import React, { useState } from 'react';

const ProfileCompletion = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    maritalStatus: '',
    
    // Professional Info
    occupation: '',
    company: '',
    annualIncome: '',
    workLocation: '',
    
    // Education
    highestEducation: '',
    college: '',
    graduationYear: '',
    
    // Family Details
    familyType: '',
    familyValues: '',
    familyStatus: '',
    siblings: '',
    
    // Preferences
    partnerAgeRange: '',
    partnerHeight: '',
    partnerEducation: '',
    partnerOccupation: ''
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter first name"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter last name"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
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
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Occupation
        </label>
        <input
          type="text"
          name="occupation"
          value={formData.occupation}
          onChange={handleInputChange}
          placeholder="Enter occupation"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          placeholder="Enter company name"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Annual Income
        </label>
        <input
          type="text"
          name="annualIncome"
          value={formData.annualIncome}
          onChange={handleInputChange}
          placeholder="Enter annual income"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Highest Education
        </label>
        <select
          name="highestEducation"
          value={formData.highestEducation}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Education Level</option>
          <option value="bachelors">Bachelor's Degree</option>
          <option value="masters">Master's Degree</option>
          <option value="phd">Ph.D.</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          College/University
        </label>
        <input
          type="text"
          name="college"
          value={formData.college}
          onChange={handleInputChange}
          placeholder="Enter college name"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderFamilyDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Family Type
        </label>
        <select
          name="familyType"
          value={formData.familyType}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Family Type</option>
          <option value="joint">Joint Family</option>
          <option value="nuclear">Nuclear Family</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Family Values
        </label>
        <select
          name="familyValues"
          value={formData.familyValues}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Family Values</option>
          <option value="traditional">Traditional</option>
          <option value="moderate">Moderate</option>
          <option value="liberal">Liberal</option>
        </select>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Age Range
        </label>
        <input
          type="text"
          name="partnerAgeRange"
          value={formData.partnerAgeRange}
          onChange={handleInputChange}
          placeholder="e.g., 25-30 years"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Partner's Education
        </label>
        <select
          name="partnerEducation"
          value={formData.partnerEducation}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Education Level</option>
          <option value="bachelors">Bachelor's or higher</option>
          <option value="masters">Master's or higher</option>
          <option value="phd">Ph.D.</option>
        </select>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderProfessionalInfo();
      case 3:
        return renderEducation();
      case 4:
        return renderFamilyDetails();
      case 5:
        return renderPreferences();
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Personal Information";
      case 2:
        return "Professional Information";
      case 3:
        return "Education";
      case 4:
        return "Family Details";
      case 5:
        return "Partner Preferences";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{getStepTitle()}</h2>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-500 mb-6">
            Step {step} of {totalSteps}
          </div>

          <form className="space-y-6">
            {renderStepContent()}
            <div className="flex justify-between mt-6">
              <button
                type="button"
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
                type="button"
                onClick={step === totalSteps ? () => console.log(formData) : nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {step === totalSteps ? 'Submit' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;