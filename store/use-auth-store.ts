import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CurrentUser } from "@/types/rbac";

interface AuthState {
  // User data
  user: CurrentUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  // Computed
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: CurrentUser, accessToken: string, refreshToken: string) => void;
  updateUser: (user: Partial<CurrentUser>) => void;
  logout: () => void;
  
  // Permission helpers
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
        
        // Also store tokens in localStorage for API client
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
        }
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      },

      // Permission helpers
      hasRole: (role) => {
        const user = get().user;
        return user?.roles?.includes(role) ?? false;
      },

      hasAnyRole: (roles) => {
        const user = get().user;
        return roles.some(role => user?.roles?.includes(role)) ?? false;
      },

      hasAllRoles: (roles) => {
        const user = get().user;
        return roles.every(role => user?.roles?.includes(role)) ?? false;
      },

      hasPermission: (permission) => {
        const user = get().user;
        return user?.permissions?.includes(permission) ?? false;
      },

      hasAnyPermission: (permissions) => {
        const user = get().user;
        return permissions.some(p => user?.permissions?.includes(p)) ?? false;
      },

      hasAllPermissions: (permissions) => {
        const user = get().user;
        return permissions.every(p => user?.permissions?.includes(p)) ?? false;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUserRoles = () => useAuthStore((state) => state.user?.roles ?? []);
export const useUserPermissions = () => useAuthStore((state) => state.user?.permissions ?? []);
