"use client";

import { useState } from "react";
import { User, Mail, Phone, Shield, Edit, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/auth";
import { theme } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: currentUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    toast.success("Cập nhật thông tin thành công!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme.text.primary}`}>
            Hồ sơ cá nhân
          </h1>
          <p className={theme.text.secondary}>
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cơ bản
            </CardTitle>
            <CardDescription>
              Thông tin cá nhân của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar section */}
            <div className="flex items-center gap-4 pb-6 border-b">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {currentUser.phone?.slice(-2) || "U"}
                </span>
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
                  {currentUser.phone}
                </h3>
                <p className={`text-sm ${theme.text.muted}`}>
                  ID: {currentUser.id.slice(0, 8)}...
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
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

            {/* Form fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${theme.text.primary}`}>
                  Số điện thoại
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={currentUser.phone}
                    disabled
                    className="bg-muted/50"
                  />
                </div>
                <p className={`text-xs ${theme.text.muted}`}>
                  Số điện thoại không thể thay đổi
                </p>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${theme.text.primary}`}>
                  Trạng thái xác thực
                </label>
                <div className="flex items-center gap-2 h-10">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                      currentUser.phone_verified
                        ? "bg-green-500/10 text-green-500"
                        : "bg-amber-500/10 text-amber-500"
                    )}
                  >
                    {currentUser.phone_verified ? "✓ Đã xác thực" : "Chưa xác thực"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${theme.text.primary}`}>
                  Họ và tên
                </label>
                <Input
                  placeholder="Nhập họ và tên"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${theme.text.primary}`}>
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Bảo mật
              </CardTitle>
              <CardDescription>
                Cài đặt bảo mật tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme.text.primary}`}>
                    Trạng thái tài khoản
                  </span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      currentUser.status === "ACTIVE"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-amber-500/10 text-amber-500"
                    )}
                  >
                    {currentUser.status}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <Button variant="outline" className="w-full" disabled>
                  Đổi mật khẩu
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Bật xác thực 2 yếu tố
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Thông tin tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className={theme.text.muted}>Ngày tạo</span>
                <span className={theme.text.primary}>
                  {new Date(currentUser.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={theme.text.muted}>KYC</span>
                <span className={theme.text.primary}>
                  {currentUser.customer?.kyc_status || "Chưa xác thực"}
                </span>
              </div>
              {currentUser.collaborator && (
                <div className="flex justify-between text-sm">
                  <span className={theme.text.muted}>Mã giới thiệu</span>
                  <span className={`font-mono ${theme.text.primary}`}>
                    {currentUser.collaborator.referral_code}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
