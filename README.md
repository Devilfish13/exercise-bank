# Eagle Bank

A responsive banking frontend built as a take-home assessment. Covers authentication, a personal finance dashboard, account management, transaction history, and profile editing — all backed by a mocked in-memory API (no external services required).

> **Live demo** [exercise-bank.vercel.app](https://exercise-bank.vercel.app)  
> **Demo credentials** `demo@eaglebank.com` / `Password123!`

---

## Features

| Area | What's included |
|---|---|
| **Landing page** | Marketing hero, feature highlights, sign-up/sign-in CTAs |
| **Authentication** | Register, login, logout — scrypt password hashing, HMAC-signed httpOnly session cookie |
| **Dashboard** | Net balance, monthly deposits/withdrawals, account cards, 5 recent transactions |
| **Accounts** | List of current/ISA/credit accounts with linked detail pages and transaction history |
| **Transactions** | Full history with account filter, date-range filter, sort by date or amount, pagination, and detail view |
| **Profile** | Edit name, email, phone; mock avatar upload (client-side base64, 2 MB cap) |
| **Error handling** | Custom 404 page, per-route error boundary, global error boundary |

---

## Tech stack

- **Framework** — Next.js 16 (App Router, Route Handlers, Middleware proxy)
- **Language** — TypeScript 5
- **UI** — React 19, Tailwind CSS v4, shadcn/ui (Base UI)
- **Forms** — React Hook Form + Zod
- **Testing** — Vitest 4, React Testing Library, jsdom

---

## Getting started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install

```bash
git clone https://github.com/Devilfish13/exercise-bank.git
cd exercise-bank
npm install
```

### Environment

No `.env` file is needed for local development. In production, set one optional variable:

| Variable | Purpose | Default |
|---|---|---|
| `AUTH_SECRET` | HMAC key for session cookie signing | `dev-insecure-eagle-bank-secret` |

### Run

```bash
npm run dev        # start development server on http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

---

## Scripts

```bash
npm test               # run all tests once
npm run test:watch     # run tests in watch mode
npm run test:coverage  # run tests with v8 coverage report
npm run lint           # ESLint
npx tsc --noEmit       # type-check without emitting
```

---

## Project structure

```
src/
├── app/
│   ├── (app)/          # authenticated pages (dashboard, accounts, transactions, profile)
│   ├── (auth)/         # login, register
│   ├── (marketing)/    # landing page
│   └── api/            # Route Handlers (auth, accounts, transactions, profile, dashboard)
├── components/
│   ├── feedback/       # ErrorState
│   ├── layout/         # AppHeader, SiteHeader, SiteFooter, Logo
│   └── ui/             # shadcn primitives (Button, Card, Input, …)
├── features/
│   ├── accounts/       # types, api client, server store, components
│   ├── auth/           # types, schemas, api client, context, server (session, password, user store)
│   ├── dashboard/      # types, api client, server aggregation, components
│   ├── profile/        # Avatar, ProfileForm
│   └── transactions/   # types, api client, server store, components
├── hooks/              # useAsyncData
├── lib/
│   ├── api/            # apiFetch, ApiError
│   └── format.ts       # formatCurrency, formatDate, maskAccountNumber
└── mocks/data/         # seed JSON (users, accounts, transactions)
```

All feature code lives under `src/features/<name>/` with a consistent sub-structure: `types.ts`, `api.ts` (client), `server/` (stores, helpers), `components/`.

---

## Architecture notes

**No external backend.** All API routes are Next.js Route Handlers backed by in-memory stores seeded from JSON. Data resets on server restart — this is intentional for a self-contained demo.

**Auth.** Registration and login go through `/api/auth/*`. Passwords are hashed with Node's `crypto.scrypt`. A short-lived HMAC-signed JSON payload is stored in an httpOnly cookie. A Middleware proxy provides an optimistic auth gate at the edge; a client-side `AuthProvider` is the authoritative guard inside the app shell.

**Data fetching.** All pages are client components that fetch via a shared `useAsyncData` hook (loading / error / retry) or local `useEffect` for parameterised queries. No SWR or React Query — kept dependency-free deliberately.

**URL-state filters.** The transactions filter panel syncs to URL search params so filters survive page refresh and the browser back button.

**404 vs 403.** Ownership checks on accounts and transactions return 404 (not 403) to avoid leaking whether an ID exists.
