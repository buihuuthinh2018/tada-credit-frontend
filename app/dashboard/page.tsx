"use client";

import { User as UserIcon, Calendar, Activity, FileText, CreditCard, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useCurrentUser } from "@/hooks/auth";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthStore } from "@/store/use-auth-store";
import { theme } from "@/lib/colors";
import type { CurrentUser } from "@/types/rbac";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data: currentUser } = useCurrentUser();
  const permissions = usePermissions();
  const { hasAnyRole } = useAuthStore();

  if (!currentUser) {
    return null;
  }

  // Quick actions based on roles
  const quickActions = [
    {
      title: "Hồ sơ KYC",
      description: "Xác thực danh tính của bạn",
      href: "/dashboard/kyc",
      icon: CreditCard,
      color: "text-blue-500 bg-blue-500/10",
      show: true,
    },
    {
      title: "Đăng ký vay",
      description: "Tạo đơn đăng ký vay mới",
      href: "/dashboard/applications/new",
      icon: FileText,
      color: "text-green-500 bg-green-500/10",
      show: hasAnyRole(["CUSTOMER", "CTV", "SUPPORTER", "MANAGER", "ADMIN"]),
    },
    {
      title: "Tạo đơn cho khách",
      description: "Tạo đơn vay cho khách hàng",
      href: "/dashboard/ctv/create-application",
      icon: FileText,
      color: "text-purple-500 bg-purple-500/10",
      show: hasAnyRole(["CTV", "SUPPORTER", "MANAGER", "ADMIN"]),
    },
    {
      title: "Xem hiệu suất",
      description: "Thống kê giới thiệu của bạn",
      href: "/dashboard/ctv/performance",
      icon: TrendingUp,
      color: "text-amber-500 bg-amber-500/10",
      show: hasAnyRole(["CTV", "SUPPORTER", "MANAGER", "ADMIN"]),
    },
  ].filter(action => action.show);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className={`text-2xl lg:text-3xl font-bold ${theme.text.primary} mb-2`}>
          Chào mừng trở lại! 👋
        </h1>
        <p className={theme.text.secondary}>
          Đây là trang dashboard của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <UserIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className={`text-sm ${theme.text.muted}`}>Trạng thái</p>
                <p className={`text-lg font-semibold ${theme.text.primary}`}>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      currentUser.status === "ACTIVE"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-amber-500/10 text-amber-500"
                    )}
                  >
                    {currentUser.status}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className={`text-sm ${theme.text.muted}`}>Ngày tham gia</p>
                <p className={`text-lg font-semibold ${theme.text.primary}`}>
                  {new Date(currentUser.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CreditCard className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className={`text-sm ${theme.text.muted}`}>KYC</p>
                <p className={`text-lg font-semibold ${theme.text.primary}`}>
                  {currentUser.customer?.kyc_status || "Chưa xác thực"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentUser.collaborator && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className={`text-sm ${theme.text.muted}`}>Mã giới thiệu</p>
                  <p className={`text-lg font-semibold font-mono ${theme.text.primary}`}>
                    {currentUser.collaborator.referral_code}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className={cn(theme.card.hover, "lg:col-span-2")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Thông tin tài khoản
            </CardTitle>
            <CardDescription>Thông tin chi tiết về tài khoản của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className={`text-sm ${theme.text.muted}`}>ID</p>
                <p className="font-mono text-sm truncate">{currentUser.id}</p>
              </div>
              <div className="space-y-1">
                <p className={`text-sm ${theme.text.muted}`}>Số điện thoại</p>
                <p className="font-semibold">{currentUser.phone}</p>
              </div>
              <div className="space-y-1">
                <p className={`text-sm ${theme.text.muted}`}>Xác thực SĐT</p>
                <p className={cn(
                  "text-sm font-medium",
                  currentUser.phone_verified ? "text-green-500" : "text-amber-500"
                )}>
                  {currentUser.phone_verified ? "Đã xác thực ✓" : "Chưa xác thực"}
                </p>
              </div>
              <div className="space-y-1">
                <p className={`text-sm ${theme.text.muted}`}>Roles</p>
                <div className="flex flex-wrap gap-1">
                  {currentUser.roles?.map((role) => (
                    <span
                      key={role}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        role === "ADMIN" && "bg-red-500/10 text-red-500",
                        role === "MANAGER" && "bg-purple-500/10 text-purple-500",
                        role === "SUPPORTER" && "bg-blue-500/10 text-blue-500",
                        role === "CTV" && "bg-green-500/10 text-green-500",
                        role === "CUSTOMER" && "bg-amber-500/10 text-amber-500",
                        role === "USER" && "bg-gray-500/10 text-gray-500"
                      )}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className={theme.card.hover}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Thao tác nhanh
            </CardTitle>
            <CardDescription>Các tính năng thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors group">
                  <div className={cn("p-2 rounded-lg", action.color)}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${theme.text.primary}`}>
                      {action.title}
                    </p>
                    <p className={`text-xs ${theme.text.muted} truncate`}>
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Permissions info (for debugging/demo) */}
      {permissions.isAdmin && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Debug: Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentUser.permissions?.slice(0, 10).map((perm) => (
                <span
                  key={perm}
                  className="text-xs px-2 py-1 rounded bg-muted font-mono"
                >
                  {perm}
                </span>
              ))}
              {(currentUser.permissions?.length ?? 0) > 10 && (
                <span className={`text-xs ${theme.text.muted}`}>
                  +{(currentUser.permissions?.length ?? 0) - 10} more
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
