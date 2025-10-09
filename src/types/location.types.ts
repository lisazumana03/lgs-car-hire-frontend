export interface Location {
  id?: string;
  name: string;
  address: string;
  city: string;
  provinceOrState: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  openingHours?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationRequest {
  name: string;
  address: string;
  city: string;
  provinceOrState: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  openingHours?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  active?: boolean;
}
