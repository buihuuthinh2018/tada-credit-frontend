import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import {
  User,
  ListUsersParams,
  ListUsersResponse,
  UpdateUserStatusRequest,
  ApiError,
} from '@/types/api';
import { toast } from 'sonner';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: ListUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

// API Functions
const userApi = {
  getMyProfile: () =>
    apiClient.get<User>('/users/me'),
  
  getUserById: (id: string) =>
    apiClient.get<User>(`/users/${id}`),
  
  listUsers: (params: ListUsersParams) =>
    apiClient.get<ListUsersResponse>('/users', { params }),
  
  updateUserStatus: (id: string, data: UpdateUserStatusRequest) =>
    apiClient.patch<User>(`/users/${id}/status`, data),
  
  deleteUser: (id: string) =>
    apiClient.patch<User>(`/users/${id}/delete`, {}),
};

// Hooks

/**
 * Hook để lấy profile của user hiện tại
 */
export function useMyProfile() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const response = await userApi.getMyProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook để lấy thông tin user theo ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await userApi.getUserById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook để lấy danh sách users với pagination và filters
 */
export function useUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await userApi.listUsers(params);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook để cập nhật status của user
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserStatusRequest }) =>
      userApi.updateUserStatus(id, data),
    onSuccess: (response, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      
      toast.success('Cập nhật trạng thái thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
    },
  });
}

/**
 * Hook để xóa user (soft delete)
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: (response, id) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      
      toast.success('Xóa người dùng thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Xóa người dùng thất bại');
    },
  });
}

/**
 * Hook để gán role cho user
 */
export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      apiClient.post(`/rbac/users/${userId}/roles`, { roleId }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Gán role thất bại');
    },
  });
}

/**
 * Hook để xóa role khỏi user
 */
export function useRemoveRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      apiClient.delete(`/rbac/users/${userId}/roles/${roleId}`),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Xóa role thất bại');
    },
  });
}
