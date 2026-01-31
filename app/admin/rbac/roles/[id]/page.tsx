"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  useRole,
  useUpdateRole,
  usePermissionsGrouped,
  useAssignPermissionsToRole,
} from "@/hooks/rbac";
import { usePermissions as useUserPermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { theme } from "@/lib/colors";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertTriangle,
  Shield,
  Check,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditRolePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const userPermissions = useUserPermissions();

  const { data: role, isLoading: roleLoading, error: roleError } = useRole(id);
  const { data: groupedPermissions, isLoading: permLoading } = usePermissionsGrouped();
  const updateRoleMutation = useUpdateRole();
  const assignPermissionsMutation = useAssignPermissionsToRole();

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Initialize form data when role loads
  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || "",
      });
      // Set selected permissions from role
      const permIds = new Set(
        role.permissions?.map((rp) => rp.permission.id.toString()) || []
      );
      setSelectedPermissions(permIds);
    }
  }, [role]);

  const handleSave = async () => {
    // Update role info
    await updateRoleMutation.mutateAsync({
      id,
      data: {
        name: formData.name,
        description: formData.description || undefined,
      },
    });

    // Update permissions
    await assignPermissionsMutation.mutateAsync({
      roleId: id,
      data: {
        permissionIds: Array.from(selectedPermissions).map(Number),
      },
    });
  };

  const toggleModule = (module: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(module)) {
        next.delete(module);
      } else {
        next.add(module);
      }
      return next;
    });
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) {
        next.delete(permId);
      } else {
        next.add(permId);
      }
      return next;
    });
  };

  const toggleAllInModule = (module: string, permissions: any[]) => {
    const allSelected = permissions.every((p) =>
      selectedPermissions.has(p.id.toString())
    );

    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      permissions.forEach((p) => {
        if (allSelected) {
          next.delete(p.id.toString());
        } else {
          next.add(p.id.toString());
        }
      });
      return next;
    });
  };

  if (roleLoading || permLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (roleError || !role) {
    return (
      <div className={`${theme.card.base} p-6 text-center`}>
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
          Role không tồn tại
        </h2>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/rbac/roles">Quay lại</Link>
        </Button>
      </div>
    );
  }

  const isSystemRole = ["USER", "CUSTOMER", "CTV", "SUPPORTER", "MANAGER", "ADMIN"].includes(
    role.code
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/rbac/roles">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
            Chỉnh sửa Role
          </h1>
          <p className={theme.text.secondary}>
            {role.code} - {role.name}
          </p>
        </div>
        {userPermissions.canManageRoles && (
          <Button
            onClick={handleSave}
            disabled={updateRoleMutation.isPending || assignPermissionsMutation.isPending}
          >
            {(updateRoleMutation.isPending || assignPermissionsMutation.isPending) && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            <Save className="h-4 w-4 mr-2" />
            Lưu thay đổi
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Role Info */}
        <div className={`${theme.card.base} p-6`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
                Thông tin Role
              </h2>
              {isSystemRole && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                  System Role
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`text-sm font-medium ${theme.text.primary}`}>
                Role Code
              </label>
              <Input value={role.code} disabled className="bg-muted" />
              <p className={`text-xs mt-1 ${theme.text.muted}`}>
                Không thể thay đổi code
              </p>
            </div>

            <div>
              <label className={`text-sm font-medium ${theme.text.primary}`}>
                Tên hiển thị
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!userPermissions.canManageRoles}
              />
            </div>

            <div>
              <label className={`text-sm font-medium ${theme.text.primary}`}>
                Mô tả
              </label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả role..."
                disabled={!userPermissions.canManageRoles}
              />
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className={`${theme.card.base} p-6 lg:col-span-2`}>
          <h2 className={`text-lg font-semibold mb-4 ${theme.text.primary}`}>
            Permissions ({selectedPermissions.size} đã chọn)
          </h2>

          <div className="space-y-2 max-h-150 overflow-y-auto">
            {groupedPermissions &&
              Object.entries(groupedPermissions).map(([module, perms]) => {
                const permissions = perms as any[];
                const isExpanded = expandedModules.has(module);
                const selectedInModule = permissions.filter((p) =>
                  selectedPermissions.has(p.id.toString())
                ).length;
                const allSelected = selectedInModule === permissions.length;

                return (
                  <div key={module} className="border rounded-lg">
                    {/* Module header */}
                    <div
                      className={cn(
                        "flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50",
                        isExpanded && "border-b"
                      )}
                      onClick={() => toggleModule(module)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className={`font-medium capitalize ${theme.text.primary}`}>
                          {module}
                        </span>
                        <span className={`text-xs ${theme.text.muted}`}>
                          ({selectedInModule}/{permissions.length})
                        </span>
                      </div>
                      {userPermissions.canManagePermissions && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAllInModule(module, permissions);
                          }}
                        >
                          {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                        </Button>
                      )}
                    </div>

                    {/* Permissions list */}
                    {isExpanded && (
                      <div className="p-3 space-y-2">
                        {permissions.map((perm: any) => {
                          const isSelected = selectedPermissions.has(
                            perm.id.toString()
                          );

                          return (
                            <label
                              key={perm.id}
                              className={cn(
                                "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                                isSelected
                                  ? "bg-primary/10"
                                  : "hover:bg-accent/50",
                                !userPermissions.canManagePermissions &&
                                  "cursor-default"
                              )}
                            >
                              <div
                                className={cn(
                                  "h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "border-muted-foreground/30"
                                )}
                                onClick={() => {
                                  if (userPermissions.canManagePermissions) {
                                    togglePermission(perm.id.toString());
                                  }
                                }}
                              >
                                {isSelected && (
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-mono ${theme.text.primary}`}
                                >
                                  {perm.code}
                                </p>
                                {perm.description && (
                                  <p className={`text-xs ${theme.text.muted}`}>
                                    {perm.description}
                                  </p>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
