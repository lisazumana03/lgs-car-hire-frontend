export interface Insurance {
  id?: string;
  type: string;
  coverage: string;
  price: number;
  description?: string;
  provider?: string;
  validFrom?: string;
  validTo?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InsuranceRequest {
  type: string;
  coverage: string;
  price: number;
  description?: string;
  provider?: string;
  validFrom?: string;
  validTo?: string;
  active?: boolean;
}
