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


//**BRAND
//get brand
export const getBrandData = async () => {
  return axios.get(`${API_URL}/brandList/`);
};

// Delete brand
export const deleteBrand = async (id) => {
	return axios.delete(`${API_URL}/brands/${id}/`);
};

// Update brand
export const updateBrand = async (id, name) => {
	return axios.put(`${API_URL}/brands/${id}/`, { name });
};


// /create brand
export const createBrand = async (brandName) => {
	try {
		const response = await axios.post(`${API_URL}/brands/`, { name: brandName });
		return response.data;
	} catch (error) {
		// Optional: console.log(error.response) for debugging
		throw error.response?.data || error.message;
	}
};
