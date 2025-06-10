import axios from 'axios';

// Backend URL
const API_URL = 'http://localhost:3000/api/auth'; // Adjust this if your backend URL differs

// Register user
export const registerUser = async (name: string, email: string, password: string, role: string) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
    return response.data; // Returns the response data (token and user info)
  } catch (error:any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Returns the response data (token and user info)
  } catch (error:any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
