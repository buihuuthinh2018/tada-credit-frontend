// ===================================================
// RBAC Types - Frontend
// ===================================================

// System Roles
export const SystemRoles = {
  USER: 'USER',
  CUSTOMER: 'CUSTOMER',
  COLLABORATOR: 'CTV',
  SUPPORTER: 'SUPPORTER',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
} as const;

export type SystemRole = typeof SystemRoles[keyof typeof SystemRoles];

// Permissions
export const Permissions = {
  // Auth & User
  AUTH_USER_REGISTER: 'auth.user.register',
  AUTH_USER_VERIFY_OTP: 'auth.user.verify_otp',
  AUTH_USER_LOGIN: 'auth.user.login',
  
  USER_PROFILE_VIEW: 'user.profile.view',
  USER_PROFILE_UPDATE: 'user.profile.update',
  
  // KYC
  KYC_DOCUMENT_UPLOAD: 'kyc.document.upload',
  KYC_DOCUMENT_VIEW: 'kyc.document.view',
  KYC_DOCUMENT_REVIEW: 'kyc.document.review',
  KYC_DOCUMENT_APPROVE: 'kyc.document.approve',
  KYC_DOCUMENT_REJECT: 'kyc.document.reject',
  KYC_DOCUMENT_TYPE_MANAGE: 'kyc.document_type.manage',
  
  // Service
  SERVICE_VIEW: 'service.view',
  SERVICE_MANAGE: 'service.manage',
  SERVICE_REQUIREMENT_MANAGE: 'service.requirement.manage',
  SERVICE_WORKFLOW_MANAGE: 'service.workflow.manage',
  
  SERVICE_APPLICATION_CREATE: 'service.application.create',
  SERVICE_APPLICATION_CREATE_AS_CTV: 'service.application.create_as_ctv',
  SERVICE_APPLICATION_VIEW: 'service.application.view',
  SERVICE_APPLICATION_VIEW_ALL: 'service.application.view_all',
  SERVICE_APPLICATION_REVIEW: 'service.application.review',
  SERVICE_APPLICATION_STAGE_UPDATE: 'service.application.stage.update',
  
  // Finance
  FINANCE_BALANCE_VIEW: 'finance.balance.view',
  FINANCE_WITHDRAW_CREATE: 'finance.withdraw.create',
  FINANCE_WITHDRAW_APPROVE: 'finance.withdraw.approve',
  FINANCE_COMMISSION_VIEW: 'finance.commission.view',
  FINANCE_COMMISSION_SNAPSHOT: 'finance.commission.snapshot',
  FINANCE_KPI_MANAGE: 'finance.kpi.manage',
  
  // Referral
  REFERRAL_PERFORMANCE_VIEW: 'referral.performance.view',
  
  // System (Admin)
  SYSTEM_USER_VIEW: 'system.user.view',
  SYSTEM_USER_MANAGE: 'system.user.manage',
  SYSTEM_ROLE_VIEW: 'system.role.view',
  SYSTEM_ROLE_MANAGE: 'system.role.manage',
  SYSTEM_ROLE_ASSIGN: 'system.role.assign',
  SYSTEM_PERMISSION_VIEW: 'system.permission.view',
  SYSTEM_PERMISSION_MANAGE: 'system.permission.manage',
  SYSTEM_AUDIT_VIEW: 'system.audit.view',
  SYSTEM_SETTINGS_MANAGE: 'system.settings.manage',
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];

// Role type from API
export interface Role {
  id: string;
  code: string;
  name: string;
  displayName: string;
  description?: string;
  created_at: string;
  deleted_at?: string;
  permissions: RolePermission[];
  _count?: {
    users: number;
  };
}

export interface RolePermission {
  permission: PermissionItem;
}

export interface PermissionItem {
  id: string;
  code: string;
  module: string;
  description?: string;
}

export interface UserRole {
  role: Role;
  assigned_by?: string;
  created_at: string;
}

// Current user with permissions
export interface CurrentUser {
  id: string;
  phone: string;
  status: string;
  phone_verified: boolean;
  created_at: string;
  roles: string[];
  permissions: string[];
  customer?: {
    kyc_status: string;
  };
  collaborator?: {
    referral_code: string;
    activated_at?: string;
  };
}

// DTOs
export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}

export interface AssignPermissionsRequest {
  permissionIds: number[];
}

export interface AssignRoleToUserRequest {
  userId: string;
  roleCode: string;
}

export interface UpdateUserRolesRequest {
  userId: string;
  roleCodes: string[];
}

// Grouped permissions by module
export interface GroupedPermissions {
  [module: string]: PermissionItem[];
}
