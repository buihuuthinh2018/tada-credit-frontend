# Audit Ledger & Balance Mutation – Fintech Core

## 1. Vì sao Ledger & Balance phải audit riêng?

Trong hệ thống tài chính:

- **Balance KHÔNG phải source of truth**
- **Ledger (sổ cái) mới là sự thật pháp lý**

➡️ Mọi thay đổi số dư **BẮT BUỘC** phải:

- Có ledger record  
- Có audit log  
- Không được update trực tiếp balance  

---

## 2. Nguyên tắc vàng (Golden Rules)

### Rule #1
❌ Không có ledger → ❌ không có balance change

### Rule #2
❌ Không update balance bằng `UPDATE SQL`

### Rule #3
✔ Balance = `SUM(ledger IN) - SUM(ledger OUT)`

### Rule #4
✔ Ledger là **append-only**

---

## 3. Các bảng liên quan

### 3.1 Ledger (Financial Journal)

**Table:** `ledgers`

- id  
- user_id  
- type (COMMISSION, WITHDRAW, ADJUSTMENT, REWARD)  
- direction (IN | OUT)  
- amount  
- reference_type (SERVICE_APP, WITHDRAW_REQ, ADMIN_ADJUST)  
- reference_id  
- created_at  

### 3.2 Balance Snapshot (optional)

**Table:** `balances`

- user_id (PK)  
- available_balance  
- locked_balance  
- updated_at  

> `balances` chỉ để query nhanh, **không phải legal record**.

---

## 4. Audit Ledger Event

### 4.1 Khi nào cần audit?

| Hành động | Audit | Ledger |
|----------|-------|--------|
| Snapshot commission | ✔ | ✔ |
| Approve withdrawal | ✔ | ✔ |
| Reject withdrawal | ✔ | ❌ |
| Admin adjust balance | ✔ | ✔ |
| KPI payout | ✔ | ✔ |

---

## 5. Flow chuẩn: Balance Mutation

```
Action
  ↓
Validate permission
  ↓
Create ledger record (transaction)
  ↓
Update balance snapshot
  ↓
Audit log (async)
```

---

## 6. Ledger Service (Single Entry Point)

❗ **Mọi thay đổi tiền PHẢI đi qua service này**

```ts
@Injectable()
export class LedgerService {
  async credit(params: {
    userId: string;
    amount: number;
    type: string;
    refType: string;
    refId: string;
    actorId?: string;
  }) {
    return this.createLedger({ ...params, direction: 'IN' });
  }

  async debit(params: {
    userId: string;
    amount: number;
    type: string;
    refType: string;
    refId: string;
    actorId?: string;
  }) {
    return this.createLedger({ ...params, direction: 'OUT' });
  }

  private async createLedger(data: any) {
    return this.prisma.$transaction(async (tx) => {
      const ledger = await tx.ledger.create({ data });

      await tx.balance.upsert({
        where: { user_id: data.userId },
        create: {
          user_id: data.userId,
          available_balance:
            data.direction === 'IN'
              ? data.amount
              : -data.amount,
        },
        update: {
          available_balance: {
            increment:
              data.direction === 'IN'
                ? data.amount
                : -data.amount,
          },
        },
      });

      return ledger;
    });
  }
}
```

---

## 7. Audit Ledger Mutation

### 7.1 Audit Action Codes

| Action | Ý nghĩa |
|------|--------|
| LEDGER_CREDIT | Cộng tiền |
| LEDGER_DEBIT | Trừ tiền |
| BALANCE_ADJUST | Điều chỉnh admin |

### 7.2 Audit Hook

```ts
@AuditLog({
  action: 'LEDGER_CREDIT',
  entity: 'LEDGER',
})
async snapshotCommission(...) {
  return this.ledgerService.credit({ ... });
}
```

**Audit log record:**

```json
{
  "actor_id": "admin_id",
  "action": "LEDGER_CREDIT",
  "entity": "LEDGER",
  "entity_id": "ledger_id",
  "old_value": null,
  "new_value": {
    "amount": 5000000,
    "direction": "IN"
  }
}
```

---

## 8. Withdrawal Flow (Audit-safe)

### 8.1 Approve withdrawal

```
Approve withdrawal
 → Ledger OUT (WITHDRAW)
 → Update balance
 → Audit log
```

### 8.2 Reject withdrawal

```
Reject withdrawal
 → No ledger
 → Audit only
```

---

## 9. Reconciliation & Safety

### 9.1 Recalculate balance

```sql
SELECT
  user_id,
  SUM(CASE
    WHEN direction = 'IN' THEN amount
    ELSE -amount
  END)
FROM ledgers
GROUP BY user_id;
```

So sánh kết quả với bảng `balances`.

---

## 10. Bắt buộc kiểm soát

- ❌ Không cho update/delete ledger  
- ❌ Không cho update balance thủ công  
- ✔ Chỉ service account được quyền ghi ledger  
- ✔ DB trigger / permission hardening  

---

## 11. Chuẩn Fintech / Audit Expectation

Audit team sẽ hỏi:

- Tiền từ đâu ra?  
- Ai tạo?  
- Vì sao tạo?  
- Có thể replay lịch sử không?  

➡️ **Ledger + Audit** trả lời **100% câu hỏi**.

---

## 12. Kết luận

✔ Ledger = sự thật tài chính  
✔ Balance = cache  
✔ Audit = bằng chứng pháp lý  

Ba thứ này **không được trộn vai trò**.

Thiết kế trên đáp ứng tiêu chuẩn:

- Fintech  
- Banking-lite  
- E-wallet  
- ISO / SOC / Internal Audit
