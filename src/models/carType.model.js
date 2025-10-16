/**
 * @typedef {Object} CarType
 * @property {number} carTypeID
 * @property {string} category - VehicleCategory enum value
 * @property {string} fuelType - FuelType enum value
 * @property {string} transmissionType - TransmissionType enum value
 * @property {number} numberOfSeats
 * @property {number} numberOfDoors
 * @property {boolean} airConditioned
 * @property {number} luggageCapacity
 * @property {string} description
 */

export const VEHICLE_CATEGORY = {
  ECONOMY: 'ECONOMY',
  COMPACT: 'COMPACT',
  SEDAN: 'SEDAN',
  SUV: 'SUV',
  LUXURY: 'LUXURY',
  VAN: 'VAN',
  MINIVAN: 'MINIVAN',
  CONVERTIBLE: 'CONVERTIBLE',
  SPORTS: 'SPORTS',
  ELECTRIC: 'ELECTRIC',
  HYBRID: 'HYBRID'
};

export const FUEL_TYPE = {
  PETROL: 'PETROL',
  DIESEL: 'DIESEL',
  ELECTRIC: 'ELECTRIC',
  HYBRID: 'HYBRID',
  PLUG_IN_HYBRID: 'PLUG_IN_HYBRID',
  CNG: 'CNG',
  LPG: 'LPG'
};

export const TRANSMISSION_TYPE = {
  MANUAL: 'MANUAL',
  AUTOMATIC: 'AUTOMATIC',
  SEMI_AUTOMATIC: 'SEMI_AUTOMATIC',
  CVT: 'CVT',
  DUAL_CLUTCH: 'DUAL_CLUTCH'
};

export const getCategoryLabel = (category) => {
  const labels = {
    ECONOMY: 'Economy',
    COMPACT: 'Compact',
    SEDAN: 'Sedan',
    SUV: 'SUV',
    LUXURY: 'Luxury',
    VAN: 'Van',
    MINIVAN: 'Minivan',
    CONVERTIBLE: 'Convertible',
    SPORTS: 'Sports',
    ELECTRIC: 'Electric',
    HYBRID: 'Hybrid'
  };
  return labels[category] || category;
};

export const getFuelTypeLabel = (fuelType) => {
  const labels = {
    PETROL: 'Petrol',
    DIESEL: 'Diesel',
    ELECTRIC: 'Electric',
    HYBRID: 'Hybrid',
    PLUG_IN_HYBRID: 'Plug-in Hybrid',
    CNG: 'CNG',
    LPG: 'LPG'
  };
  return labels[fuelType] || fuelType;
};

export const getTransmissionLabel = (transmission) => {
  const labels = {
    MANUAL: 'Manual',
    AUTOMATIC: 'Automatic',
    SEMI_AUTOMATIC: 'Semi-Automatic',
    CVT: 'CVT',
    DUAL_CLUTCH: 'Dual-Clutch'
  };
  return labels[transmission] || transmission;
};
