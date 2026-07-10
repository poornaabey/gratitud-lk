# GratituD.lk

Premium personalized gift boxes — Build-a-Box portal for Colombo, Sri Lanka.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS 4** + **Shadcn UI**
- **Framer Motion**, **Zustand**, **Zod**, **React Hook Form**
- **Supabase Postgres** + **Prisma 7**
- **PayHere** (Phase 4)

## Getting started

```bash
cp .env.example .env.local
# Fill DATABASE_URL (+ optional DIRECT_URL) from Supabase → Project Settings → Database
npm install
npm run db:migrate   # or: npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Phase 2 — Database & API

### Models

| Model | Purpose |
|-------|---------|
| `Product` | Catalog items (anchor / leather / grooming / treats) with `priceCents`, `volumeScore`, `stock` |
| `BoxTemplate` | Packaging themes with `basePriceCents` + `maxVolume` |
| `Order` | Gifting checkout — recipient vs billing, delivery date, surprise flag |
| `OrderItem` | Line items (packaging / anchor / add-on) with price snapshots |

Prices are stored as **integer cents** (LKR × 100).

### API routes (standardized `{ ok, data | error }` responses)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/catalog` | Products + box templates for the builder |
| `GET` | `/api/products` | Active products (`?category=ANCHOR`) |
| `GET` | `/api/products/[slug]` | Single product |
| `GET` | `/api/box-templates` | Active packaging themes |
| `GET` | `/api/box-templates/[slug]` | Single template |
| `POST` | `/api/orders` | Create pending order (server-computed total) |
| `GET` | `/api/orders/[id]` | Fetch order + items |
| `POST` | `/api/checkout` | Gifting checkout → PayHere fields or demo |
| `POST` | `/api/payhere/hash` | Server-only checkout hash |
| `POST` | `/api/payhere/notify` | PayHere payment notification webhook |

### DB scripts

```bash
npm run db:generate  # prisma generate
npm run db:migrate   # prisma migrate dev
npm run db:push      # schema push (prototyping)
npm run db:seed      # seed catalog
npm run db:studio    # Prisma Studio
```

## Brand assets

Final copper lockup under `public/brand/`:

| File | Use |
|------|-----|
| `logo-lockup.png` | Navbar, hero, footer (emblem + GratituD.lk) |
| `logo-emblem.png` | Favicon / compact mark |

## Folder architecture

```
prisma/                  # schema, migrations, seed
src/
├── app/api/             # Route handlers
├── generated/prisma/    # Prisma client (generated, gitignored)
├── components/
├── lib/                 # db.ts, api.ts, validations/
├── store/               # Zustand (Phase 3)
└── types/
```

## Development phases

1. **Phase 1** — Scaffold, premium UI & marketing/builder preview ✅
2. **Phase 2** — Prisma schema & API routes ✅
3. **Phase 3** — Zustand store & production Box Builder UI ✅
4. **Phase 4** — Checkout & PayHere integration ✅
5. **Phase 5** — Animations polish & final testing ✅

### Phase 3 — Build-a-Box

- Zustand store (`src/store/builder-store.ts`) with persist + URL hydrate
- Modular steps: Packaging → Anchor → Add-ons → Personalize → Review
- Live catalog from `GET /api/catalog` with mock fallback
- Fullness meter, sticky mobile price bar, desktop summary
- Save & share via `?pkg=&anchor=&addons=&msg=` (presets: `?preset=urban-pro`)

### Phase 4 — Gifting checkout & PayHere

- Checkout UI at `/checkout` — recipient vs billing, delivery date (≥2 days), surprise toggle
- Server-priced orders from builder slugs (`POST /api/checkout`) — never trust client prices
- PayHere Checkout API: server hash (`src/lib/payments/payhere.ts`), auto-POST redirect form
- Notify webhook `POST /api/payhere/notify` (status_code `2` → `PAID`)
- Success / cancel pages at `/checkout/success` and `/checkout/error`
- Demo path when PayHere is unconfigured or via “Complete as demo” in sandbox

#### PayHere env

```bash
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=
PAYHERE_MERCHANT_SECRET=
NEXT_PUBLIC_PAYHERE_ENV=sandbox
NEXT_PUBLIC_SITE_URL=https://your-public-https-host   # ngrok for local notify_url
```

Register the same domain in [sandbox.payhere.lk](https://sandbox.payhere.lk) → Integrations, and use the merchant secret for that domain.

### Phase 5 — Motion polish & smoke tests

- Shared motion helpers (`src/lib/motion.ts`) + `useMotionPrefs` (respects `prefers-reduced-motion`)
- Hero curated-box stagger + fullness fill; landing section fade-ups
- Builder: step transitions, animated fullness/step indicator, live total tick, sticky bar entrance
- Checkout entrance + PayHere redirect spinner; success checkmark spring
- CSS reduced-motion fallback in `globals.css`
- Smoke script: `npm run smoke` (catalog + checkout demo path)

```bash
npm run smoke
```

All five build phases are complete.
