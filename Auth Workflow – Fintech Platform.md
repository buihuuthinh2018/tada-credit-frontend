\# Auth Workflow – Fintech Platform



\## 1. Mục tiêu

Thiết kế workflow Auth cho hệ thống fintech với các yêu cầu:

\* Đăng ký bằng phone + password

\* Xác thực OTP qua SMS (có thể bật/tắt bởi Admin)

\* Hỗ trợ referral khi đăng ký

\* Đa role (User / Customer / CTV / Admin / Supporter…)

\* RBAC-first

\* Audit-first

\* Bảo mật chuẩn ứng dụng tài chính



---



\## 2. Actors



| Actor | Mô tả |

| :--- | :--- |

| Guest | Người chưa đăng nhập |

| User | Người dùng đã đăng ký |

| Admin | Quản trị hệ thống |

| System | Auth / OTP engine |





---



\## 3. Workflow Đăng ký (Register)



\### 3.1 Sơ đồ tổng quát

```text

Guest  

&nbsp; ↓

Nhập phone + password (+ referral\_code?)  

&nbsp; ↓

Validate input  

&nbsp; ↓

Check phone tồn tại?

&nbsp; ↓

(Admin config: require OTP?)  

&nbsp; ├─ NO → Tạo user  

&nbsp; └─ YES      

&nbsp;     ↓   

&nbsp;     Gửi SMS OTP      

&nbsp;     ↓   

&nbsp;     Verify OTP      

&nbsp;     ↓   

&nbsp;     Tạo user

