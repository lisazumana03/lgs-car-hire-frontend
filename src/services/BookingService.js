/*
Lisakhanya Zumana (230864821)
Date: 14/08/2025
 */

import axios from "axios";

const API_URL = "http://localhost:3045/booking";

export const create = (booking) => {
    return axios.post(API_URL, booking);
}

export const getAllBookings = () => {
    return axios.get(API_URL);
}

