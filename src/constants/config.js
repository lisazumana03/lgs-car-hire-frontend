export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USERS: '/users',
  CARS: '/cars',
  CAR_TYPES: '/car-types',
  BOOKINGS: '/bookings',
  LOCATIONS: '/locations',
  INSURANCE: '/insurance',
};

export const APP_NAME = "LG'S CAR HIRE";
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  REMEMBER_ME: 'rememberMe',
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  MAKE_BOOKING: '/make-booking',
  BOOKING_HISTORY: '/booking-history',
  BOOKING_LIST: '/booking-list',
  CARS: '/cars',
  REGISTER_CAR: '/register-car',
  SELECT_CAR: '/select-car',
  LOCATIONS: '/locations',
  CHOOSE_LOCATION: '/choose-location',
  REGISTER_LOCATION: '/register-location',
  ADMIN: '/admin',
};
