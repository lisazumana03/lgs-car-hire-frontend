/**
 * Enums matching backend Java enums
 * Date: 2025-10-16
 */

/**
 * Booking status enum matching backend BookingStatus
 */
export const BookingStatus = {
  CANCELLED: 'CANCELLED',
  CONFIRMED: 'CONFIRMED',
  PENDING: 'PENDING',
  DECLINED: 'DECLINED',
  BOOKED: 'BOOKED'
};

/**
 * Insurance coverage type enum matching backend CoverageType
 */
export const CoverageType = {
  NONE: 'NONE',
  BASIC: 'BASIC',
  PREMIUM: 'PREMIUM',
  COMPREHENSIVE: 'COMPREHENSIVE'
};

/**
 * Display names for coverage types
 */
export const CoverageTypeDisplay = {
  [CoverageType.NONE]: 'No Insurance',
  [CoverageType.BASIC]: 'Basic Coverage',
  [CoverageType.PREMIUM]: 'Premium Coverage',
  [CoverageType.COMPREHENSIVE]: 'Comprehensive Coverage'
};

/**
 * Insurance coverage descriptions
 */
export const CoverageTypeDescription = {
  [CoverageType.NONE]: 'No insurance coverage. You will be fully responsible for any damages.',
  [CoverageType.BASIC]: 'Basic coverage with high deductible. Covers major damages only.',
  [CoverageType.PREMIUM]: 'Premium coverage with lower deductible. Covers most damages.',
  [CoverageType.COMPREHENSIVE]: 'Full comprehensive coverage with minimal deductible. Covers all damages including theft.'
};

/**
 * Estimated daily insurance costs (in ZAR)
 */
export const CoverageTypeCost = {
  [CoverageType.NONE]: 0,
  [CoverageType.BASIC]: 50,
  [CoverageType.PREMIUM]: 150,
  [CoverageType.COMPREHENSIVE]: 300
};

/**
 * Default deductibles by coverage type (in ZAR)
 */
export const CoverageTypeDeductible = {
  [CoverageType.NONE]: 0,
  [CoverageType.BASIC]: 10000,
  [CoverageType.PREMIUM]: 5000,
  [CoverageType.COMPREHENSIVE]: 1000
};

export default {
  BookingStatus,
  CoverageType,
  CoverageTypeDisplay,
  CoverageTypeDescription,
  CoverageTypeCost,
  CoverageTypeDeductible
};
