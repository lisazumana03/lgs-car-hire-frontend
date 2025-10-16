import axios from "axios";

const API_URL = "http://localhost:3045/api/car";

export const create = (car) => {
  return axios.post(`${API_URL}/create`, car);
};

export const getCarById = (carId) => {
  return axios.get(`${API_URL}/read/${carId}`);
};

export const updateCar = (car) => {
  return axios.put(`${API_URL}/update`, car);
};

export const deleteCar = (carId) => {
  return axios.delete(`${API_URL}/delete/${carId}`);
};

// Retrieval Operations
export const getAllCars = () => {
  return axios.get(`${API_URL}/all`);
};

export const getCarsByBrand = (brand) => {
  return axios.get(`${API_URL}/brand/${brand}`);
};

export const getAvailableCars = () => {
  return axios.get(`${API_URL}/available`);
};

export const getCarsByYear = (year) => {
  return axios.get(`${API_URL}/year/${year}`);
};

export const getCarsByStatus = (status) => {
  return axios.get(`${API_URL}/status/${status}`);
};

export const getCarByLicensePlate = (licensePlate) => {
  return axios.get(`${API_URL}/license-plate/${licensePlate}`);
};

export const getCarByVin = (vin) => {
  return axios.get(`${API_URL}/vin/${vin}`);
};

export const updateCarStatus = (carId, status) => {
  return axios.put(`${API_URL}/status/${carId}`, null, {
    params: { status },
  });
};

export const updateCarMileage = (carId, mileage) => {
  return axios.put(`${API_URL}/mileage/${carId}`, null, {
    params: { mileage },
  });
};

export const uploadCarImage = (carId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  return axios.post(`${API_URL}/${carId}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
