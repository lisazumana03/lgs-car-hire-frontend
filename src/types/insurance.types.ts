export interface Insurance {
  insuranceID?: number;
  insuranceStartDate?: string;
  insuranceCost?: number;
  insuranceProvider?: string;
  status?: string;
  policyNumber?: number;
  mechanic?: string;
  carID?: number;
}

export interface InsuranceRequest {
  insuranceStartDate?: string;
  insuranceCost: number;
  insuranceProvider: string;
  status?: string;
  policyNumber?: number;
  mechanic?: string;
  carID?: number;
}
