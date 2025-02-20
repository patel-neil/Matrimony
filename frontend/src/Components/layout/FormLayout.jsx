import React from 'react';
import { useProfileForm } from '../../context/ProfileFormContext';
import BasicInfo from '../form-sections/BasicInfo';
import Location from '../form-sections/Location';
import ReligionCommunity from '../form-sections/ReligionCommunity';
import Horoscope from '../form-sections/Horoscope';
import EducationCareer from '../form-sections/EducationCareer';
import LifestyleInterests from '../form-sections/LifestyleInterests';
import AboutYourself from '../form-sections/AboutYourself';
import NavigationButtons from '../common/NavigationButtons';

const FormContent = () => {
  const { step } = useProfileForm();

  const components = {
    1: BasicInfo,
    2: Location,
    3: ReligionCommunity,
    4: Horoscope,
    5: EducationCareer,
    6: LifestyleInterests,
    7: AboutYourself
  };

  const CurrentComponent = components[step];
  return CurrentComponent ? <CurrentComponent /> : null;
};

const FormLayout = ({ children }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {children}
      <FormContent />
      <NavigationButtons />
    </div>
  );
};

export default FormLayout;
