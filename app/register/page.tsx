"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Phone, Lock, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useRegister, useSendOTP, useVerifyOTP } from "@/hooks/auth";
import { RegisterRequest, SendOTPRequest, VerifyOTPRequest } from "@/types/api";
import { theme } from "@/lib/colors";

type Step = "register" | "verify-otp";

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("register");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const registerMutation = useRegister();
  const sendOTPMutation = useSendOTP();
  const verifyOTPMutation = useVerifyOTP();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const onRegisterSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerPayload } = data;
    setPhoneNumber(data.phone);

    try {
      // Bước 1: Call API register
      await registerMutation.mutateAsync(registerPayload);
      
      // Bước 2: Sau khi register thành công, gửi OTP
      const otpRequest: SendOTPRequest = {
        phone: data.phone,
        purpose: "REGISTER",
      };
      await sendOTPMutation.mutateAsync(otpRequest);
      
      // Chuyển sang step verify OTP
      setStep("verify-otp");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onVerifyOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otpCode = formData.get("otp") as string;

    if (!otpCode || otpCode.length !== 6) {
      return;
    }

    try {
      // Bước 3: Verify OTP
      const verifyRequest: VerifyOTPRequest = {
        phone: phoneNumber,
        code: otpCode,
        purpose: "REGISTER",
      };
      await verifyOTPMutation.mutateAsync(verifyRequest);

      // Bước 4: Sau khi verify thành công, chuyển sang trang login
      router.push("/login");
    } catch (error) {
      // Error handled by mutations
    }
  };

  const resendOTP = async () => {
    const otpRequest: SendOTPRequest = {
      phone: phoneNumber,
      purpose: "REGISTER",
    };
    await sendOTPMutation.mutateAsync(otpRequest);
  };

  if (step === "verify-otp") {
    return (
      <div className={`${theme.layout.center} p-4 ${theme.layout.pageGradient}`}>
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Xác thực OTP
            </CardTitle>
            <CardDescription className="text-center">
              Nhập mã OTP đã được gửi đến số điện thoại {phoneNumber}
            </CardDescription>
          </CardHeader>

          <form onSubmit={onVerifyOTPSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Mã OTP (6 số)</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="text-center text-2xl tracking-widest"
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={sendOTPMutation.isPending}
                  className="text-sm text-primary hover:text-primary/80 hover:underline disabled:opacity-50 transition-colors"
                >
                  {sendOTPMutation.isPending ? "Đang gửi..." : "Gửi lại OTP"}
                </button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={verifyOTPMutation.isPending}
              >
                {verifyOTPMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  "Xác thực OTP"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep("register")}
              >
                Quay lại
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${theme.layout.center} p-4 ${theme.layout.pageGradient}`}>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Đăng ký tài khoản
          </CardTitle>
          <CardDescription className="text-center">
            Tạo tài khoản mới để bắt đầu sử dụng TADA Credit
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onRegisterSubmit)}>
          <CardContent className="space-y-4">
            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0912345678"
                  className="pl-10"
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                    pattern: {
                      value: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu",
                    minLength: {
                      value: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự",
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
                      message: "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: (value) =>
                      value === password || "Mật khẩu không khớp",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Referral Code Input (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="referralCode">
                Mã giới thiệu (tùy chọn)
              </Label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="REF123456"
                  className="pl-10"
                  {...register("referralCode")}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending || sendOTPMutation.isPending}
            >
              {registerMutation.isPending || sendOTPMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {registerMutation.isPending ? "Đang đăng ký..." : "Đang gửi OTP..."}
                </>
              ) : (
                "Đăng ký"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Đăng nhập
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
