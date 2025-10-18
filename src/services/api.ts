import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3045";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  idNumber: number;
  phoneNumber: string;
  dateOfBirth: string;
  licenseNumber: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  name: string;
  role: "ADMIN" | "CUSTOMER";
}

export interface SignupData {
  name: string;
  idNumber: number;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  licenseNumber: string;
  password: string;
  role?: "CUSTOMER" | "ADMIN";
}

export type CarStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE" | "OUT_OF_SERVICE" | "RESERVED";
export type CarCondition = "EXCELLENT" | "GOOD" | "FAIR" | "NEEDS_SERVICE" | "POOR";
export type VehicleCategory = "ECONOMY" | "COMPACT" | "SEDAN" | "SUV" | "LUXURY" | "VAN" | "MINIVAN" | "CONVERTIBLE" | "SPORTS" | "ELECTRIC" | "HYBRID";
export type FuelType = "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID" | "PLUG_IN_HYBRID" | "CNG" | "LPG";
export type TransmissionType = "MANUAL" | "AUTOMATIC" | "SEMI_AUTOMATIC" | "CVT" | "DUAL_CLUTCH";

export interface CarDTO {
  carID: number;
  model: string;
  brand: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  mileage: number;
  status: CarStatus;
  condition: CarCondition;
  currentLocationID: number;
  currentLocationName: string;
  imageName?: string;
  imageType?: string;
  imageBase64?: string;
  carTypeID: number;
  carTypeCategory: VehicleCategory;
  carTypeFuelType: FuelType;
  carTypeTransmissionType: TransmissionType;
  carTypeNumberOfSeats: number;
  carTypeNumberOfDoors: number;
  carTypeAirConditioned: boolean;
  carTypeLuggageCapacity: number;
  carTypeDescription: string;
}

export interface CarTypeDTO {
  carTypeID: number;
  category: VehicleCategory;
  fuelType: FuelType;
  transmissionType: TransmissionType;
  numberOfSeats: number;
  numberOfDoors: number;
  airConditioned: boolean;
  luggageCapacity: number;
  description: string;
}

export interface PricingRuleDTO {
  pricingRuleID: number;
  carTypeID: number;
  carTypeName: string;
  baseDailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  weekendRate: number;
  seasonalMultiplier: number;
  validFrom: string;
  validTo: string;
  active: boolean;
}

export interface LocationDTO {
  locationID: number;
  locationName: string;
  streetNumber: number;
  streetName: string;
  cityOrTown: string;
  provinceOrState: string;
  postalCode: string;
  country: string;
}

export type BookingStatus = "CANCELLED" | "CONFIRMED" | "PENDING" | "DECLINED" | "BOOKED";

export interface BookingDTO {
  bookingID: number;
  user: {
    userId: number;
    name: string;
    email: string;
    role: string;
    idNumber?: number;
    phoneNumber?: string;
    dateOfBirth?: string;
    licenseNumber?: string;
  };
  car: {
    carID: number;
    model: string;
    brand: string;
    year?: number;
    licensePlate?: string;
    vin?: string;
    color?: string;
    status?: string;
  };
  bookingDateAndTime: string | null;
  startDate: string;
  endDate: string;
  pickupLocation?: {
    locationID: number;
    locationName: string;
  };
  dropOffLocation?: {
    locationID: number;
    locationName: string;
  };
  bookingStatus: BookingStatus;
  rentalDays?: number;
  subtotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount?: number;
  currency?: string;
  payment?: {
    paymentStatus: string;
  };
}

export interface InvoiceDTO {
  invoiceID: number;
  totalAmount: number;
  subTotal: number;
  taxAmount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  carModel: string;
}

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TicketCategory = "BOOKING_ISSUE" | "PAYMENT_ISSUE" | "VEHICLE_ISSUE" | "ACCOUNT_ISSUE" | "GENERAL_INQUIRY" | "COMPLAINT" | "FEEDBACK" | "OTHER";

export interface TicketReplyDTO {
  replyID: number;
  ticketID: number;
  userId: number;
  userName: string;
  userRole: "ADMIN" | "CUSTOMER";
  message: string;
  createdAt: string;
}

export interface SupportTicketDTO {
  ticketID: number;
  user: {
    userId: number;
    name: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
  };
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  replies?: TicketReplyDTO[];
}

export interface CreateTicketData {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

export interface CreateReplyData {
  message: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>("/api/users/login", { email, password });
    const authResponse = response.data;

    localStorage.setItem("token", authResponse.token);

    const userDetailsResponse = await api.get<any>(`/api/users/${authResponse.userId}`);
    const userDetails = userDetailsResponse.data;

    return {
      token: authResponse.token,
      user: {
        id: authResponse.userId,
        name: authResponse.name,
        email: authResponse.email,
        role: authResponse.role,
        idNumber: userDetails.idNumber || 0,
        phoneNumber: userDetails.phoneNumber || "",
        dateOfBirth: userDetails.dateOfBirth || "",
        licenseNumber: userDetails.licenseNumber || "",
      }
    };
  },

  signup: async (userData: SignupData) => {
    const response = await api.post<any>("/api/users/signup", userData);
    const userDTO = response.data;

    return authAPI.login(userData.email, userData.password);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/api/users/me");
    return response.data;
  },
};

export const carAPI = {
  getAll: async (): Promise<CarDTO[]> => {
    const response = await api.get<CarDTO[]>("/api/car/all");
    return response.data;
  },

  getAvailable: async (): Promise<CarDTO[]> => {
    const response = await api.get<CarDTO[]>("/api/car/available");
    return response.data;
  },

  getById: async (id: number): Promise<CarDTO> => {
    const response = await api.get<CarDTO>(`/api/car/read/${id}`);
    return response.data;
  },

  getByBrand: async (brand: string): Promise<CarDTO[]> => {
    const response = await api.get<CarDTO[]>(`/api/car/brand/${brand}`);
    return response.data;
  },

  getByStatus: async (status: CarStatus): Promise<CarDTO[]> => {
    const response = await api.get<CarDTO[]>(`/api/car/status/${status}`);
    return response.data;
  },

  getByYear: async (year: number): Promise<CarDTO[]> => {
    const response = await api.get<CarDTO[]>(`/api/car/year/${year}`);
    return response.data;
  },

  getByLicensePlate: async (licensePlate: string): Promise<CarDTO> => {
    const response = await api.get<CarDTO>(`/api/car/license-plate/${licensePlate}`);
    return response.data;
  },

  getByVin: async (vin: string): Promise<CarDTO> => {
    const response = await api.get<CarDTO>(`/api/car/vin/${vin}`);
    return response.data;
  },
};

export const carTypeAPI = {
  getAll: async (): Promise<CarTypeDTO[]> => {
    const response = await api.get<CarTypeDTO[]>("/api/car-type/all");
    return response.data;
  },

  getById: async (id: number): Promise<CarTypeDTO> => {
    const response = await api.get<CarTypeDTO>(`/api/car-type/read/${id}`);
    return response.data;
  },

  getByFuelType: async (fuelType: FuelType): Promise<CarTypeDTO[]> => {
    const response = await api.get<CarTypeDTO[]>(`/api/car-type/fuel/${fuelType}`);
    return response.data;
  },
};

export const pricingAPI = {
  getAll: async (): Promise<PricingRuleDTO[]> => {
    const response = await api.get<PricingRuleDTO[]>("/api/pricing-rule/all");
    return response.data;
  },

  getActive: async (): Promise<PricingRuleDTO[]> => {
    const response = await api.get<PricingRuleDTO[]>("/api/pricing-rule/active");
    return response.data;
  },

  getByCarType: async (carTypeId: number): Promise<PricingRuleDTO[]> => {
    const response = await api.get<PricingRuleDTO[]>(`/api/pricing-rule/car-type/${carTypeId}`);
    return response.data;
  },

  getActiveForCarType: async (carTypeId: number): Promise<PricingRuleDTO> => {
    const response = await api.get<PricingRuleDTO>(`/api/pricing-rule/car-type/${carTypeId}/active`);
    return response.data;
  },

  calculatePrice: async (carTypeId: number, days: number, rentalDate?: string): Promise<number> => {
    const params = new URLSearchParams({
      carTypeId: carTypeId.toString(),
      days: days.toString(),
    });
    if (rentalDate) {
      params.append("rentalDate", rentalDate);
    }
    const response = await api.get<number>(`/api/pricing-rule/calculate-price?${params.toString()}`);
    return response.data;
  },
};

export const locationAPI = {
  getAll: async (): Promise<LocationDTO[]> => {
    const response = await api.get<LocationDTO[]>("/api/location/all");
    return response.data;
  },

  getById: async (id: number): Promise<LocationDTO> => {
    const response = await api.get<LocationDTO>(`/api/location/read/${id}`);
    return response.data;
  },
};

export const bookingAPI = {
  getAll: async (): Promise<BookingDTO[]> => {
    const response = await api.get<BookingDTO[]>("/api/booking/all");
    return response.data;
  },

  getById: async (id: number): Promise<BookingDTO> => {
    const response = await api.get<BookingDTO>(`/api/booking/read/${id}`);
    return response.data;
  },
};

export const invoiceAPI = {
  getAll: async (): Promise<InvoiceDTO[]> => {
    const response = await api.get<InvoiceDTO[]>("/api/invoice/all");
    return response.data;
  },

  getById: async (id: number): Promise<InvoiceDTO> => {
    const response = await api.get<InvoiceDTO>(`/api/invoice/read/${id}`);
    return response.data;
  },

  getByUserId: async (userId: number): Promise<InvoiceDTO[]> => {
    const response = await api.get<InvoiceDTO[]>(`/api/invoice/user/${userId}`);
    return response.data;
  },
};

export const supportTicketAPI = {
  getAll: async (): Promise<SupportTicketDTO[]> => {
    const response = await api.get<SupportTicketDTO[]>("/api/support-ticket/all");
    return response.data;
  },

  getById: async (id: number): Promise<SupportTicketDTO> => {
    const response = await api.get<SupportTicketDTO>(`/api/support-ticket/read/${id}`);
    return response.data;
  },

  getByUserId: async (userId: number): Promise<SupportTicketDTO[]> => {
    const response = await api.get<SupportTicketDTO[]>(`/api/support-ticket/user/${userId}`);
    return response.data;
  },

  getByStatus: async (status: TicketStatus): Promise<SupportTicketDTO[]> => {
    const response = await api.get<SupportTicketDTO[]>(`/api/support-ticket/status/${status}`);
    return response.data;
  },

  create: async (ticketData: CreateTicketData): Promise<SupportTicketDTO> => {
    const response = await api.post<SupportTicketDTO>("/api/support-ticket/create", ticketData);
    return response.data;
  },

  updateStatus: async (id: number, status: TicketStatus): Promise<SupportTicketDTO> => {
    const response = await api.put<SupportTicketDTO>(`/api/support-ticket/${id}/status`, { status });
    return response.data;
  },

  addReply: async (ticketId: number, replyData: CreateReplyData): Promise<TicketReplyDTO> => {
    const response = await api.post<TicketReplyDTO>(`/api/support-ticket/${ticketId}/reply`, replyData);
    return response.data;
  },

  getReplies: async (ticketId: number): Promise<TicketReplyDTO[]> => {
    const response = await api.get<TicketReplyDTO[]>(`/api/support-ticket/${ticketId}/replies`);
    return response.data;
  },
};

export default api;
