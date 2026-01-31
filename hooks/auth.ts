import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SendOTPRequest,
  VerifyOTPRequest,
  RefreshTokenRequest,
  ApiError,
} from '@/types/api';
import { CurrentUser } from '@/types/rbac';
import { useAuthStore } from '@/store/use-auth-store';
import { toast } from 'sonner';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  currentUser: () => [...authKeys.all, 'current'] as const,
};

// API Functions
const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data),
  
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),
  
  sendOTP: (data: SendOTPRequest) =>
    apiClient.post('/auth/otp/send', data),
  
  verifyOTP: (data: VerifyOTPRequest) =>
    apiClient.post('/auth/otp/verify', data),
  
  refreshToken: (data: RefreshTokenRequest) =>
    apiClient.post<AuthResponse>('/auth/refresh', data),
  
  getCurrentUser: () =>
    apiClient.post<CurrentUser>('/auth/me', {}),
  
  logout: () =>
    apiClient.post('/auth/logout', {}),
};

// Hooks

/**
 * Hook để đăng ký user mới
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response:any) => {
      const { accessToken, refreshToken, user } = response.data.data;
      
      // Lưu tokens
      apiClient.setAuthToken(accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      
      // Update cache
      queryClient.setQueryData(authKeys.currentUser(), user);
      
      toast.success('Đăng ký thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    },
  });
}

/**
 * Hook để đăng nhập
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response:any) => {
      const { accessToken, refreshToken, user } = response.data.data;
      console.log("response", accessToken);
      // Lưu tokens
      apiClient.setAuthToken(accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      
      // Update cache
      queryClient.setQueryData(authKeys.currentUser(), user);
      
      toast.success('Đăng nhập thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    },
  });
}

/**
 * Hook để gửi OTP
 */
export function useSendOTP() {
  return useMutation({
    mutationFn: authApi.sendOTP,
    onSuccess: () => {
      toast.success('Mã OTP đã được gửi!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Gửi OTP thất bại');
    },
  });
}

/**
 * Hook để verify OTP
 */
export function useVerifyOTP() {
  return useMutation({
    mutationFn: authApi.verifyOTP,
    onSuccess: () => {
      toast.success('Xác thực OTP thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Xác thực OTP thất bại');
    },
  });
}

/**
 * Hook để refresh token
 */
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      
      apiClient.setAuthToken(accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: () => {
      // Clear tokens nếu refresh thất bại
      apiClient.clearAuthToken();
      toast.error('Phiên đăng nhập đã hết hạn');
    },
  });
}

/**
 * Hook để lấy thông tin user hiện tại
 */
export function useCurrentUser() {
  const { setAuth } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      // API trả về { success, data, meta } nên cần unwrap
      const userData = (response.data as any)?.data || response.data;
      
      // Sync với auth store để hasAnyRole hoạt động
      if (userData) {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (accessToken && refreshToken) {
          setAuth(userData, accessToken, refreshToken);
        }
      }
      
      return userData as CurrentUser;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Chỉ enable query khi có token
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
  });
}

/**
 * Hook để đăng xuất
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear tokens
      apiClient.clearAuthToken();
      
      // Clear all queries
      queryClient.clear();
      
      toast.success('Đăng xuất thành công!');
    },
    onError: () => {
      // Vẫn clear tokens dù API fail
      apiClient.clearAuthToken();
      queryClient.clear();
    },
  });
}
