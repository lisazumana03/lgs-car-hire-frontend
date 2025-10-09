export interface Car {
  id?: string;
  carTypeId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  dailyRate: number;
  available: boolean;
  mileage?: number;
  color?: string;
  transmission?: 'MANUAL' | 'AUTOMATIC';
  features?: string[];
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CarType {
  id?: string;
  type: string;
  description?: string;
  capacity: number;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  transmission?: 'MANUAL' | 'AUTOMATIC';
  priceMultiplier?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CarRequest {
  carTypeId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  dailyRate: number;
  available?: boolean;
  mileage?: number;
  color?: string;
  transmission?: string;
  features?: string[];
  imageUrl?: string;
}

export interface CarTypeRequest {
  type: string;
  description?: string;
  capacity: number;
  fuelType: string;
  transmission?: string;
  priceMultiplier?: number;
}
