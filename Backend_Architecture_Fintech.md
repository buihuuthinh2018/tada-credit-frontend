# Backend Architecture – Modular Design (Fintech)

## 1. Mục tiêu thiết kế

- Phù hợp hệ thống tài chính / fintech
- Audit-first, ledger-first
- RBAC động, mở rộng vai trò không cần code lại
- Workflow-driven (service, KYC, commission)
- Scale tốt cho team và sản phẩm mới

---

## 2. Nguyên tắc kiến trúc

### 2.1 Separation of Concerns

- User chỉ là identity
- Business role (Customer, CTV, Admin, Supporter…) tách module
- Không trộn logic tài chính với workflow

### 2.2 Ledger as Source of Truth

- Không update balance trực tiếp
- Mọi biến động tiền → ledger entry

### 2.3 Append-only & Audit

- Không hard delete
- Snapshot & log bất biến

---

## 3. Tổng quan module

```
apps/api
├── auth
├── users
├── rbac
├── kyc
├── documents
├── services
├── service-applications
├── commission
├── ledger
├── withdrawal
├── audit
├── system-config
├── scheduler
├── notification
└── shared
```

---

## 4. Chi tiết từng module

### 4.1 Auth Module
- Register (OTP)
- Login
- Token (JWT / Refresh)

### 4.2 Users Module
- Hồ sơ người dùng
- Trạng thái user

### 4.3 RBAC Module
- Role
- Permission
- Scope

### 4.4 KYC Module
- Upload document
- Review / approve / reject

### 4.5 Document Module
- Document type
- Service requirement

### 4.6 Services Module
- Service definition
- Stage definition

### 4.7 Service Application Module
- Hồ sơ dịch vụ
- Stage transition

### 4.8 Commission Module
- KPI config
- Snapshot

### 4.9 Ledger Module
- Ledger entry
- Balance read-model

### 4.10 Withdrawal Module
- Withdrawal request
- Approval

### 4.11 Audit Module
- Audit log

### 4.12 System Config Module
- Feature flag
- OTP config

### 4.13 Scheduler Module
- Cron job
- Retry job

### 4.14 Notification Module
- SMS OTP
- Notification

### 4.15 Shared Module
- Guards
- Interceptors
- Utils

---

## 5. Best Practices

- Không hardcode role
- Không update balance trực tiếp
- Không delete dữ liệu tài chính
- Mọi hành vi admin phải audit

---

## 6. Kết luận

Production-ready fintech backend
