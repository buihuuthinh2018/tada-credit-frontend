"use client";

import { useState } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { theme } from "@/lib/colors";
import {
  FileText,
  Search,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ApplicationStatus = "all" | "draft" | "pending" | "reviewing" | "approved" | "rejected" | "completed";

// Mock data - replace with actual API hook
const mockApplications = [
  {
    id: "1",
    userId: "user-1",
    userName: "Nguyễn Văn A",
    phone: "0901234567",
    serviceName: "Vay tín chấp",
    amount: 50000000,
    status: "pending",
    stage: "Hồ sơ chờ duyệt",
    ctvName: "CTV Minh",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "user-2",
    userName: "Trần Thị B",
    phone: "0912345678",
    serviceName: "Vay thế chấp",
    amount: 200000000,
    status: "reviewing",
    stage: "Thẩm định",
    ctvName: "CTV Hùng",
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    userId: "user-3",
    userName: "Lê Văn C",
    phone: "0923456789",
    serviceName: "Vay tín chấp",
    amount: 30000000,
    status: "approved",
    stage: "Hoàn tất",
    ctvName: "CTV Lan",
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    userId: "user-4",
    userName: "Phạm Thị D",
    phone: "0934567890",
    serviceName: "Vay mua xe",
    amount: 150000000,
    status: "rejected",
    stage: "Từ chối",
    ctvName: null,
    createdAt: "2024-01-12T16:45:00Z",
    rejectReason: "Không đủ điều kiện thu nhập",
  },
];

const statusConfig = {
  draft: { label: "Nháp", color: "text-gray-500 bg-gray-500/10", icon: FileText },
  pending: { label: "Chờ duyệt", color: "text-amber-500 bg-amber-500/10", icon: Clock },
  reviewing: { label: "Đang xử lý", color: "text-blue-500 bg-blue-500/10", icon: Eye },
  approved: { label: "Đã duyệt", color: "text-green-500 bg-green-500/10", icon: CheckCircle },
  rejected: { label: "Từ chối", color: "text-red-500 bg-red-500/10", icon: XCircle },
  completed: { label: "Hoàn tất", color: "text-purple-500 bg-purple-500/10", icon: CheckCircle },
};

export default function ApplicationsPage() {
  const permissions = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>("all");

  // Filter data
  const filteredData = mockApplications.filter((item) => {
    const matchSearch =
      item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm);
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = {
    total: mockApplications.length,
    pending: mockApplications.filter((a) => a.status === "pending").length,
    totalAmount: mockApplications.reduce((sum, a) => sum + a.amount, 0),
    avgAmount:
      mockApplications.reduce((sum, a) => sum + a.amount, 0) / mockApplications.length,
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
      amount
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
          Quản lý đơn vay
        </h1>
        <p className={theme.text.secondary}>
          Xem và xử lý các đơn đăng ký vay
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`${theme.card.base} p-4`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${theme.text.primary}`}>
                {stats.total}
              </p>
              <p className={`text-xs ${theme.text.muted}`}>Tổng đơn</p>
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
              <p className={`text-xs ${theme.text.muted}`}>Chờ xử lý</p>
            </div>
          </div>
        </div>

        <div className={`${theme.card.base} p-4`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className={`text-lg font-bold ${theme.text.primary}`}>
                {formatCurrency(stats.totalAmount)}
              </p>
              <p className={`text-xs ${theme.text.muted}`}>Tổng giá trị</p>
            </div>
          </div>
        </div>

        <div className={`${theme.card.base} p-4`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className={`text-lg font-bold ${theme.text.primary}`}>
                {formatCurrency(stats.avgAmount)}
              </p>
              <p className={`text-xs ${theme.text.muted}`}>TB/đơn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </Button>
          {(["pending", "reviewing", "approved", "rejected"] as const).map(
            (status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {statusConfig[status].label}
              </Button>
            )
          )}
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
                  Khách hàng
                </th>
                <th
                  className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}
                >
                  Dịch vụ
                </th>
                <th
                  className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}
                >
                  Số tiền
                </th>
                <th
                  className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}
                >
                  CTV
                </th>
                <th
                  className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}
                >
                  Trạng thái
                </th>
                <th
                  className={`text-left px-4 py-3 text-sm font-medium ${theme.text.muted}`}
                >
                  Ngày tạo
                </th>
                <th
                  className={`text-right px-4 py-3 text-sm font-medium ${theme.text.muted}`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredData.map((app) => {
                const config = statusConfig[app.status as keyof typeof statusConfig];
                return (
                  <tr key={app.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className={`font-medium ${theme.text.primary}`}>
                          {app.userName}
                        </p>
                        <p className={`text-sm ${theme.text.muted}`}>
                          {app.phone}
                        </p>
                      </div>
                    </td>
                    <td className={`px-4 py-4 ${theme.text.secondary}`}>
                      {app.serviceName}
                    </td>
                    <td className={`px-4 py-4 font-medium ${theme.text.primary}`}>
                      {formatCurrency(app.amount)}
                    </td>
                    <td className={`px-4 py-4 ${theme.text.secondary}`}>
                      {app.ctvName || (
                        <span className={theme.text.muted}>-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit",
                            config.color
                          )}
                        >
                          <config.icon className="h-3 w-3" />
                          {config.label}
                        </span>
                        <span className={`text-xs ${theme.text.muted}`}>
                          {app.stage}
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-4 text-sm ${theme.text.secondary}`}>
                      {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/admin/applications/${app.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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
