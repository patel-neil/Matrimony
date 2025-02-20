import React from 'react';
import { useProfileForm } from '../../context/ProfileFormContext';
import { TOTAL_STEPS } from '../../constants/formInitialState';

const ProgressBar = () => {
  const { step } = useProfileForm();
  const progress = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Profile Completion</span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
