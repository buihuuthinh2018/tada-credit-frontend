"use client";

import { useState } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { theme } from "@/lib/colors";
import {
  CreditCard,
  Search,
  FileCheck,
  FileX,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type KYCStatus = "all" | "pending" | "approved" | "rejected";

// Mock data - replace with actual API hook
const mockKYCList = [
  {
    id: "1",
    userId: "user-1",
    userName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    documentType: "CCCD/CMND",
    status: "pending",
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "user-2",
    userName: "Trần Thị B",
    email: "tranthib@email.com",
    documentType: "Giấy phép kinh doanh",
    status: "approved",
    submittedAt: "2024-01-14T14:20:00Z",
    reviewedAt: "2024-01-14T16:45:00Z",
    reviewedBy: "Admin",
  },
  {
    id: "3",
    userId: "user-3",
    userName: "Lê Văn C",
    email: "levanc@email.com",
    documentType: "CCCD/CMND",
    status: "rejected",
    submittedAt: "2024-01-13T09:15:00Z",
    reviewedAt: "2024-01-13T11:30:00Z",
    reviewedBy: "Manager",
    rejectReason: "Ảnh mờ, không đọc được thông tin",
  },
];

const statusConfig = {
  pending: {
    label: "Chờ duyệt",
    color: "text-amber-500 bg-amber-500/10",
    icon: Clock,
  },
  approved: {
    label: "Đã duyệt",
    color: "text-green-500 bg-green-500/10",
    icon: CheckCircle,
  },
  rejected: {
    label: "Từ chối",
    color: "text-red-500 bg-red-500/10",
    icon: XCircle,
  },
};

export default function KYCPage() {
  const permissions = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<KYCStatus>("all");
  const [page, setPage] = useState(1);

  // Filter data
  const filteredData = mockKYCList.filter((item) => {
    const matchSearch =
      item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = {
    total: mockKYCList.length,
    pending: mockKYCList.filter((k) => k.status === "pending").length,
    approved: mockKYCList.filter((k) => k.status === "approved").length,
    rejected: mockKYCList.filter((k) => k.status === "rejected").length,
  };

  if (!permissions.canViewKYC) {
    return (
      <div className={`${theme.card.base} p-6 text-center`}>
        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
          Không có quyền truy cập
        </h2>
        <p className={theme.text.secondary}>
          Bạn không có quyền xem trang này.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
          Quản lý KYC
        </h1>
        <p className={theme.text.secondary}>
          Xem và duyệt hồ sơ KYC của người dùng
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`${theme.card.base} p-4`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${theme.text.primary}`}>
                {stats.total}
              </p>
              <p className={`text-xs ${theme.text.muted}`}>Tổng hồ sơ</p>
            </div>
          </div>
        </div>

        <div className={`${theme.card.base} p-4`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${theme.text.primary}`}>
                {stats.pending}
              </p>
              <p className={`text-xs ${theme.text.muted}`}>Chờ duyệt</p>
            </div>
          </div>
        </div>

        <div className={`${theme.card.base} p-4`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <FileCheck className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${theme.text.primary}`}>
                {stats.approved}
              </p>
              <p className={`text-xs ${theme.text.muted}`}>Đã duyệt</p>
            </div>
          </div>
        </div>

        <div className={`${theme.card.base} p-4`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <FileX className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${theme.text.primary}`}>
                {stats.rejected}
              </p>
              <p className={`text-xs ${theme.text.muted}`}>Từ chối</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "Tất cả" : statusConfig[status].label}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`${theme.card.base} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th
                  className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}
                >
                  Người dùng
                </th>
                <th
                  className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}
                >
                  Loại giấy tờ
                </th>
                <th
                  className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}
                >
                  Trạng thái
                </th>
                <th
                  className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}
                >
                  Ngày gửi
                </th>
                <th
                  className={`text-right px-4 py-3 text-sm font-medium ${theme.text.muted}`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredData.map((kyc) => {
                const config = statusConfig[kyc.status as keyof typeof statusConfig];
                return (
                  <tr key={kyc.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className={`font-medium ${theme.text.primary}`}>
                          {kyc.userName}
                        </p>
                        <p className={`text-sm ${theme.text.muted}`}>
                          {kyc.email}
                        </p>
                      </div>
                    </td>
                    <td className={`px-4 py-4 ${theme.text.secondary}`}>
                      {kyc.documentType}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          config.color
                        )}
                      >
                        <config.icon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </td>
                    <td className={`px-4 py-4 text-sm ${theme.text.secondary}`}>
                      {new Date(kyc.submittedAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/kyc/${kyc.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {kyc.status === "pending" && permissions.canApproveKYC && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-500 hover:text-green-600"
                              title="Phê duyệt"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              title="Từ chối"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className={`text-sm ${theme.text.muted}`}>
            Hiển thị {filteredData.length} kết quả
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
