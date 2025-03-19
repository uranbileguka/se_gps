import axios from "axios";

const API_URL = "http://127.0.0.1:8000/pages/api";


// login
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, userData);
    return response.data; // Returns { message, token }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// fleet
export const getFleetData = async () => {
  return axios.get(`${API_URL}/fleet/`);
};
