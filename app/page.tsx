"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Shield, Zap, Smartphone, Sparkles } from "lucide-react";
import { theme } from "@/lib/colors";

export default function Home() {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${theme.layout.pageGradient}`}>
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={`text-5xl font-bold ${theme.text.gradient}`}>
            TADA Credit
          </h1>
          <p className={`text-xl ${theme.text.secondary}`}>
            Nền tảng quản lý tín dụng thông minh
          </p>
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-center">
          <ThemeToggle />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button size="lg" className="shadow-lg hover:shadow-xl transition-all" asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-5 w-5" />
              Đăng nhập
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="transition-all" asChild>
            <Link href="/register">
              <UserPlus className="mr-2 h-5 w-5" />
              Đăng ký
            </Link>
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-3 mt-12">
          <div className={theme.card.glass}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
                  Bảo mật
                </h2>
              </div>
              <p className={theme.text.secondary}>
                Hệ thống bảo mật đa lớp với OTP xác thực
              </p>
            </div>
          </div>

          <div className={theme.card.glass}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-6 w-6 text-primary" />
                <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
                  Nhanh chóng
                </h2>
              </div>
              <p className={theme.text.secondary}>
                Xử lý giao dịch nhanh chóng và chính xác
              </p>
            </div>
          </div>

          <div className={theme.card.glass}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-6 w-6 text-primary" />
                <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
                  Tiện lợi
                </h2>
              </div>
              <p className={theme.text.secondary}>
                Giao diện thân thiện, dễ sử dụng trên mọi thiết bị
              </p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className={`${theme.card.base} p-6 mt-8`}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
              Tính năng nổi bật
            </h3>
          </div>
          <ul className={`space-y-3 ${theme.text.secondary}`}>
            <li className="flex items-start gap-3">
              <span className="text-lg">🌓</span>
              <span>
                <strong className={theme.text.primary}>Theme linh hoạt:</strong> Light và Dark mode tự động theo hệ thống
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">🔑</span>
              <span>
                <strong className={theme.text.primary}>Xác thực OTP:</strong> Bảo mật tối ưu với mã xác thực
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">👥</span>
              <span>
                <strong className={theme.text.primary}>Quản lý người dùng:</strong> Theo dõi và quản lý tài khoản
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">📊</span>
              <span>
                <strong className={theme.text.primary}>Dashboard trực quan:</strong> Thống kê và báo cáo chi tiết
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}