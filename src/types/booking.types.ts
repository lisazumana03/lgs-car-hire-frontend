export interface Booking {
  id?: string;
  userId: string;
  carId: string;
  locationId: string;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  insuranceId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingRequest {
  userId: string;
  carId: string;
  locationId: string;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  insuranceId?: string;
}

export interface BookingResponse {
  id: string;
  userId: string;
  carId: string;
  locationId: string;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status: string;
  insuranceId?: string;
  createdAt: string;
  updatedAt: string;
}
