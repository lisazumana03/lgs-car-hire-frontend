/**
 * @typedef {Object} Car
 * @property {number} carID
 * @property {string} model
 * @property {string} brand
 * @property {number} year
 * @property {string} licensePlate
 * @property {string} vin
 * @property {string} color
 * @property {number} mileage
 * @property {string} status - CarStatus enum value (AVAILABLE, RENTED, MAINTENANCE, OUT_OF_SERVICE, RESERVED)
 * @property {string} condition - CarCondition enum value (EXCELLENT, GOOD, FAIR, NEEDS_SERVICE, POOR)
 * @property {number} currentLocationID
 * @property {string} currentLocationName
 * @property {string} imageBase64
 * @property {string} imageName
 * @property {string} imageType
 * @property {number} carTypeID
 * @property {string} carTypeCategory
 * @property {string} carTypeFuelType
 * @property {string} carTypeTransmissionType
 * @property {number} carTypeNumberOfSeats
 * @property {number} carTypeNumberOfDoors
 * @property {boolean} carTypeAirConditioned
 * @property {number} carTypeLuggageCapacity
 * @property {string} carTypeDescription
 */

export const CAR_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RENTED: 'RENTED',
  MAINTENANCE: 'MAINTENANCE',
  OUT_OF_SERVICE: 'OUT_OF_SERVICE',
  RESERVED: 'RESERVED'
};

export const CAR_CONDITION = {
  EXCELLENT: 'EXCELLENT',
  GOOD: 'GOOD',
  FAIR: 'FAIR',
  NEEDS_SERVICE: 'NEEDS_SERVICE',
  POOR: 'POOR'
};

export const getStatusLabel = (status) => {
  const labels = {
    AVAILABLE: 'Available',
    RENTED: 'Rented',
    MAINTENANCE: 'Under Maintenance',
    OUT_OF_SERVICE: 'Out of Service',
    RESERVED: 'Reserved'
  };
  return labels[status] || status;
};

export const getConditionLabel = (condition) => {
  const labels = {
    EXCELLENT: 'Excellent',
    GOOD: 'Good',
    FAIR: 'Fair',
    NEEDS_SERVICE: 'Needs Service',
    POOR: 'Poor'
  };
  return labels[condition] || condition;
};

export const getImageUrl = (car) => {
  if (car.imageBase64) {
    return `data:${car.imageType || 'image/jpeg'};base64,${car.imageBase64}`;
  }
  return null;
};
