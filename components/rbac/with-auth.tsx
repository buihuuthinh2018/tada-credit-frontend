"use client";

import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import type { Permission, SystemRole } from "@/types/rbac";
import { Loader2 } from "lucide-react";

interface WithAuthOptions {
  /** Redirect URL khi chưa đăng nhập */
  redirectTo?: string;
  /** Yêu cầu một trong các permissions */
  permissions?: Permission[];
  /** Yêu cầu một trong các roles */
  roles?: SystemRole[];
  /** Redirect URL khi không có quyền */
  forbiddenRedirect?: string;
}

/**
 * HOC để bảo vệ page yêu cầu authentication và authorization
 * 
 * @example
 * // Yêu cầu đăng nhập
 * export default withAuth(DashboardPage);
 * 
 * @example
 * // Yêu cầu role ADMIN
 * export default withAuth(AdminPage, { roles: ['ADMIN'] });
 * 
 * @example
 * // Yêu cầu permission cụ thể
 * export default withAuth(UsersPage, { 
 *   permissions: ['system.user.manage'],
 *   forbiddenRedirect: '/dashboard'
 * });
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    redirectTo = "/login",
    permissions,
    roles,
    forbiddenRedirect = "/dashboard",
  } = options;

  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const { isAuthenticated, user, hasAnyPermission, hasAnyRole } = useAuthStore();

    useEffect(() => {
      // Check authentication
      if (!isAuthenticated) {
        router.replace(redirectTo);
        return;
      }

      // Check permissions
      if (permissions && permissions.length > 0 && !hasAnyPermission(permissions)) {
        router.replace(forbiddenRedirect);
        return;
      }

      // Check roles
      if (roles && roles.length > 0 && !hasAnyRole(roles)) {
        router.replace(forbiddenRedirect);
        return;
      }
    }, [isAuthenticated, user, router, hasAnyPermission, hasAnyRole]);

    // Show loading while checking auth
    if (!isAuthenticated) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    // Check authorization
    if (permissions && permissions.length > 0 && !hasAnyPermission(permissions)) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (roles && roles.length > 0 && !hasAnyRole(roles)) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

/**
 * HOC cho Admin pages
 */
export function withAdmin<P extends object>(WrappedComponent: ComponentType<P>) {
  return withAuth(WrappedComponent, {
    roles: ["ADMIN"],
    forbiddenRedirect: "/dashboard",
  });
}

/**
 * HOC cho Manager pages
 */
export function withManager<P extends object>(WrappedComponent: ComponentType<P>) {
  return withAuth(WrappedComponent, {
    roles: ["ADMIN", "MANAGER"],
    forbiddenRedirect: "/dashboard",
  });
}

/**
 * HOC cho Staff pages
 */
export function withStaff<P extends object>(WrappedComponent: ComponentType<P>) {
  return withAuth(WrappedComponent, {
    roles: ["ADMIN", "MANAGER", "SUPPORTER"],
    forbiddenRedirect: "/dashboard",
  });
}
