# Auth Service – Design Document

This document defines the **Auth Service** responsibilities, invariants, workflows, APIs, and security constraints.  
All authentication-related code **MUST** comply with this document.

---

## 1. Service Overview

**Service Name:** Auth Service

**Purpose:**

- Manage user identity lifecycle  
- Authenticate users via phone + password  
- Enforce phone verification via OTP  
- Issue and validate access tokens (JWT)  
- Assign and manage user roles (RBAC integration)  

**Primary Actors:**

- User  
- Admin  
- System (OTP / Cron)  

---

## 2. Responsibilities & Non-Responsibilities

### In Scope

- User registration  
- User login  
- Phone OTP verification  
- Password hashing & verification  
- Token issuance (JWT)  
- Default role assignment  
- Auth-related audit logging  

### Out of Scope

- KYC document validation  
- Business workflow logic  
- Ledger / financial operations  

---

## 3. Domain Ownership

| Entity      | Ownership     | Mutability |
|------------|---------------|------------|
| users      | Auth Service  | Mutable |
| sms_otps   | Auth Service  | Mutable |
| user_roles | Auth Service  | Mutable |

**Rules:**

- Auth Service **MUST NOT** mutate:
  - customer  
  - collaborator  
  - ledger entities  

---

## 4. Business Invariants

### Identity & Security

- **AUTH-INV-01:** Phone number must be unique  
- **AUTH-INV-02:** Password must be stored hashed  
- **AUTH-INV-03:** Deleted users cannot authenticate  

### OTP

- **AUTH-INV-04:** OTP must expire after configured duration  
- **AUTH-INV-05:** OTP retry count is limited  
- **AUTH-INV-06:** Verified OTP cannot be reused  

### Roles

- **AUTH-INV-07:** User must have at least one role  

---

## 5. State Machine

### OTP State Machine

```
PENDING → VERIFIED
PENDING → EXPIRED
```

**Transitions:**

- verify: `PENDING → VERIFIED`  
- expire: `PENDING → EXPIRED`  

### User Lifecycle

```
CREATED → ACTIVE → DISABLED → DELETED
```

---

## 6. API Endpoints

### Public APIs

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login |
| POST | /auth/otp/send | Send OTP |
| POST | /auth/otp/verify | Verify OTP |

### Admin APIs

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /admin/users/{id}/disable | Disable user |

---

## 7. Permission & RBAC Mapping

| Action | Permission Code | Scope |
|------|----------------|-------|
| Register | AUTH_REGISTER | GLOBAL |
| Login | AUTH_LOGIN | GLOBAL |
| Disable user | USER_DISABLE | GLOBAL |

---

## 8. Database Models

### Owned Tables

- users  
- sms_otps  
- user_roles  

### Read-only Tables

- roles  

---

## 9. Transaction & Consistency Strategy

### Atomic Operations

- User creation + role assignment  
- OTP verification  

### Eventual Consistency

- None  

---

## 10. Events & Side Effects

### Emitted Events

- USER_REGISTERED  
- USER_LOGGED_IN  

---

## 11. Error Handling

| Error Code | Description | Retryable |
|-----------|-------------|-----------|
| AUTH_001 | INVALID_CREDENTIAL | No |
| AUTH_002 | PHONE_ALREADY_EXISTS | No |
| AUTH_003 | OTP_EXPIRED | Yes |
| AUTH_004 | OTP_INVALID | No |

---

## 12. Audit & Logging

### Audit Actions

- AUTH_REGISTER  
- AUTH_LOGIN  
- AUTH_VERIFY_OTP  

### Logged Fields

- actor_id  
- phone  
- ip_address  
- user_agent  

---

## 13. Security Considerations

- Rate limit OTP send & verify  
- Hash passwords with strong algorithm  
- Protect against brute force login  
- Mask sensitive fields in logs  

---

## 14. Performance Considerations

- Index on `users.phone`  
- Index on `sms_otps.phone + expires_at`  

---

## 15. Test Strategy

### Unit Tests

- Password hashing  
- OTP verification rules  

### Integration Tests

- Register → OTP → Login  

---

## 16. Open Questions / Future Extensions

- Multi-device session support  
- Password reset flow  
- MFA extension  
