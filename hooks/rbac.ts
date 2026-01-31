import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type {
  Role,
  PermissionItem,
  GroupedPermissions,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
  AssignRoleToUserRequest,
  UpdateUserRolesRequest,
  UserRole,
} from '@/types/rbac';
import type { ApiError } from '@/types/api';

// ===================================================
// Query Keys
// ===================================================
export const rbacKeys = {
  all: ['rbac'] as const,
  roles: () => [...rbacKeys.all, 'roles'] as const,
  role: (id: string) => [...rbacKeys.roles(), id] as const,
  permissions: () => [...rbacKeys.all, 'permissions'] as const,
  permissionsGrouped: () => [...rbacKeys.permissions(), 'grouped'] as const,
  userRoles: (userId: string) => [...rbacKeys.all, 'user-roles', userId] as const,
};

// ===================================================
// API Functions
// ===================================================
const rbacApi = {
  // Roles
  getAllRoles: () =>
    apiClient.get<{ data: Role[] }>('/rbac/roles'),
  
  getRoleById: (id: string) =>
    apiClient.get<{ data: Role }>(`/rbac/roles/${id}`),
  
  createRole: (data: CreateRoleRequest) =>
    apiClient.post<{ data: Role }>('/rbac/roles', data),
  
  updateRole: (id: string, data: UpdateRoleRequest) =>
    apiClient.patch<{ data: Role }>(`/rbac/roles/${id}`, data),
  
  deleteRole: (id: string) =>
    apiClient.delete(`/rbac/roles/${id}`),
  
  assignPermissionsToRole: (roleId: string, data: AssignPermissionsRequest) =>
    apiClient.post<{ data: Role }>(`/rbac/roles/${roleId}/permissions`, data),

  // Permissions
  getAllPermissions: () =>
    apiClient.get<{ data: PermissionItem[] }>('/rbac/permissions'),
  
  getPermissionsGrouped: () =>
    apiClient.get<{ data: GroupedPermissions }>('/rbac/permissions/grouped'),
  
  // User Roles
  assignRoleToUser: (data: AssignRoleToUserRequest) =>
    apiClient.post<{ data: UserRole }>('/rbac/permissions/assign-role', data),
  
  updateUserRoles: (data: UpdateUserRolesRequest) =>
    apiClient.post<{ data: UserRole[] }>('/rbac/permissions/update-user-roles', data),
  
  // Seed (admin only)
  seedDefaultData: () =>
    apiClient.post('/rbac/permissions/seed'),
};

// ===================================================
// ROLE HOOKS
// ===================================================

/**
 * Hook để lấy danh sách tất cả roles
 */
export function useRoles() {
  return useQuery({
    queryKey: rbacKeys.roles(),
    queryFn: async () => {
      const response = await rbacApi.getAllRoles();
      return response.data.data;
    },
  });
}

/**
 * Hook để lấy chi tiết một role
 */
export function useRole(id: string) {
  return useQuery({
    queryKey: rbacKeys.role(id),
    queryFn: async () => {
      const response = await rbacApi.getRoleById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook để tạo role mới
 */
export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rbacApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
      toast.success('Tạo role thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Tạo role thất bại');
    },
  });
}

/**
 * Hook để cập nhật role
 */
export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) =>
      rbacApi.updateRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
      queryClient.invalidateQueries({ queryKey: rbacKeys.role(id) });
      toast.success('Cập nhật role thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Cập nhật role thất bại');
    },
  });
}

/**
 * Hook để xoá role
 */
export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rbacApi.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
      toast.success('Xoá role thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Xoá role thất bại');
    },
  });
}

/**
 * Hook để gán permissions cho role
 */
export function useAssignPermissionsToRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: AssignPermissionsRequest }) =>
      rbacApi.assignPermissionsToRole(roleId, data),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
      queryClient.invalidateQueries({ queryKey: rbacKeys.role(roleId) });
      toast.success('Gán permissions thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Gán permissions thất bại');
    },
  });
}

// ===================================================
// PERMISSION HOOKS
// ===================================================

/**
 * Hook để lấy tất cả permissions
 */
export function usePermissions() {
  return useQuery({
    queryKey: rbacKeys.permissions(),
    queryFn: async () => {
      const response = await rbacApi.getAllPermissions();
      return response.data.data;
    },
  });
}

/**
 * Hook để lấy permissions grouped by module
 */
export function usePermissionsGrouped() {
  return useQuery({
    queryKey: rbacKeys.permissionsGrouped(),
    queryFn: async () => {
      const response = await rbacApi.getPermissionsGrouped();
      return response.data.data;
    },
  });
}

// ===================================================
// USER ROLE HOOKS
// ===================================================

/**
 * Hook để gán role cho user
 */
export function useAssignRoleToUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rbacApi.assignRoleToUser,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.userRoles(userId) });
      toast.success('Gán role thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Gán role thất bại');
    },
  });
}

/**
 * Hook để cập nhật roles của user
 */
export function useUpdateUserRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rbacApi.updateUserRoles,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.userRoles(userId) });
      toast.success('Cập nhật roles thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Cập nhật roles thất bại');
    },
  });
}

/**
 * Hook để seed default RBAC data (admin only)
 */
export function useSeedRbacData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rbacApi.seedDefaultData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.all });
      toast.success('Seed dữ liệu RBAC thành công!');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Seed thất bại');
    },
  });
}
