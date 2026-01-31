import { AxiosError } from 'axios';

// API Types
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
export type OTPPurpose = 'REGISTER' | 'LOGIN' | 'RESET_PASSWORD' | 'WITHDRAWAL';

// Auth Types
export interface RegisterRequest {
  phone: string;
  password: string;
  referralCode?: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface SendOTPRequest {
  phone: string;
  purpose: OTPPurpose;
}

export interface VerifyOTPRequest {
  phone: string;
  code: string;
  purpose: OTPPurpose;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface UserRole {
  id: string;
  name: string;
  displayName: string;
}

export interface User {
  id: string;
  phone?: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  isActive: boolean;
  isEmailVerified: boolean;
  referralCode?: string;
  referredBy?: string;
  roles?: UserRole[];
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface ListUsersParams {
  page?: number;
  limit?: number;
  status?: UserStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ListUsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdateUserStatusRequest {
  status?: UserStatus;
  isActive?: boolean;
}

// API Error Response Structure
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

// API Error type - sử dụng AxiosError từ axios
export type ApiError = AxiosError<ApiErrorResponse>;
