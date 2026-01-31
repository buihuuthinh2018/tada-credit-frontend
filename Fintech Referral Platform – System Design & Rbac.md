\# FINTECH REFERRAL PLATFORM

\## System Design – Use Case \& Permission Mapping



\## 1. Mục tiêu tài liệu

Tài liệu này dùng để:

\* Làm \*\*SRS / BRD / Technical Design\*\*

\* Thống nhất giữa \*\*Business – BA – Dev – Security\*\*

\* Làm nền cho \*\*RBAC, API authorization, audit \& compliance\*\*



---



\## 2. Tổng quan Actor \& Role

Một User có thể có nhiều Role cùng lúc.



\*\*Actor\*\*

\* Guest

\* User



\*\*Role (dynamic – admin có thể thêm mới)\*\*

\* Customer

\* Collaborator (CTV)

\* Supporter

\* Manager

\* Admin



---



\## 3. Danh sách Use Case chuẩn hoá



| UC Code | Use Case |

| :--- | :--- |

| UC-AUTH-01 | Register |

| UC-AUTH-02 | Verify OTP |

| UC-AUTH-03 | Login |

| UC-USER-01 | Update Profile |

| UC-USER-02 | Upload KYC Documents |

| UC-USER-03 | View Balance |

| UC-FIN-01 | Request Withdrawal |

| UC-SVC-01 | View Services |

| UC-SVC-02 | Submit Service Application |

| UC-SVC-03 | Track Application Status |

| UC-CTV-01 | Create Customer Application |

| UC-CTV-02 | View Referral Performance |

| UC-CTV-03 | View KPI \& Commission |

| UC-OPS-01 | Review Documents |

| UC-OPS-02 | Update Application Stage |

| UC-ADM-01 | Manage Users |

| UC-ADM-02 | Assign Roles |

| UC-ADM-03 | Manage Roles \& Permissions |

| UC-ADM-04 | Manage Document Types |

| UC-ADM-05 | Manage Services |

| UC-ADM-06 | Configure Service Requirements |

| UC-ADM-07 | Configure Service Workflow |

| UC-ADM-08 | Configure KPI Rules |

| UC-ADM-09 | Snapshot Monthly Commission |

| UC-ADM-10 | Approve Withdrawal Requests |

| UC-ADM-11 | View Audit Logs |



---



\## 4. Permission Design Convention



\*\*Format\*\*

`<domain>.<resource>.<action>`



\*\*Ví dụ\*\*

\* `auth.user.login`

\* `user.profile.update`

\* `service.application.create`

\* `service.application.stage.update`

\* `finance.withdraw.approve`



---



\## 5. Map Permission → Use Case



\### 5.1 Auth \& User

| Use Case | Permission Code |

| :--- | :--- |

| Register | `auth.user.register` |

| Verify OTP | `auth.user.verify\_otp` |

| Login | `auth.user.login` |

| Update Profile | `user.profile.update` |

| Upload KYC | `kyc.document.upload` |

| View Balance | `finance.balance.view` |

| Request Withdrawal | `finance.withdraw.create` |



\### 5.2 Customer

| Use Case | Permission |

| :--- | :--- |

| View Services | `service.view` |

| Submit Application | `service.application.create` |

| Track Application | `service.application.view` |



\### 5.3 Collaborator (CTV)

| Use Case | Permission |

| :--- | :--- |

| Create Customer Application | `service.application.create\_as\_ctv` |

| View Referral Performance | `referral.performance.view` |

| View KPI \& Commission | `finance.commission.view` |



\### 5.4 Supporter / Manager

| Use Case | Permission |

| :--- | :--- |

| Review Documents | `kyc.document.review` |

| Approve Document | `kyc.document.approve` |

| Reject Document | `kyc.document.reject` |

| Review Application | `service.application.review` |

| Update Application Stage | `service.application.stage.update` |



\### 5.5 Admin

| Use Case | Permission |

| :--- | :--- |

| Manage Users | `system.user.manage` |

| Assign Roles | `system.role.assign` |

| Manage Roles | `system.role.manage` |

| Manage Permissions | `system.permission.manage` |

| Manage Document Types | `kyc.document\_type.manage` |

| Manage Services | `service.manage` |

| Configure Requirements | `service.requirement.manage` |

| Configure Workflow | `service.workflow.manage` |

| Configure KPI | `finance.kpi.manage` |

| Snapshot Commission | `finance.commission.snapshot` |

| Approve Withdrawal | `finance.withdraw.approve` |

| View Audit Logs | `system.audit.view` |



---



\## 6. Default Role → Permission Set



\*\*Customer\*\*

\* `service.view`

\* `service.application.create`

\* `service.application.view`

\* `user.profile.update`

\* `kyc.document.upload`

\* `finance.balance.view`

\* `finance.withdraw.create`



\*\*Collaborator (CTV)\*\*

\* `service.view`

\* `service.application.create\_as\_ctv`

\* `service.application.view`

\* `referral.performance.view`

\* `finance.commission.view`

\* `finance.balance.view`

\* `finance.withdraw.create`



\*\*Supporter\*\*

\* `kyc.document.review`

\* `kyc.document.approve`

\* `kyc.document.reject`



\*\*Manager\*\*

\* `service.application.review`

\* `service.application.stage.update`



\*\*Admin\*\*

\* `system.user.manage`

\* `system.role.assign`

\* `system.role.manage`

\* `system.permission.manage`

\* `kyc.document\_type.manage`

\* `service.manage`

\* `service.requirement.manage`

\* `service.workflow.manage`

\* `finance.kpi.manage`

\* `finance.commission.snapshot`

\* `finance.withdraw.approve`

\* `system.audit.view`



---



\## 7. Permission Scope (Optional – nâng cao)



| Scope | Ý nghĩa |

| :--- | :--- |

| OWN | Chỉ dữ liệu của chính user |

| TEAM | Dữ liệu nhóm quản lý |

| GLOBAL | Toàn hệ thống |



---



\## 8. Nguyên tắc thiết kế (IMPORTANT)

\* Permission \*\*map theo Use Case\*\*, không map theo UI

\* Role chỉ là \*\*tập hợp permission\*\*

\* Admin có thể thêm role mới \*\*không cần sửa code\*\*

\* Tất cả hành vi nhạy cảm đều phải có \*\*Audit Log\*\*



---



\## 9. Áp dụng vào hệ thống

\* \*\*Database:\*\* `roles`, `permissions`, `role\_permissions`, `user\_roles`

\* \*\*Backend:\*\* Guard kiểm tra permission + scope

\* \*\*Frontend:\*\* Render UI dựa trên permission



---



\## 10. Phạm vi mở rộng tương lai

\* \*\*ABAC\*\* (Attribute-based Access Control)

\* Permission theo Service / Region

\* Approval Matrix (multi-step approval)



> Tài liệu này là nền tảng để triển khai hệ thống tài chính đạt chuẩn mở rộng \& compliance.

