export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  idNumber: string;
  dateOfBirth: string;
  phoneNumber: string;
  password: string;
  licenseNumber: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  idNumber?: number;
  dateOfBirth?: string;
  phoneNumber?: string;
  licenseNumber?: string;
}

export interface UserData {
  userId: string;
  email: string;
  name: string;
  role: string;
  idNumber?: number;
  dateOfBirth?: string;
  phoneNumber?: string;
  licenseNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  idNumber?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  licenseNumber?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}
