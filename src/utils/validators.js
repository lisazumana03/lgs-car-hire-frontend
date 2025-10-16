import { VALIDATION } from './constants';

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }

  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;

  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean} True if meets minimum length
 */
export const minLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if within maximum length
 */
export const maxLength = (value, maxLength) => {
  if (!value) return true; // Empty is valid for max length
  return value.length <= maxLength;
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if within range
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

/**
 * Validate date is in the future
 * @param {string|Date} date - Date to validate
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  return d > now;
};

/**
 * Validate date is in the past
 * @param {string|Date} date - Date to validate
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  return d < now;
};

/**
 * Validate date range
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {boolean} True if end date is after start date
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;

  const start = new Date(startDate);
  const end = new Date(endDate);

  return end >= start;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} True if file size is within limit
 */
export const isValidFileSize = (file, maxSize) => {
  if (!file) return false;
  return file.size <= maxSize;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean} True if file type is allowed
 */
export const isValidFileType = (file, allowedTypes) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Validate credit card number (basic Luhn algorithm)
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} True if valid card number
 */
export const isValidCardNumber = (cardNumber) => {
  if (!cardNumber) return false;

  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {object} Validation result
 */
export const validateUsername = (username) => {
  const errors = [];

  if (!username) {
    return { isValid: false, errors: ['Username is required'] };
  }

  if (username.length < VALIDATION.USERNAME_MIN_LENGTH) {
    errors.push(`Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters`);
  }

  if (username.length > VALIDATION.USERNAME_MAX_LENGTH) {
    errors.push(`Username must not exceed ${VALIDATION.USERNAME_MAX_LENGTH} characters`);
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate form data
 * @param {object} data - Form data to validate
 * @param {object} rules - Validation rules
 * @returns {object} Validation result with errors
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = data[field];

    if (fieldRules.required && !isRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }

    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = 'Invalid email address';
      return;
    }

    if (fieldRules.minLength && !minLength(value, fieldRules.minLength)) {
      errors[field] = `Must be at least ${fieldRules.minLength} characters`;
      return;
    }

    if (fieldRules.maxLength && !maxLength(value, fieldRules.maxLength)) {
      errors[field] = `Must not exceed ${fieldRules.maxLength} characters`;
      return;
    }

    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || 'Invalid format';
      return;
    }

    if (fieldRules.custom) {
      const customResult = fieldRules.custom(value, data);
      if (customResult !== true) {
        errors[field] = customResult;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  isValidEmail,
  validatePassword,
  isValidPhone,
  isRequired,
  minLength,
  maxLength,
  isInRange,
  isFutureDate,
  isPastDate,
  isValidDateRange,
  isValidUrl,
  isValidFileSize,
  isValidFileType,
  isValidCardNumber,
  validateUsername,
  validateForm,
};
