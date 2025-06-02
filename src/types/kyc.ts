
export interface ApiKeyResponse {
  success: boolean;
  api_key: string;
  expires: string;
}

export interface KYCRequest {
  email: string;
  id_image: File;
  selfie: File;
}

export interface KYCResponse {
  success: boolean;
  verified?: boolean;
  similarity?: number;
  message?: string;
  error?: string;
}

export interface VerificationStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface ImageValidation {
  isValid: boolean;
  errors: string[];
  quality?: number;
}
