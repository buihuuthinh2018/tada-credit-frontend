"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { useUser } from "@/store/use-auth-store";
import { theme } from "@/lib/colors";
import {
  Users,
  Shield,
  FileText,
  CreditCard,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const user = useUser();
  const permissions = usePermissions();

  const stats = [
    {
      label: "Tổng Users",
      value: "1,234",
      change: "+12%",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      show: permissions.canViewUsers,
    },
    {
      label: "KYC Pending",
      value: "56",
      change: "-8%",
      icon: <FileText className="h-5 w-5" />,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      show: permissions.canViewKYC,
    },
    {
      label: "Withdrawals Pending",
      value: "23",
      change: "+5%",
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      show: permissions.canApproveWithdrawal,
    },
    {
      label: "Active Roles",
      value: "6",
      change: "0%",
      icon: <Shield className="h-5 w-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      show: permissions.canViewRoles,
    },
  ];

  const recentActivities = [
    { action: "User registered", user: "0912****89", time: "2 phút trước" },
    { action: "KYC approved", user: "0987****56", time: "15 phút trước" },
    { action: "Withdrawal approved", user: "0901****23", time: "1 giờ trước" },
    { action: "Role assigned", user: "0909****45", time: "2 giờ trước" },
    { action: "Application submitted", user: "0933****78", time: "3 giờ trước" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
          Admin Dashboard
        </h1>
        <p className={theme.text.secondary}>
          Xin chào, {user?.phone}! Đây là tổng quan hệ thống.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats
          .filter((stat) => stat.show)
          .map((stat) => (
            <div key={stat.label} className={`${theme.card.base} p-6`}>
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.change.startsWith("+")
                      ? "text-green-500"
                      : stat.change.startsWith("-")
                      ? "text-red-500"
                      : theme.text.muted
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className={`text-2xl font-bold ${theme.text.primary}`}>
                  {stat.value}
                </h3>
                <p className={`text-sm ${theme.text.secondary}`}>{stat.label}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className={`${theme.card.base} p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
              Hoạt động gần đây
            </h2>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className={`text-sm font-medium ${theme.text.primary}`}>
                    {activity.action}
                  </p>
                  <p className={`text-xs ${theme.text.muted}`}>
                    {activity.user}
                  </p>
                </div>
                <span className={`text-xs ${theme.text.muted}`}>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${theme.card.base} p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
              Thao tác nhanh
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {permissions.canViewUsers && (
              <a
                href="/admin/users"
                className={`${theme.card.interactive} p-4 text-center`}
              >
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <span className={`text-sm font-medium ${theme.text.primary}`}>
                  Quản lý Users
                </span>
              </a>
            )}
            {permissions.canViewRoles && (
              <a
                href="/admin/rbac/roles"
                className={`${theme.card.interactive} p-4 text-center`}
              >
                <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <span className={`text-sm font-medium ${theme.text.primary}`}>
                  Quản lý Roles
                </span>
              </a>
            )}
            {permissions.canViewKYC && (
              <a
                href="/admin/kyc"
                className={`${theme.card.interactive} p-4 text-center`}
              >
                <FileText className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <span className={`text-sm font-medium ${theme.text.primary}`}>
                  Review KYC
                </span>
              </a>
            )}
            {permissions.canApproveWithdrawal && (
              <a
                href="/admin/finance"
                className={`${theme.card.interactive} p-4 text-center`}
              >
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <span className={`text-sm font-medium ${theme.text.primary}`}>
                  Duyệt Withdrawals
                </span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className={`${theme.card.base} p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${theme.text.primary}`}>
          Thông tin tài khoản
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className={`text-sm ${theme.text.muted}`}>Số điện thoại</p>
            <p className={`font-medium ${theme.text.primary}`}>{user?.phone}</p>
          </div>
          <div>
            <p className={`text-sm ${theme.text.muted}`}>Trạng thái</p>
            <p className={`font-medium ${theme.text.primary}`}>{user?.status}</p>
          </div>
          <div>
            <p className={`text-sm ${theme.text.muted}`}>Roles</p>
            <p className={`font-medium ${theme.text.primary}`}>
              {user?.roles?.join(", ")}
            </p>
          </div>
          <div>
            <p className={`text-sm ${theme.text.muted}`}>Permissions</p>
            <p className={`font-medium ${theme.text.primary}`}>
              {user?.permissions?.length || 0} quyền
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
