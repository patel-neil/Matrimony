import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Replace with your backend URL

// Fetch user profile
export const getUserProfile = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/getUser/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Save or update profile
export const saveProfile = async (profileData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/profile/save`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
};