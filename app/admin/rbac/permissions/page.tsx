"use client";

import { useState } from "react";
import { usePermissionsGrouped } from "@/hooks/rbac";
import { usePermissions } from "@/hooks/use-permissions";
import { Input } from "@/components/ui/input";
import { theme } from "@/lib/colors";
import {
  Key,
  Search,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PermissionsPage() {
  const { data: groupedPermissions, isLoading, error } = usePermissionsGrouped();
  const permissions = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(["system", "auth", "user"])
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Đã copy permission code!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter permissions by search
  const filterPermissions = (perms: any[]) => {
    if (!searchTerm) return perms;
    return perms.filter(
      (p) =>
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  // Count total permissions
  const totalPermissions = groupedPermissions
    ? Object.values(groupedPermissions).reduce(
        (acc, perms) => acc + (perms as any[]).length,
        0
      )
    : 0;

  // Module display names
  const moduleNames: Record<string, string> = {
    auth: "Authentication",
    user: "User Management",
    kyc: "KYC Documents",
    service: "Services",
    finance: "Finance",
    referral: "Referral",
    system: "System Administration",
  };

  // Module icons colors
  const moduleColors: Record<string, string> = {
    auth: "text-blue-500 bg-blue-500/10",
    user: "text-green-500 bg-green-500/10",
    kyc: "text-amber-500 bg-amber-500/10",
    service: "text-purple-500 bg-purple-500/10",
    finance: "text-emerald-500 bg-emerald-500/10",
    referral: "text-pink-500 bg-pink-500/10",
    system: "text-red-500 bg-red-500/10",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
          Permissions
        </h1>
        <p className={theme.text.secondary}>
          Danh sách {totalPermissions} permissions trong hệ thống
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm permission..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Permission Groups */}
      <div className="space-y-4">
        {groupedPermissions &&
          Object.entries(groupedPermissions).map(([module, perms]) => {
            const permissions = filterPermissions(perms as any[]);
            if (permissions.length === 0) return null;

            const isExpanded = expandedModules.has(module);
            const colorClass = moduleColors[module] || "text-gray-500 bg-gray-500/10";

            return (
              <div key={module} className={`${theme.card.base} overflow-hidden`}>
                {/* Module header */}
                <div
                  className={cn(
                    "flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors",
                    isExpanded && "border-b"
                  )}
                  onClick={() => toggleModule(module)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", colorClass)}>
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${theme.text.primary}`}>
                        {moduleNames[module] || module}
                      </h3>
                      <p className={`text-sm ${theme.text.muted}`}>
                        {permissions.length} permissions
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                {/* Permissions list */}
                {isExpanded && (
                  <div className="divide-y">
                    {permissions.map((perm: any) => (
                      <div
                        key={perm.id}
                        className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <code
                              className={`text-sm font-mono px-2 py-1 rounded ${theme.text.primary} bg-muted`}
                            >
                              {perm.code}
                            </code>
                          </div>
                          {perm.description && (
                            <p className={`text-sm mt-1 ${theme.text.muted}`}>
                              {perm.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(perm.code)}
                        >
                          {copiedCode === perm.code ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Info Card */}
      <div className={`${theme.card.glass} p-6`}>
        <h3 className={`font-semibold mb-2 ${theme.text.primary}`}>
          📚 Permission Format
        </h3>
        <p className={`text-sm ${theme.text.secondary}`}>
          Permissions được đặt tên theo format:{" "}
          <code className="px-2 py-1 rounded bg-muted font-mono">
            {"<domain>.<resource>.<action>"}
          </code>
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div>
            <p className={`text-xs font-medium ${theme.text.muted}`}>Domains:</p>
            <p className={`text-sm ${theme.text.secondary}`}>
              auth, user, kyc, service, finance, referral, system
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium ${theme.text.muted}`}>Actions:</p>
            <p className={`text-sm ${theme.text.secondary}`}>
              view, create, update, delete, manage, approve, reject
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
