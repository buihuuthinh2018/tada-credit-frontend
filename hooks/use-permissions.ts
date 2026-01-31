"use client";

import { useCurrentUser } from "@/hooks/auth";
import type { Permission, SystemRole } from "@/types/rbac";

/**
 * Hook để kiểm tra permissions/roles
 * Uses currentUser from API to ensure fresh data
 * 
 * @example
 * const { canManageUsers, canViewAudit, isAdmin } = usePermissions();
 * 
 * if (canManageUsers) {
 *   // Show user management UI
 * }
 */
export function usePermissions() {
  const { data: user } = useCurrentUser();

  // Helper functions that work directly with currentUser
  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) ?? false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => user?.roles?.includes(role)) ?? false;
  };

  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every(role => user?.roles?.includes(role)) ?? false;
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(p => user?.permissions?.includes(p)) ?? false;
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(p => user?.permissions?.includes(p)) ?? false;
  };

  return {
    // Raw functions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // User info
    roles: user?.roles ?? [],
    permissions: user?.permissions ?? [],

    // Common role checks
    isAdmin: hasRole("ADMIN"),
    isManager: hasAnyRole(["ADMIN", "MANAGER"]),
    isSupporter: hasAnyRole(["ADMIN", "MANAGER", "SUPPORTER"]),
    isCustomer: hasRole("CUSTOMER"),
    isCollaborator: hasRole("CTV"),

    // System permissions
    canViewUsers: hasAnyPermission(["system.user.view", "system.user.manage"]),
    canManageUsers: hasPermission("system.user.manage"),
    canViewRoles: hasAnyPermission(["system.role.view", "system.role.manage"]),
    canManageRoles: hasPermission("system.role.manage"),
    canAssignRoles: hasPermission("system.role.assign"),
    canViewPermissions: hasAnyPermission(["system.permission.view", "system.permission.manage"]),
    canManagePermissions: hasPermission("system.permission.manage"),
    canViewAudit: hasPermission("system.audit.view"),
    canManageSettings: hasPermission("system.settings.manage"),

    // KYC permissions
    canUploadKYC: hasPermission("kyc.document.upload"),
    canViewKYC: hasAnyPermission(["kyc.document.view", "kyc.document.review"]),
    canReviewKYC: hasPermission("kyc.document.review"),
    canApproveKYC: hasPermission("kyc.document.approve"),
    canRejectKYC: hasPermission("kyc.document.reject"),
    canManageDocTypes: hasPermission("kyc.document_type.manage"),

    // Service permissions
    canViewServices: hasPermission("service.view"),
    canManageServices: hasPermission("service.manage"),
    canCreateApplication: hasAnyPermission([
      "service.application.create",
      "service.application.create_as_ctv",
    ]),
    canViewApplications: hasAnyPermission([
      "service.application.view",
      "service.application.view_all",
    ]),
    canViewAllApplications: hasPermission("service.application.view_all"),
    canReviewApplications: hasPermission("service.application.review"),
    canUpdateApplicationStage: hasPermission("service.application.stage.update"),

    // Finance permissions
    canViewBalance: hasPermission("finance.balance.view"),
    canCreateWithdrawal: hasPermission("finance.withdraw.create"),
    canApproveWithdrawal: hasPermission("finance.withdraw.approve"),
    canViewCommission: hasPermission("finance.commission.view"),
    canSnapshotCommission: hasPermission("finance.commission.snapshot"),
    canManageKPI: hasPermission("finance.kpi.manage"),

    // Referral permissions
    canViewReferralPerformance: hasPermission("referral.performance.view"),
  };
}

/**
 * Hook để kiểm tra một permission cụ thể
 */
export function useHasPermission(permission: Permission): boolean {
  const { data: user } = useCurrentUser();
  return user?.permissions?.includes(permission) ?? false;
}

/**
 * Hook để kiểm tra một role cụ thể  
 */
export function useHasRole(role: SystemRole): boolean {
  const { data: user } = useCurrentUser();
  return user?.roles?.includes(role) ?? false;
}

/**
 * Hook để kiểm tra xem user có phải admin không
 */
export function useIsAdmin(): boolean {
  const { data: user } = useCurrentUser();
  return user?.roles?.includes("ADMIN") ?? false;
}
