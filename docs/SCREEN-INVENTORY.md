# Screen Inventory — Aheers Group Enterprise

**Parent:** [ENTERPRISE-SPECIFICATION.md](./ENTERPRISE-SPECIFICATION.md)  
**Format per screen:** Purpose · Roles · Key fields/actions · APIs · Tables

---

## A. Customer Super App (Web / iOS / Android / PWA)

### A1. Onboarding

| ID | Screen | Purpose | Roles | Permissions |
|----|--------|---------|-------|-------------|
| C-001 | Splash | Brand, promos, load config | Public | — |
| C-002 | Welcome carousel | Rewards benefits | Public | — |
| C-003 | Register | Create account | Public | `auth.register` |
| C-004 | Login (email/phone) | Authenticate | Public | `auth.login` |
| C-005 | OTP verify | Phone verification | Public | `auth.otp` |
| C-006 | Social login | OAuth | Public | `auth.oauth` |
| C-007 | Biometric setup | Enable Face/Touch ID | Customer | `auth.biometric` |
| C-008 | Forgot password | Recovery | Public | `auth.recover` |
| C-009 | Link rewards card | Infinity card bind | Customer | `rewards.link` |
| C-010 | Device management | Sessions | Customer | `auth.devices` |

### A2. Home & stores

| ID | Screen | Purpose | Roles |
|----|--------|---------|-------|
| C-020 | Home dashboard | Rewards, wallet, promos, reorder | Customer |
| C-021 | Store selector | Pick store tenant | Customer |
| C-022 | Store switch warning modal | Cart clear confirm | Customer |
| C-023 | Notifications inbox | Order/promo alerts | Customer |
| C-024 | Digital rewards card | QR/barcode display | Customer |

### A3. Catalog & search

| ID | Screen | Purpose |
|----|--------|---------|
| C-030 | Category tree | Browse departments |
| C-031 | Product list | Filter/sort |
| C-032 | Product detail | Gallery, specs, member price, earn preview |
| C-033 | Search results | Keyword + filters |
| C-034 | Barcode scanner | Scan to product |
| C-035 | Voice search | Speech-to-text query |

### A4. Cart & checkout

| ID | Screen | Purpose |
|----|--------|---------|
| C-040 | Cart | Single-store basket, savings |
| C-041 | Apply coupon / gift card | Discounts |
| C-042 | Redeem points/cashback | Loyalty |
| C-043 | Checkout — fulfilment | Delivery/pickup/curbside/slot |
| C-044 | Checkout — payment | Split tender |
| C-045 | Order confirmation | Summary + tracking link |

### A5. Orders & delivery (customer fulfilment)

| ID | Screen | Purpose |
|----|--------|---------|
| C-050 | My orders | History |
| C-051 | Order detail | Lines, status timeline |
| C-052 | **My deliveries** | Upcoming/in-progress/completed |
| C-053 | **Live delivery map** | Driver GPS, ETA |
| C-054 | Delivery chat | Masked driver message |
| C-055 | Rate delivery | Stars + feedback |
| C-056 | Return request | RMA workflow |
| C-057 | Invoice download | PDF |

### A6. Account

| ID | Screen | Purpose |
|----|--------|---------|
| C-060 | Profile | Personal info |
| C-061 | Addresses | Saved locations |
| C-062 | Payment methods | Tokenized cards |
| C-063 | Rewards history | Points/cashback ledger |
| C-064 | Wallet | Top-up, balance |
| C-065 | Wishlist | Saved products |
| C-066 | Support center | Ticket categories |
| C-067 | Marketing preferences | POPIA consent |

---

## B. Wholesale portal (PowerTrade)

| ID | Screen | Purpose | Roles |
|----|--------|---------|-------|
| W-001 | Trade register | Business onboarding | Prospect |
| W-002 | VAT verification | Document upload | Prospect |
| W-003 | Trade dashboard | Credit, statements | Trade customer |
| W-004 | Bulk catalog | Case/pallet pricing | Trade customer |
| W-005 | RFQ builder | Quote request | Trade customer |
| W-006 | Quote review | Accept/decline | Trade customer |
| W-007 | Bulk checkout | Truck scheduling | Trade customer |
| W-008 | Delivery documents | POD, invoices | Trade customer |

---

## C. Contractor portal (Hardware)

| ID | Screen | Purpose |
|----|--------|---------|
| H-001 | Contractor register | Business verify |
| H-002 | Project quote request | Materials list |
| H-003 | Contractor catalog | Bulk/contractor pricing |
| H-004 | Heavy delivery schedule | Vehicle/lift booking |

---

## D. Employee & operations (Aheers Admin)

### D1. Dashboards (role-specific)

| ID | Screen | Roles |
|----|--------|-------|
| E-001 | CEO dashboard | CEO, Executive |
| E-002 | Regional dashboard | Regional Manager |
| E-003 | Store dashboard | Store Manager |
| E-004 | CRM dashboard | CRM Manager |
| E-005 | Marketing dashboard | Marketing Manager |
| E-006 | Finance dashboard | Finance Manager |
| E-007 | Warehouse dashboard | Warehouse Manager |

### D2. CRM & service counter

| ID | Screen | Purpose |
|----|--------|---------|
| E-020 | Customer 360 | Full profile |
| E-021 | **Service counter** | Phone/WhatsApp order on behalf |
| E-022 | Ticket inbox | Support queue |
| E-023 | Ticket detail | SLA, messages |
| E-024 | Lead pipeline | Sales CRM |
| E-025 | Segments | Marketing lists |

### D3. Inventory & WMS

| ID | Screen | Purpose |
|----|--------|---------|
| E-030 | Stock overview | Multi-store |
| E-031 | Pick queue | Assign pickers |
| E-032 | Pick task | Barcode scan pick |
| E-033 | Pack station | QC + label |
| E-034 | Transfer request | Store ↔ warehouse |
| E-035 | Stock count | Cycle count |
| E-036 | PO management | Procurement |

### D4. Promotions & marketing

| ID | Screen | Purpose |
|----|--------|---------|
| E-040 | Promotion builder | Rules engine |
| E-041 | Campaign manager | SMS/email/WhatsApp |
| E-042 | Competition admin | Lucky draws |

---

## E. Driver app (mobile)

| ID | Screen | Purpose |
|----|--------|---------|
| D-001 | Driver login | Auth |
| D-002 | Driver dashboard | Today's route |
| D-003 | Route map | Navigation |
| D-004 | Stop detail | Customer, items, notes |
| D-005 | POD capture | Signature + photo + GPS |
| D-006 | Failed delivery | Reason + evidence |
| D-007 | Vehicle inspection | Pre-trip checklist |
| D-008 | Fuel log | Entry |

---

## F. Dispatcher portal

| ID | Screen | Purpose |
|----|--------|---------|
| F-001 | Dispatch board | Live map + queues |
| F-002 | Assign driver | Manual/auto |
| F-003 | Route optimizer | Batch assign |
| F-004 | Late deliveries | Alerts |
| F-005 | Driver comms | Messages |

---

## G. POS (terminal UI)

| ID | Screen | Purpose |
|----|--------|---------|
| P-001 | POS login | Cashier shift |
| P-002 | Sale basket | Scan/search |
| P-003 | Customer attach | Rewards lookup |
| P-004 | Payment | Multi-tender |
| P-005 | Receipt | Print/digital |
| P-006 | Return/refund | Approval trigger |
| P-007 | Shift close | Cash up |

---

## H. Settings (admin)

| ID | Module | Screens |
|----|--------|---------|
| S-001 | Company | Org, branches, stores |
| S-002 | Store | Hours, zones, min order, tax |
| S-003 | Rewards | Points/cashback/tier rules |
| S-004 | Ecommerce | Shipping, returns, checkout |
| S-005 | CRM | Pipelines, segments |
| S-006 | Fleet | Vehicles, maintenance rules |
| S-007 | Inventory | Reorder, transfer rules |

---

## Screen count summary

| Portal | Screens (estimated) |
|--------|----------------------|
| Customer Super App | 67 |
| Wholesale | 8 |
| Contractor | 4 |
| Employee / Nexus | 45 |
| Driver | 8 |
| Dispatcher | 5 |
| POS | 7 |
| Settings | 25+ |
| **Total** | **~169 core** (+ reports, variants) |

---

## Layout breakpoints

| Breakpoint | Customer | Admin | Driver |
|------------|----------|-------|--------|
| Mobile | Primary | Limited | Primary |
| Tablet | Full | Warehouse/POS | Full |
| Desktop | Full | Primary | — |

---

*Screen Inventory v2.0 — each screen expands to FRS detail during sprint grooming*
