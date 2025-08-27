/*
Car Service for API calls
Matches the backend CarController endpoints
*/

import axios from "axios";

const API_URL = "http://localhost:3045/car";

export const create = (car) => {
    return axios.post(`${API_URL}/create`, car);
}

export const getAllCars = () => {
    // Note: You'll need to add a getAll endpoint to your backend
    return axios.get(`${API_URL}/getAll`);
}

export const updateCar = (car) => {
    // Using POST as per your backend controller
    return axios.post(`${API_URL}/update`, car);
}

export const deleteCar = (carId) => {
    // Using GET as per your backend controller
    return axios.get(`${API_URL}/delete/${carId}`);
}

export const getCarById = (carId) => {
    return axios.get(`${API_URL}/read/${carId}`);
}