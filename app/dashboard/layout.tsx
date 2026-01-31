"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Home,
  User,
  FileText,
  CreditCard,
  Users,
  DollarSign,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  Loader2,
  ChevronRight,
  Briefcase,
  TrendingUp,
  Bell,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";
import { theme } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { useCurrentUser, useLogout } from "@/hooks/auth";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthStore } from "@/store/use-auth-store";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
  roles?: string[];
  badge?: string;
}

// Navigation items based on roles/permissions
const getNavigationItems = (): NavItem[] => [
  {
    title: "Trang chủ",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Hồ sơ cá nhân",
    href: "/dashboard/profile",
    icon: User,
  },
  // Customer menu items
  {
    title: "Hồ sơ KYC",
    href: "/dashboard/kyc",
    icon: CreditCard,
    roles: ["CUSTOMER", "CTV", "SUPPORTER", "MANAGER", "ADMIN"],
  },
  {
    title: "Đơn đăng ký",
    href: "/dashboard/applications",
    icon: FileText,
    roles: ["CUSTOMER", "CTV", "SUPPORTER", "MANAGER", "ADMIN"],
  },
  // CTV (Collaborator) menu items
  {
    title: "Tạo đơn cho khách",
    href: "/dashboard/ctv/create-application",
    icon: Briefcase,
    roles: ["CTV", "SUPPORTER", "MANAGER", "ADMIN"],
  },
  {
    title: "Khách hàng của tôi",
    href: "/dashboard/ctv/customers",
    icon: Users,
    roles: ["CTV", "SUPPORTER", "MANAGER", "ADMIN"],
  },
  {
    title: "Hiệu suất giới thiệu",
    href: "/dashboard/ctv/performance",
    icon: TrendingUp,
    roles: ["CTV", "SUPPORTER", "MANAGER", "ADMIN"],
  },
  // Finance
  {
    title: "Số dư & Hoa hồng",
    href: "/dashboard/finance",
    icon: DollarSign,
    roles: ["CTV", "SUPPORTER", "MANAGER", "ADMIN"],
  },
  // Supporter/Manager items
  {
    title: "Đơn cần xử lý",
    href: "/dashboard/work/applications",
    icon: FileText,
    roles: ["SUPPORTER", "MANAGER", "ADMIN"],
    badge: "3",
  },
  {
    title: "KYC chờ duyệt",
    href: "/dashboard/work/kyc",
    icon: CreditCard,
    roles: ["SUPPORTER", "MANAGER", "ADMIN"],
    badge: "5",
  },
  // Admin quick access
  {
    title: "Quản trị hệ thống",
    href: "/admin",
    icon: Shield,
    roles: ["ADMIN"],
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: "Thông báo",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Hỗ trợ",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
  {
    title: "Cài đặt",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: currentUser, isLoading, error } = useCurrentUser();
  const logoutMutation = useLogout();
  const permissions = usePermissions();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      router.push("/login");
    }
  }, [error, router]);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.push("/login");
  };

  // Helper function to check if user has any of the specified roles
  const userHasAnyRole = (roles: string[]): boolean => {
    if (!currentUser?.roles) return false;
    return roles.some(role => currentUser.roles.includes(role));
  };

  // Filter nav items based on user roles
  const filterNavItems = (items: NavItem[]) => {
    return items.filter((item) => {
      // If no roles specified, show to everyone
      if (!item.roles) return true;
      // Check if user has any of the required roles
      return userHasAnyRole(item.roles);
    });
  };

  const navItems = filterNavItems(getNavigationItems());

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Get user's primary role for display
  const userRoles = currentUser.roles || [];
  const primaryRole = userRoles[0] || "USER";
  const roleDisplayNames: Record<string, string> = {
    ADMIN: "Administrator",
    MANAGER: "Manager",
    SUPPORTER: "Supporter", 
    CTV: "Cộng tác viên",
    CUSTOMER: "Khách hàng",
    USER: "Người dùng",
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TC</span>
              </div>
              <span className={`text-xl font-bold ${theme.text.gradient}`}>
                TADA Credit
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {currentUser.phone?.slice(-2) || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${theme.text.primary}`}>
                  {currentUser.phone}
                </p>
                <p className={`text-xs ${theme.text.muted}`}>
                  {roleDisplayNames[primaryRole as string] || primaryRole}
                </p>
              </div>
            </div>
            {/* Role badges */}
            {userRoles.length > 1 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {userRoles.slice(0, 3).map((role) => (
                  <span
                    key={role}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      role === "ADMIN" && "bg-red-500/10 text-red-500",
                      role === "MANAGER" && "bg-purple-500/10 text-purple-500",
                      role === "SUPPORTER" && "bg-blue-500/10 text-blue-500",
                      role === "CTV" && "bg-green-500/10 text-green-500",
                      role === "CUSTOMER" && "bg-amber-500/10 text-amber-500"
                    )}
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-accent/50 text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-sm font-medium">{item.title}</span>
                    {item.badge && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        isActive 
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary text-primary-foreground"
                      )}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-4 mx-3 border-t" />

            {/* Bottom nav items */}
            <div className="px-3 space-y-1">
              {bottomNavItems.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent/50 text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-sm font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${theme.text.muted}`}>Theme</span>
              <ThemeToggle />
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 h-16 border-b bg-background/95 backdrop-blur lg:hidden">
          <div className="flex h-full items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/dashboard" className="flex items-center gap-2">
              <span className={`text-lg font-bold ${theme.text.gradient}`}>
                TADA Credit
              </span>
            </Link>

            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
