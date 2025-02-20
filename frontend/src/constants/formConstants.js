export const TOTAL_STEPS = 7;

export const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  profileImage: null,
  // ... rest of your initial state
};

export const HOBBIES = [
  'Reading', 'Traveling', 'Music', 'Sports',
  'Cooking', 'Photography', 'Dancing', 'Writing', 'Art'
];

export const RELIGIONS = [
  'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'
];

export const EDUCATION_LEVELS = [
  { value: 'highschool', label: 'High School' },
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'phd', label: 'PhD' }
];
