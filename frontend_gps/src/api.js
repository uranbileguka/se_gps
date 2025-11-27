import axios from "axios";

// Use relative URLs - nginx will proxy to backend
const API_URL = "/pages/api";



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

// // fleet
// export const getFleetData = async () => {
//   return axios.get(`${API_URL}/fleet/`);
// };


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

// Fleet model
// / Fetch all Fleet models
export const getCarModelData = async () => {
  return axios.get(`${API_URL}/carmodels/`);
};

// Create a new Fleet model
export const createCarModel = async (name, brandId) => {
  return axios.post(`${API_URL}/carmodels/create/`, {
    name,
    brand: brandId,
  });
};

// Update a Fleet model
export const updateCarModel = async (id, name, brandId) => {
  return axios.put(`${API_URL}/carmodels/${id}/`, {
    name,
    brand: brandId,
  });
};

// Delete a Fleet model
export const deleteCarModel = async (id) => {
  return axios.delete(`${API_URL}/carmodels/${id}/`);
};

// /FLEET
// Get all fleets
export const getFleetData = async () => {
  return axios.get(`${API_URL}/fleets/`);
};

// Create new fleet
export const createFleet = async (fleetData) => {
  console.log(fleetData);
  return axios.post(`${API_URL}/fleets/create/`, fleetData);
};

// Update fleet
export const updateFleet = async (id, fleetData) => {
  return axios.put(`${API_URL}/fleets/${id}/`, fleetData);
};

// Delete fleet
export const deleteFleet = async (id) => {
  return axios.delete(`${API_URL}/fleets/${id}/`);
};

const API_N_URL = "/navixy/api";


// login
export const locationCountByTechnic = async (dateRange) => {
  try {
    const response = await axios.post(`${API_N_URL}/locationcountbytechnic/`, dateRange);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const locationCountByDate = async (dateRange) => {
  try {
    const response = await axios.post(`${API_N_URL}/locationcountbydate/`, dateRange);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllLocations = async () => {
  try {
    const response = await axios.get(`${API_N_URL}/locations/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAlltechnics = async () => {
  try {
    const response = await axios.get(`${API_N_URL}/technics/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const technicCountByTechnic = async (dateRange) => {
  try {
    const response = await axios.post(`${API_N_URL}/technicCountByTechnic/`, dateRange);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const technicCountByDate = async (dateRange) => {
  try {
    const response = await axios.post(`${API_N_URL}/technicCountByDate/`, dateRange);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const motohourCountByTechnic = async (dateRange) => {
  try {
    const response = await axios.post(`${API_N_URL}/motohourCountByTechnic/`, dateRange);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const motohourCountByDate = async (dateRange) => {
  try {
    const response = await axios.post(`${API_N_URL}/motohourCountByDate/`, dateRange);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fuelCountByTechnic = async (dateRange) => {
  try {
    const response = await axios.post(`${API_N_URL}/fuelCountByTechnic/`, dateRange);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fuelCountByDate = async (dateRange) => {
  try {
    const response = await axios.post(`${API_N_URL}/fuelCountByDate/`, dateRange);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const gettrackpoint = async (dateRange) => {
  try {
    const response = await axios.post(`${API_N_URL}/trackpoint/`, dateRange);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

