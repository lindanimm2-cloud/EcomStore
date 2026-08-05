# RBAC & Permission Matrix — Aheers Group Enterprise

**Parent:** [ENTERPRISE-SPECIFICATION.md](./ENTERPRISE-SPECIFICATION.md)

---

## 1. Role hierarchy

```
CEO (super_admin)
├── Executive (exec)
│   ├── Regional Manager (regional_manager)
│   │   ├── Store Manager (store_manager)
│   │   │   ├── Department Manager (dept_manager)
│   │   │   │   ├── Supervisor (supervisor)
│   │   │   │   │   ├── Cashier (cashier)
│   │   │   │   │   ├── Floor Staff (floor_staff)
│   │   │   │   │   └── Service Counter (service_counter)
│   │   │   ├── Marketing Manager (marketing_manager)
│   │   │   └── Inventory Manager (inventory_manager)
│   │   └── Warehouse Manager (warehouse_manager)
│   │       ├── Receiving Clerk (receiving_clerk)
│   │       ├── Picker (picker)
│   │       ├── Packer (packer)
│   │       ├── Loader (loader)
│   │       └── Inventory Controller (inventory_controller)
│   ├── Fleet Manager (fleet_manager)
│   │   ├── Dispatcher (dispatcher)
│   │   └── Driver (driver)
│   ├── CRM Manager (crm_manager)
│   │   └── Support Agent (support_agent)
│   ├── Finance Manager (finance_manager)
│   ├── Procurement Manager (procurement_manager)
│   ├── HR Manager (hr_manager)
│   └── Wholesale Manager (wholesale_manager)
└── Contractor Manager (contractor_manager) — hardware B2B
```

**External portals (not employee hierarchy):** `customer`, `trade_customer`, `contractor_customer`, `supplier`.

---

## 2. Scope dimensions

Every permission is evaluated against:

| Dimension | Example |
|-----------|---------|
| `org_id` | Aheers Group |
| `store_id` | Greytown Supermarket only |
| `warehouse_id` | Central DC |
| `department` | Deli, Hardware, Wholesale |
| `action` | `read`, `create`, `update`, `delete`, `approve` |
| `resource` | `order`, `inventory`, `promotion`, `employee` |

---

## 3. Permission matrix (abbreviated — full: 400+ granular keys)

Legend: ✅ full · 👁 read · ✏️ create/edit · ✅✓ approve · ❌ none

### 3.1 Customer & commerce

| Resource | Customer | Cashier | Service Counter | Store Mgr | Marketing | CRM Agent | Executive |
|----------|----------|---------|-----------------|-----------|-----------|-----------|-----------|
| Own profile | ✅ | 👁 own | 👁 | 👁 all store | ❌ | 👁 | 👁 |
| Place order (app) | ✅ | ❌ | ✏️ on behalf | 👁 | ❌ | ✏️ | 👁 |
| Apply rewards | ✅ | ✏️ | ✏️ | ✏️ | ❌ | ✏️ | 👁 |
| Refund | ❌ | ✏️ ≤R500 | ✏️ | ✅✓ | ❌ | ✏️ | ✅✓ |
| Promotions create | ❌ | ❌ | ❌ | ✏️ | ✅ | ❌ | ✅✓ |
| Coupons issue | ❌ | ❌ | ❌ | ✏️ | ✅ | ✏️ | 👁 |

### 3.2 Inventory & warehouse

| Resource | Picker | Packer | WH Manager | Store Mgr | Inventory Mgr | Finance |
|----------|--------|--------|------------|-----------|---------------|---------|
| Pick queue | 👁 assigned | ❌ | 👁 all | 👁 | 👁 | ❌ |
| Stock adjust | ❌ | ❌ | ✏️ | ✅✓ | ✅ | 👁 |
| Write-off | ❌ | ❌ | ✏️ | ✅✓ | ✅✓ | ✅✓ |
| PO create | ❌ | ❌ | ✏️ | ✏️ | ✅ | ✅✓ |
| Supplier pay | ❌ | ❌ | ❌ | ❌ | ✏️ | ✅✓ |

### 3.3 Fleet & delivery

| Resource | Driver | Dispatcher | Fleet Mgr | Store Mgr | Customer |
|----------|--------|------------|-----------|-----------|----------|
| Own route | ✅ | 👁 | 👁 | 👁 | ❌ |
| Assign driver | ❌ | ✅ | ✅ | ✏️ | ❌ |
| Live GPS all | ❌ | ✅ | ✅ | 👁 | 👁 own order |
| POD capture | ✅ | ❌ | 👁 | 👁 | 👁 |
| Failed delivery | ✅ | ✏️ | ✏️ | 👁 | ✏️ request |

### 3.4 CRM & support

| Resource | Support Agent | CRM Mgr | Marketing | Store Mgr | Executive |
|----------|---------------|---------|-----------|-----------|-----------|
| Customer 360 | 👁 | ✅ | 👁 segment | 👁 store | ✅ |
| Tickets | ✏️ | ✅ | ❌ | 👁 | 👁 |
| Campaigns | ❌ | ✏️ | ✅ | ❌ | ✅✓ |
| Segments | ❌ | ✅ | ✅ | ❌ | 👁 |
| WhatsApp outbound | ✏️ | ✅ | ✅ | ❌ | ❌ |

### 3.5 HR & finance

| Resource | Staff | Supervisor | HR Mgr | Finance | CEO |
|----------|-------|------------|----------|---------|-----|
| Own attendance | ✅ | 👁 team | 👁 | ❌ | 👁 |
| Leave request | ✅ | ✅✓ | ✅✓ | 👁 | 👁 |
| Payroll | ❌ | ❌ | ✏️ | ✅ | ✅✓ |
| Executive reports | ❌ | ❌ | ❌ | ✅ | ✅ |
| Audit logs | ❌ | ❌ | 👁 | 👁 | ✅ |

---

## 4. Internal communication matrix

| From → To | Allowed | Escalation |
|-----------|---------|------------|
| Cashier → CEO | ❌ | Via chain |
| Cashier → Supervisor | ✅ | — |
| Supervisor → Store Manager | ✅ | — |
| Driver → Customer | ✅ masked app only | — |
| Driver → Dispatcher | ✅ | — |
| Marketing → Store Manager | ✅ | — |
| Warehouse → Store floor | ❌ direct | Via managers |

---

## 5. Approval thresholds (ZAR — configurable)

| Action | Auto-approve | Manager | Regional | Executive |
|--------|--------------|---------|----------|-----------|
| Refund | ≤ R200 | ≤ R2,000 | ≤ R10,000 | > R10,000 |
| Discount % | ≤ 5% | ≤ 15% | ≤ 25% | > 25% |
| Stock write-off | ≤ R500 | ≤ R5,000 | ≤ R25,000 | > R25,000 |
| PO value | ≤ R5,000 | ≤ R50,000 | ≤ R250,000 | > R250,000 |
| Capex | — | — | ≤ R100k | > R100k |

---

## 6. Audit requirements

Every mutation logs: `actor_id`, `action`, `entity`, `entity_id`, `before`, `after`, `ip`, `device`, `store_id`, `reason`, `approval_id` (if applicable).

**Immutable** audit store — no delete; CEO + compliance read-only export.

---

## 7. Portal → role mapping

| Portal | Required roles |
|--------|----------------|
| `/login` | `customer` |
| `/staff/login` | any `employee.*` |
| `/driver/login` | `driver` |
| `/dispatch/login` | `dispatcher`, `fleet_manager` |
| `/counter` | `service_counter`, `cashier` |
| `/trade/login` | `trade_customer` |
| `/contractor/login` | `contractor_customer` |
| `/supplier/login` | `supplier` |
| `/admin` | `store_manager`+ (module-scoped) |

---

*RBAC v2.0 — implement as NestJS guards + PostgreSQL RLS policies*
