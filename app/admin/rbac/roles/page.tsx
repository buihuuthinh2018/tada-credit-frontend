"use client";

import { useState } from "react";
import { useRoles, useDeleteRole, useCreateRole } from "@/hooks/rbac";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { theme } from "@/lib/colors";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Key,
  Search,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import type { Role } from "@/types/rbac";

export default function RolesPage() {
  const { data: roles, isLoading, error } = useRoles();
  const deleteRoleMutation = useDeleteRole();
  const createRoleMutation = useCreateRole();
  const permissions = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRole, setNewRole] = useState({ code: "", name: "", description: "" });

  // Filter roles by search
  const filteredRoles = roles?.filter(
    (role) =>
      role.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (roleId: string, roleCode: string) => {
    if (["USER", "CUSTOMER", "CTV", "SUPPORTER", "MANAGER", "ADMIN"].includes(roleCode)) {
      alert("Không thể xoá system role!");
      return;
    }
    if (confirm(`Bạn có chắc muốn xoá role "${roleCode}"?`)) {
      await deleteRoleMutation.mutateAsync(roleId);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRoleMutation.mutateAsync(newRole);
    setShowCreateModal(false);
    setNewRole({ code: "", name: "", description: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
            Quản lý Roles
          </h1>
          <p className={theme.text.secondary}>
            Quản lý roles và phân quyền trong hệ thống
          </p>
        </div>
        {permissions.canManageRoles && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo Role mới
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoles?.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            onDelete={() => handleDelete(role.id, role.code)}
            canManage={permissions.canManageRoles}
          />
        ))}
      </div>

      {filteredRoles?.length === 0 && (
        <div className={`${theme.card.base} p-12 text-center`}>
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
            Không tìm thấy role
          </h2>
          <p className={theme.text.secondary}>
            Thử tìm kiếm với từ khóa khác.
          </p>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`${theme.card.base} p-6 w-full max-w-md mx-4`}>
            <h2 className={`text-lg font-semibold mb-4 ${theme.text.primary}`}>
              Tạo Role mới
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={`text-sm font-medium ${theme.text.primary}`}>
                  Role Code
                </label>
                <Input
                  placeholder="VD: TEAM_LEAD"
                  value={newRole.code}
                  onChange={(e) =>
                    setNewRole({ ...newRole, code: e.target.value.toUpperCase() })
                  }
                  required
                />
                <p className={`text-xs mt-1 ${theme.text.muted}`}>
                  Chỉ chữ hoa, số và dấu gạch dưới
                </p>
              </div>
              <div>
                <label className={`text-sm font-medium ${theme.text.primary}`}>
                  Tên hiển thị
                </label>
                <Input
                  placeholder="VD: Team Lead"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${theme.text.primary}`}>
                  Mô tả
                </label>
                <Input
                  placeholder="Mô tả role..."
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Huỷ
                </Button>
                <Button type="submit" disabled={createRoleMutation.isPending}>
                  {createRoleMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Tạo Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Role Card Component
function RoleCard({
  role,
  onDelete,
  canManage,
}: {
  role: Role;
  onDelete: () => void;
  canManage: boolean;
}) {
  const isSystemRole = ["USER", "CUSTOMER", "CTV", "SUPPORTER", "MANAGER", "ADMIN"].includes(
    role.code
  );

  return (
    <div className={`${theme.card.base} p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className={`font-semibold ${theme.text.primary}`}>{role.name}</h3>
            <p className={`text-xs font-mono ${theme.text.muted}`}>{role.code}</p>
          </div>
        </div>
        {isSystemRole && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
            System
          </span>
        )}
      </div>

      {role.description && (
        <p className={`text-sm mb-4 ${theme.text.secondary}`}>
          {role.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm mb-4">
        <div className="flex items-center gap-1">
          <Key className="h-4 w-4 text-muted-foreground" />
          <span className={theme.text.muted}>
            {role.permissions?.length || 0} permissions
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className={theme.text.muted}>
            {role._count?.users || 0} users
          </span>
        </div>
      </div>

      {canManage && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/admin/rbac/roles/${role.id}`}>
              <Edit className="h-4 w-4 mr-1" />
              Sửa
            </Link>
          </Button>
          {!isSystemRole && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
