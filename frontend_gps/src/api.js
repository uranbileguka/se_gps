import axios from "axios";

const API_URL = "http://127.0.0.1:8000/pages/api";

export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/register/`, userData);
};

export const loginUser = async (userData) => {
  return axios.post(`${API_URL}/login/`, userData);
};

export const getFleetData = async () => {
  return axios.get(`${API_URL}/fleet/`);
};
