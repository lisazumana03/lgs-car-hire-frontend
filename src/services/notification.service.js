import axios from "axios";

const API_URL = "http://localhost:3045/api/notification";

export const getAllNotifications = () => {
  return axios.get(`${API_URL}/getall`);
};

export const create = (notification) => {
  return axios.post(`${API_URL}/create`, notification);
};

export const read = (id) => {
  return axios.get(`${API_URL}/read/${id}`);
};

export const update = (notification) => {
  return axios.put(`${API_URL}/update`, notification);
};

export const deleteNotification = (id) => {
  return axios.delete(`${API_URL}/delete/${id}`);
};

export const getNotificationById = read;
export const readNotification = read;
