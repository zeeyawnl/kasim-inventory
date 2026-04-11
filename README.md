# Inventory CRM

A full-featured Inventory Management & CRM system built with Next.js, Prisma, and SQLite.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** SQLite via Prisma ORM
- **Validation:** Zod
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Desktop:** Tauri (optional)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the dashboard.

## Project Structure

```
├── app/                         # Next.js App Router
│   ├── (dashboard)/            # Protected routes with sidebar layout
│   │   ├── dashboard/          # Overview with stats, charts, alerts
│   │   ├── inventory/          # Product CRUD management
│   │   ├── billing/            # Retail & Wholesale invoicing
│   │   ├── customers/          # Customer management & history
│   │   ├── stock/              # Stock in/out & movement tracking
│   │   └── layout.tsx          # Sidebar + Navbar layout
│   ├── api/                    # REST API routes
│   └── layout.tsx              # Root layout
├── components/                 # Shared UI components
│   ├── common/                 # Button, Modal, Loader
│   ├── tables/                 # DataTable, Pagination
│   ├── forms/                  # InputField, SelectField
│   └── ui/                     # shadcn components (placeholder)
├── lib/                        # Core logic
│   ├── services/               # Business logic layer
│   ├── validators/             # Zod schemas
│   ├── utils/                  # Helpers (currency, totals, invoice)
│   └── constants/              # Roles, units, pricing
├── prisma/                     # Database schema & SQLite file
├── hooks/                      # Custom React hooks
├── store/                      # Zustand state management
├── scripts/                    # Utility scripts (backup)
└── tauri/                      # Desktop wrapper (optional)
```

## Features

- 📦 **Inventory Management** — Add, edit, filter products with stock levels
- 💰 **Dual Billing** — Separate retail & wholesale pricing and invoicing
- 👥 **Customer CRM** — Track customers and their purchase history
- 📊 **Dashboard** — Stats cards, sales charts, low stock alerts
- 🔄 **Stock Tracking** — Stock in/out with movement history
- 🧾 **Invoice Generation** — HTML invoice generation for printing
- 💾 **Database Backup** — Script to backup SQLite database

## API Routes

| Endpoint | Methods | Description |
|---|---|---|
| `/api/products` | GET, POST | List/create products |
| `/api/products/[id]` | GET, PUT, DELETE | Single product operations |
| `/api/orders` | GET, POST | List/create orders |
| `/api/orders/[id]` | GET, PATCH, DELETE | Single order operations |
| `/api/stock` | GET, POST | Stock movements |
| `/api/customers` | GET, POST | List/create customers |
| `/api/reports` | GET | Summary reports |

## License

Private project.
