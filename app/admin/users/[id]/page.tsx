"use client";

import { use, useState } from "react";
import { useUser, useUpdateUserStatus, useAssignRole, useRemoveRole } from "@/hooks/users";
import { useRoles } from "@/hooks/rbac";
import { usePermissions } from "@/hooks/use-permissions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { theme } from "@/lib/colors";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  UserPlus,
  User,
  CreditCard,
  FileText,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Role } from "@/types/rbac";
import Link from "next/link";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = use(params);
  const { data: user, isLoading, error, refetch } = useUser(userId);
  const { data: roles } = useRoles();
  const permissions = usePermissions();

  const [isEditing, setIsEditing] = useState(false);
  const updateStatusMutation = useUpdateUserStatus();
  const assignRoleMutation = useAssignRole();
  const removeRoleMutation = useRemoveRole();

  const handleToggleStatus = async () => {
    if (!user) return;
    if (!confirm(`Bạn có chắc muốn ${user.isActive ? "vô hiệu hóa" : "kích hoạt"} tài khoản này?`)) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: userId,
        data: { isActive: !user.isActive },
      });
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAssignRole = async (roleId: string) => {
    try {
      await assignRoleMutation.mutateAsync({ userId, roleId });
      toast.success("Đã gán role thành công!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Không thể gán role");
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!confirm("Bạn có chắc muốn xóa role này?")) return;
    try {
      await removeRoleMutation.mutateAsync({ userId, roleId });
      toast.success("Đã xóa role thành công!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa role");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={`${theme.card.base} p-6 text-center`}>
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
          Không tìm thấy người dùng
        </h2>
        <p className={theme.text.secondary}>ID: {userId}</p>
        <Link href="/admin/users" className="inline-block mt-4">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>
    );
  }

  // Available roles to assign (not already assigned)
  const availableRoles = roles?.filter(
    (r: Role) => !user.roles?.some((ur: any) => ur.id === r.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
            Chi tiết người dùng
          </h1>
          <p className={theme.text.secondary}>ID: {userId}</p>
        </div>
        {permissions.canManageUsers && (
          <Button
            variant={user.isActive ? "destructive" : "default"}
            onClick={handleToggleStatus}
          >
            {user.isActive ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Vô hiệu hóa
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Kích hoạt
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Profile Card */}
        <div className={`${theme.card.base} p-6 lg:col-span-2`}>
          <h2 className={`text-lg font-semibold mb-4 ${theme.text.primary}`}>
            Thông tin cá nhân
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Avatar & Name */}
            <div className="sm:col-span-2 flex items-center gap-4 pb-4 border-b">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${theme.text.primary}`}>
                  {user.firstName} {user.lastName}
                </h3>
                <p className={`text-sm ${theme.text.muted}`}>
                  @{user.username || user.email.split("@")[0]}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className={`text-sm font-medium ${theme.text.muted}`}>
                Email
              </label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className={theme.text.primary}>{user.email}</span>
                {user.isEmailVerified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className={`text-sm font-medium ${theme.text.muted}`}>
                Số điện thoại
              </label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className={theme.text.primary}>
                  {user.phone || "Chưa cập nhật"}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className={`text-sm font-medium ${theme.text.muted}`}>
                Trạng thái
              </label>
              <div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                    user.isActive
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  )}
                >
                  {user.isActive ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      Inactive
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Created At */}
            <div className="space-y-1">
              <label className={`text-sm font-medium ${theme.text.muted}`}>
                Ngày tạo
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className={theme.text.primary}>
                  {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Roles Card */}
        <div className={`${theme.card.base} p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${theme.text.primary}`}>
            Roles
          </h2>

          {/* Current Roles */}
          <div className="space-y-2">
            {user.roles && user.roles.length > 0 ? (
              user.roles.map((role: any) => (
                <div
                  key={role.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    role.name === "admin" && "bg-red-500/10",
                    role.name === "manager" && "bg-purple-500/10",
                    role.name === "supporter" && "bg-blue-500/10",
                    role.name === "ctv" && "bg-green-500/10",
                    role.name === "customer" && "bg-amber-500/10",
                    role.name === "user" && "bg-gray-500/10"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Shield
                      className={cn(
                        "h-4 w-4",
                        role.name === "admin" && "text-red-500",
                        role.name === "manager" && "text-purple-500",
                        role.name === "supporter" && "text-blue-500",
                        role.name === "ctv" && "text-green-500",
                        role.name === "customer" && "text-amber-500",
                        role.name === "user" && "text-gray-500"
                      )}
                    />
                    <span className={theme.text.primary}>{role.displayName}</span>
                  </div>
                  {permissions.canManageUsers && role.name !== "user" && (
                    <button
                      onClick={() => handleRemoveRole(role.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title="Xóa role"
                      aria-label={`Xóa role ${role.displayName}`}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className={`text-sm ${theme.text.muted}`}>Chưa có role</p>
            )}
          </div>

          {/* Add Role */}
          {permissions.canManageUsers && availableRoles && availableRoles.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className={`text-sm font-medium mb-2 ${theme.text.muted}`}>
                Thêm role
              </p>
              <div className="space-y-1">
                {availableRoles.map((role: Role) => (
                  <button
                    key={role.id}
                    onClick={() => handleAssignRole(role.id)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-lg text-left",
                      "hover:bg-accent/50 transition-colors"
                    )}
                  >
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                    <span className={`text-sm ${theme.text.secondary}`}>
                      {role.displayName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={`/admin/kyc?userId=${userId}`}>
          <div className={`${theme.card.interactive} p-4`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <CreditCard className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className={`font-medium ${theme.text.primary}`}>KYC</p>
                <p className={`text-xs ${theme.text.muted}`}>Xem hồ sơ KYC</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href={`/admin/applications?userId=${userId}`}>
          <div className={`${theme.card.interactive} p-4`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className={`font-medium ${theme.text.primary}`}>Đơn vay</p>
                <p className={`text-xs ${theme.text.muted}`}>Xem đơn đăng ký</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href={`/admin/referrals?userId=${userId}`}>
          <div className={`${theme.card.interactive} p-4`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <User className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className={`font-medium ${theme.text.primary}`}>Referrals</p>
                <p className={`text-xs ${theme.text.muted}`}>Xem giới thiệu</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href={`/admin/activities?userId=${userId}`}>
          <div className={`${theme.card.interactive} p-4`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Activity className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className={`font-medium ${theme.text.primary}`}>Hoạt động</p>
                <p className={`text-xs ${theme.text.muted}`}>Xem logs</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
