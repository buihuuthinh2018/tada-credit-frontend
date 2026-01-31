"use client";

import { ReactNode } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import type { Permission, SystemRole } from "@/types/rbac";

interface PermissionGateProps {
  children: ReactNode;
  /** Fallback component khi không có quyền */
  fallback?: ReactNode;
  /** Yêu cầu một trong các permissions */
  permissions?: Permission[];
  /** Yêu cầu tất cả permissions */
  allPermissions?: Permission[];
  /** Yêu cầu một trong các roles */
  roles?: SystemRole[];
  /** Yêu cầu tất cả roles */
  allRoles?: SystemRole[];
}

/**
 * Component để kiểm soát hiển thị dựa trên permissions/roles
 * 
 * @example
 * // Yêu cầu một trong các permissions
 * <PermissionGate permissions={['system.user.manage', 'system.role.manage']}>
 *   <AdminPanel />
 * </PermissionGate>
 * 
 * @example
 * // Yêu cầu role ADMIN
 * <PermissionGate roles={['ADMIN']}>
 *   <AdminSettings />
 * </PermissionGate>
 * 
 * @example
 * // Với fallback
 * <PermissionGate permissions={['finance.withdraw.approve']} fallback={<AccessDenied />}>
 *   <WithdrawalApproval />
 * </PermissionGate>
 */
export function PermissionGate({
  children,
  fallback = null,
  permissions,
  allPermissions,
  roles,
  allRoles,
}: PermissionGateProps) {
  const { hasAnyPermission, hasAllPermissions, hasAnyRole, hasAllRoles } = useAuthStore();

  let hasAccess = true;

  // Check permissions
  if (permissions && permissions.length > 0) {
    hasAccess = hasAccess && hasAnyPermission(permissions);
  }

  if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAccess && hasAllPermissions(allPermissions);
  }

  // Check roles
  if (roles && roles.length > 0) {
    hasAccess = hasAccess && hasAnyRole(roles);
  }

  if (allRoles && allRoles.length > 0) {
    hasAccess = hasAccess && hasAllRoles(allRoles);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Component cho Admin-only content
 */
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate roles={["ADMIN"]} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * Component cho Manager and above
 */
export function ManagerOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate roles={["ADMIN", "MANAGER"]} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * Component cho Staff (Supporter, Manager, Admin)
 */
export function StaffOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate roles={["ADMIN", "MANAGER", "SUPPORTER"]} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}
