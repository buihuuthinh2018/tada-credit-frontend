"use client";

import { useState } from "react";
import { useUsers, useAssignRole, useRemoveRole } from "@/hooks/users";
import { useRoles } from "@/hooks/rbac";
import { usePermissions } from "@/hooks/use-permissions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { theme } from "@/lib/colors";
import {
  Users,
  Search,
  Loader2,
  AlertTriangle,
  Shield,
  Mail,
  Phone,
  MoreVertical,
  UserPlus,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Role } from "@/types/rbac";
import Link from "next/link";

// Định nghĩa User type
interface User {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  roles?: { id: string; name: string; displayName: string }[];
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const { data: usersData, isLoading: usersLoading, error: usersError } = useUsers({
    search: searchTerm,
    page,
    limit: 20,
  });
  const { data: roles } = useRoles();
  const permissions = usePermissions();

  const assignRoleMutation = useAssignRole();
  const removeRoleMutation = useRemoveRole();

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await assignRoleMutation.mutateAsync({ userId, roleId });
      toast.success("Đã gán role thành công!");
      setIsRoleModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Không thể gán role");
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    if (!confirm("Bạn có chắc muốn xóa role này khỏi user?")) return;
    try {
      await removeRoleMutation.mutateAsync({ userId, roleId });
      toast.success("Đã xóa role thành công!");
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa role");
    }
  };

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (usersError) {
    return (
      <div className={`${theme.card.base} p-6 text-center`}>
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
          Không thể tải dữ liệu
        </h2>
        <p className={theme.text.secondary}>Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const users = usersData?.data || [];
  const pagination = usersData?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
            Users Management
          </h1>
          <p className={theme.text.secondary}>
            Quản lý {pagination?.total || 0} người dùng trong hệ thống
          </p>
        </div>

        {permissions.canManageUsers && (
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo email, tên..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <div className={`${theme.card.base} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}>
                  User
                </th>
                <th className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}>
                  Liên hệ
                </th>
                <th className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}>
                  Roles
                </th>
                <th className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}>
                  Trạng thái
                </th>
                <th className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}>
                  Ngày tạo
                </th>
                {permissions.canManageUsers && (
                  <th className={`text-right px-4 py-3 text-sm font-medium ${theme.text.muted}`}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className={`font-medium ${theme.text.primary}`}>
                          {user.firstName} {user.lastName}
                        </p>
                        <p className={`text-sm ${theme.text.muted}`}>
                          ID: {user.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className={`text-sm ${theme.text.secondary}`}>
                          {user.email}
                        </span>
                        {user.isEmailVerified && (
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        )}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className={`text-sm ${theme.text.secondary}`}>
                            {user.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <span
                            key={role.id}
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                              role.name === "admin" &&
                                "bg-red-500/10 text-red-500",
                              role.name === "manager" &&
                                "bg-purple-500/10 text-purple-500",
                              role.name === "supporter" &&
                                "bg-blue-500/10 text-blue-500",
                              role.name === "ctv" &&
                                "bg-green-500/10 text-green-500",
                              role.name === "customer" &&
                                "bg-amber-500/10 text-amber-500",
                              role.name === "user" &&
                                "bg-gray-500/10 text-gray-500"
                            )}
                          >
                            <Shield className="h-3 w-3" />
                            {role.displayName}
                          </span>
                        ))
                      ) : (
                        <span className={`text-sm ${theme.text.muted}`}>
                          No roles
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
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
                  </td>
                  <td className={`px-4 py-4 text-sm ${theme.text.secondary}`}>
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  {permissions.canManageUsers && (
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsRoleModalOpen(true);
                          }}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className={`text-sm ${theme.text.muted}`}>
              Hiển thị {(page - 1) * 20 + 1}-
              {Math.min(page * 20, pagination.total)} / {pagination.total}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Assign Role Modal */}
      {isRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsRoleModalOpen(false)}
          />
          <div className={`${theme.card.base} p-6 w-full max-w-md relative z-10`}>
            <h2 className={`text-lg font-semibold mb-1 ${theme.text.primary}`}>
              Quản lý Roles
            </h2>
            <p className={`text-sm mb-4 ${theme.text.secondary}`}>
              {selectedUser.email}
            </p>

            {/* Current Roles */}
            {selectedUser.roles && selectedUser.roles.length > 0 && (
              <div className="mb-4">
                <p className={`text-sm font-medium mb-2 ${theme.text.muted}`}>
                  Current Roles
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.roles.map((role) => (
                    <span
                      key={role.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span className="text-sm">{role.displayName}</span>
                      <button
                        onClick={() => handleRemoveRole(selectedUser.id, role.id)}
                        className="hover:text-destructive transition-colors"
                        title="Xóa role"
                        aria-label={`Xóa role ${role.displayName}`}
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Roles */}
            <div>
              <p className={`text-sm font-medium mb-2 ${theme.text.muted}`}>
                Add Role
              </p>
              <div className="grid gap-2">
                {roles
                  ?.filter(
                    (r: Role) =>
                      !selectedUser.roles?.some((ur) => ur.id === r.id)
                  )
                  .map((role: Role) => (
                    <button
                      key={role.id}
                      onClick={() => handleAssignRole(selectedUser.id, role.id)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        "hover:bg-accent/50 transition-colors text-left"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-primary" />
                        <div>
                          <p className={`font-medium ${theme.text.primary}`}>
                            {role.displayName}
                          </p>
                          <p className={`text-xs ${theme.text.muted}`}>
                            {role.description}
                          </p>
                        </div>
                      </div>
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setIsRoleModalOpen(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
