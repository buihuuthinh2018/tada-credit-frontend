"use client";

import { useState } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { theme } from "@/lib/colors";
import {
  Settings,
  Bell,
  Lock,
  Database,
  Shield,
  Globe,
  Mail,
  Key,
  Save,
  RefreshCw,
  AlertTriangle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SettingSection =
  | "general"
  | "security"
  | "notifications"
  | "system"
  | "integrations";

export default function AdminSettingsPage() {
  const permissions = usePermissions();
  const [activeSection, setActiveSection] = useState<SettingSection>("general");
  const [isSaving, setIsSaving] = useState(false);

  const sections = [
    { id: "general", label: "Cài đặt chung", icon: Settings },
    { id: "security", label: "Bảo mật", icon: Lock },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "system", label: "Hệ thống", icon: Database },
    { id: "integrations", label: "Tích hợp", icon: Globe },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Đã lưu cài đặt!");
  };

  if (!permissions.isAdmin) {
    return (
      <div className={`${theme.card.base} p-6 text-center`}>
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
          Không có quyền truy cập
        </h2>
        <p className={theme.text.secondary}>
          Chỉ Admin mới có thể truy cập trang này.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
            Cài đặt hệ thống
          </h1>
          <p className={theme.text.secondary}>
            Quản lý cấu hình và tùy chỉnh hệ thống
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Lưu thay đổi
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className={`${theme.card.base} p-2 lg:col-span-1 h-fit`}>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as SettingSection)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent/50"
                )}
              >
                <section.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className={`${theme.card.base} p-6 lg:col-span-3`}>
          {activeSection === "general" && <GeneralSettings />}
          {activeSection === "security" && <SecuritySettings />}
          {activeSection === "notifications" && <NotificationSettings />}
          {activeSection === "system" && <SystemSettings />}
          {activeSection === "integrations" && <IntegrationSettings />}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
          Cài đặt chung
        </h2>
        <p className={`text-sm ${theme.text.secondary}`}>
          Cấu hình cơ bản của hệ thống
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className={`text-sm font-medium ${theme.text.primary}`}>
            Tên hệ thống
          </label>
          <Input defaultValue="Tada Credit" placeholder="Tên hệ thống" />
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${theme.text.primary}`}>
            URL Website
          </label>
          <Input
            defaultValue="https://tadacredit.vn"
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${theme.text.primary}`}>
            Email hỗ trợ
          </label>
          <Input
            defaultValue="support@tadacredit.vn"
            placeholder="support@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${theme.text.primary}`}>
            Hotline
          </label>
          <Input defaultValue="1900 xxxx" placeholder="Số điện thoại" />
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
          Bảo mật
        </h2>
        <p className={`text-sm ${theme.text.secondary}`}>
          Cài đặt bảo mật và xác thực
        </p>
      </div>

      <div className="space-y-4">
        <ToggleSetting
          label="Bắt buộc 2FA cho Admin"
          description="Yêu cầu xác thực 2 yếu tố cho tất cả Admin"
          defaultChecked={true}
        />

        <ToggleSetting
          label="Khóa tài khoản sau 5 lần đăng nhập sai"
          description="Tự động khóa tài khoản sau 5 lần nhập sai mật khẩu"
          defaultChecked={true}
        />

        <div className="space-y-2">
          <label className={`text-sm font-medium ${theme.text.primary}`}>
            Thời gian hết hạn session (phút)
          </label>
          <Input type="number" defaultValue="60" min="5" max="1440" />
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${theme.text.primary}`}>
            Độ dài mật khẩu tối thiểu
          </label>
          <Input type="number" defaultValue="8" min="6" max="32" />
        </div>

        <ToggleSetting
          label="Yêu cầu mật khẩu mạnh"
          description="Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt"
          defaultChecked={true}
        />
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
          Thông báo
        </h2>
        <p className={`text-sm ${theme.text.secondary}`}>
          Cài đặt email và thông báo hệ thống
        </p>
      </div>

      <div className="space-y-4">
        <ToggleSetting
          label="Email đăng ký mới"
          description="Gửi thông báo khi có người dùng mới đăng ký"
          defaultChecked={true}
        />

        <ToggleSetting
          label="Email đơn vay mới"
          description="Gửi thông báo khi có đơn vay mới cần duyệt"
          defaultChecked={true}
        />

        <ToggleSetting
          label="Email KYC chờ duyệt"
          description="Gửi thông báo khi có hồ sơ KYC mới"
          defaultChecked={true}
        />

        <div className="pt-4 border-t">
          <h3 className={`text-sm font-semibold mb-3 ${theme.text.primary}`}>
            Email Admin nhận thông báo
          </h3>
          <Input
            defaultValue="admin@tadacredit.vn, manager@tadacredit.vn"
            placeholder="email1@example.com, email2@example.com"
          />
        </div>
      </div>
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
          Hệ thống
        </h2>
        <p className={`text-sm ${theme.text.secondary}`}>
          Cấu hình kỹ thuật và bảo trì
        </p>
      </div>

      <div className="space-y-4">
        <ToggleSetting
          label="Chế độ bảo trì"
          description="Tạm dừng truy cập website để bảo trì"
          defaultChecked={false}
        />

        <ToggleSetting
          label="Debug mode"
          description="Hiển thị log chi tiết (chỉ dùng cho development)"
          defaultChecked={false}
        />

        <div className="space-y-2">
          <label className={`text-sm font-medium ${theme.text.primary}`}>
            Rate limit (requests/phút)
          </label>
          <Input type="number" defaultValue="100" min="10" max="1000" />
        </div>

        <div className="pt-4 border-t">
          <h3 className={`text-sm font-semibold mb-3 ${theme.text.primary}`}>
            Cache
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Xóa cache
            </Button>
            <Button variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Rebuild index
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className={`text-sm font-semibold mb-3 ${theme.text.primary}`}>
            Backup
          </h3>
          <p className={`text-sm mb-2 ${theme.text.muted}`}>
            Backup gần nhất: 2 giờ trước
          </p>
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Backup ngay
          </Button>
        </div>
      </div>
    </div>
  );
}

function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
          Tích hợp
        </h2>
        <p className={`text-sm ${theme.text.secondary}`}>
          Cấu hình API và dịch vụ bên thứ 3
        </p>
      </div>

      <div className="space-y-4">
        <IntegrationCard
          name="SMS Gateway"
          description="Tích hợp gửi SMS OTP"
          status="connected"
        />

        <IntegrationCard
          name="Email Service"
          description="SendGrid / AWS SES"
          status="connected"
        />

        <IntegrationCard
          name="Payment Gateway"
          description="Tích hợp cổng thanh toán"
          status="pending"
        />

        <IntegrationCard
          name="KYC eKYC Service"
          description="Dịch vụ xác thực danh tính"
          status="disconnected"
        />
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className={`text-sm font-medium ${theme.text.primary}`}>{label}</p>
        <p className={`text-xs ${theme.text.muted}`}>{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted"
        )}
        title={label}
        aria-label={`Toggle ${label}: ${checked ? "enabled" : "disabled"}`}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

function IntegrationCard({
  name,
  description,
  status,
}: {
  name: string;
  description: string;
  status: "connected" | "pending" | "disconnected";
}) {
  const statusConfig = {
    connected: {
      label: "Đã kết nối",
      color: "text-green-500 bg-green-500/10",
      icon: Check,
    },
    pending: {
      label: "Đang cấu hình",
      color: "text-amber-500 bg-amber-500/10",
      icon: RefreshCw,
    },
    disconnected: {
      label: "Chưa kết nối",
      color: "text-red-500 bg-red-500/10",
      icon: AlertTriangle,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Key className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className={`font-medium ${theme.text.primary}`}>{name}</p>
          <p className={`text-xs ${theme.text.muted}`}>{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            config.color
          )}
        >
          <config.icon className="h-3 w-3" />
          {config.label}
        </span>
        <Button variant="outline" size="sm">
          Cấu hình
        </Button>
      </div>
    </div>
  );
}
