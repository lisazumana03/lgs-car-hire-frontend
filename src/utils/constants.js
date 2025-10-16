export const APP_NAME = 'LGS Car Hire';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  REMEMBER_ME: 'rememberMe',
  THEME: 'theme',
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MANAGER: 'MANAGER',
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  IN_PROGRESS: 'IN_PROGRESS',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const PAYMENT_METHODS = {
  CARD: 'CARD',
  PAYSTACK: 'PAYSTACK',
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
};

export const CAR_STATUS = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  MAINTENANCE: 'MAINTENANCE',
  UNAVAILABLE: 'UNAVAILABLE',
};

export const INSURANCE_TYPES = {
  BASIC: 'BASIC',
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM',
  COMPREHENSIVE: 'COMPREHENSIVE',
};

export const SUPPORT_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

export const SUPPORT_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

export const NOTIFICATION_TYPES = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  BOOKING: 'BOOKING',
  PAYMENT: 'PAYMENT',
  SYSTEM: 'SYSTEM',
};

export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  WITH_TIME: 'MM/DD/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  TIME: 'HH:mm',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
};

export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
};

export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logout successful!',
  REGISTER: 'Registration successful!',
  UPDATE: 'Updated successfully!',
  CREATE: 'Created successfully!',
  DELETE: 'Deleted successfully!',
  BOOKING_CREATED: 'Booking created successfully!',
  PAYMENT_COMPLETED: 'Payment completed successfully!',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  CARS: '/cars',
  PAYMENTS: '/payments',
  INVOICES: '/invoices',
  LOCATIONS: '/locations',
  SUPPORT: '/support',
  REVIEWS: '/reviews',
  ADMIN: '/admin',
  NOTIFICATIONS: '/notifications',
};

export default {
  APP_NAME,
  STORAGE_KEYS,
  USER_ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  CAR_STATUS,
  INSURANCE_TYPES,
  SUPPORT_STATUS,
  SUPPORT_PRIORITY,
  NOTIFICATION_TYPES,
  DATE_FORMATS,
  PAGINATION,
  FILE_UPLOAD,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
};
