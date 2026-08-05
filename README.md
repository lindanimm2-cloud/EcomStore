# Aheers Group — Multi-business Super App (Pitch Demo)

Frontend demo of the Aheers Super App: storefront, Infinity Rewards, CRM/ops hub, fleet, driver app, and trade portal. Mock data + `localStorage` (no real backend).

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

## Demo logins (password `aheers123` · OTP `123456`)

| Portal | Email | Notes |
|--------|-------|--------|
| Customer | `lucrisha.p@gmail.com` | VIP · phone `0834567890` for OTP |
| Customer | `hayley.h@email.co.za` | Retail |
| Staff / CEO | `sagren@aheers.co.za` | Full ops hub |
| CRM | `crm@aheers.co.za` | Staff |
| Counter | `counter@aheers.co.za` | Service desk |
| Driver | `thabo.driver@aheers.co.za` | Driver app |
| Dispatcher | `dispatch@aheers.co.za` | Fleet + can open driver app |
| Trade | `orders@greytownspaza.co.za` | PowerTrade B2B |

**Pitch path (safe):** Lucrisha (shop → portal) → Sagren on desktop/tablet (ops) → Thabo (driver) → Greytown Spaza (trade).

## Host on GitHub (recommended for the pitch)

### Option A — GitHub + Vercel (best for Next.js, free)

1. Create a GitHub repo and push this `aheers-demo` folder.
2. Go to [vercel.com](https://vercel.com) → Import the repo → Deploy.
3. Share the `*.vercel.app` URL in the meeting.

No config changes needed. This is the smoothest live demo.

### Option B — GitHub Pages (static export)

```bash
npm run build:static
```

Upload the `out/` folder to GitHub Pages (or use Actions). Client-side routing needs a 404 → `index.html` fallback for deep links; Vercel is simpler if you hit SPA routing issues.

## Build check

```bash
npm run build
npm start
```

## What to show

| Surface | URL |
|---------|-----|
| Storefront | `/` · `/store/supermarket` |
| Rewards / portal | `/portal` (login as customer) |
| Ops dashboard | `/admin` — calendar, tasks, meetings, fleet |
| Team chat | `/admin/chat` · Aheers Lens bar |
| Settings | `/admin/settings` |
| Driver | `/driver` — menu → Delivery queue (new / next / active / delivered) |
| Customer deliveries | `/portal/deliveries` — request delivery · see driver notes |
| Trade | `/trade` |

## Driver & delivery queue (demo)

1. Login as **Thabo** → open menu → **Delivery queue**. Accept a **New** job (incl. customer requests) → **Next** → **Active**.
2. **Mark delivered + note** saves a POD note customers can see.
3. Login as **Lucrisha** → `/portal/deliveries` → **Request delivery** — job appears in the driver queue as New / Customer req.

## Notes

- Separate carts per store (never mix).
- Demo only — not production APIs / payments.
- Ops on phones: use the top **menu** button; Aheers Lens is draggable (touch + mouse).

