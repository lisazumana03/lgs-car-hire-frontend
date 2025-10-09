// Auth types
export * from './auth.types';

// Booking types
export * from './booking.types';

// Car types
export * from './car.types';

// Insurance types
export * from './insurance.types';

// Location types
export * from './location.types';

// Common API response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// Error response
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
