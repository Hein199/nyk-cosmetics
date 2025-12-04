# NYK Cosmetics - Sales Order Management System

A full-stack application for managing cosmetic product sales orders, built with **Next.js 16** (frontend) and **NestJS** (backend).

## 🏗️ Project Structure (Monorepo)

```
nyk-cosmetics/
├── frontend/          # Next.js 16 with App Router
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities
│   └── services/     # API services
│
├── backend/           # NestJS API
│   ├── src/
│   │   ├── auth/     # Authentication module
│   │   ├── users/    # Users module
│   │   ├── products/ # Products module
│   │   ├── shops/    # Shops module
│   │   └── orders/   # Orders module
│   └── prisma/       # Database schema & migrations
│
├── shared/            # Shared TypeScript types
│   └── src/types/
│
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL (or Docker)

### Installation

```bash
# Clone and install dependencies
git clone <repo-url>
cd nyk-cosmetics
pnpm install

# Setup environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your database URL

# Setup database
pnpm db:push        # Push schema to database
pnpm db:generate    # Generate Prisma client

# Seed sample data
cd backend && pnpm prisma:seed && cd ..

# Start development
pnpm dev
```

### Running Individually

```bash
# Frontend only (http://localhost:3000)
pnpm dev:frontend

# Backend only (http://localhost:3001)
pnpm dev:backend

# Both together
pnpm dev
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api

## 🔐 Default Credentials

After seeding:
- **Admin**: admin@nyk.com / admin123
- **Salesperson**: sales@nyk.com / sales123

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both frontend & backend |
| `pnpm dev:frontend` | Start frontend only |
| `pnpm dev:backend` | Start backend only |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm db:push` | Push Prisma schema to DB |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:studio` | Open Prisma Studio |

## 🗄️ Database

### Using Docker (Recommended)

```bash
# Start PostgreSQL
docker run --name nyk-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nyk_cosmetics \
  -p 5432:5432 \
  -d postgres:16

# Your DATABASE_URL will be:
# postgresql://postgres:postgres@localhost:5432/nyk_cosmetics
```

### Schema

- **Users**: Admin, Salesperson, Regional Sales roles
- **Products**: SKU, price, stock, categories
- **Shops**: Customer shops with regions
- **Orders**: Order management with status workflow

## 📱 Features

### Admin
- Dashboard with statistics
- User management
- Product inventory
- Shop management
- Order approval

### Salesperson
- Create new orders
- View own orders
- Browse products
- View assigned shops

## 🔧 Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Zustand (State Management)

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI

## 📁 Shared Types

Import types from the shared package:

```typescript
// In frontend
import type { User, Order, Product } from '@nyk/shared';

// In backend
import { CreateOrderDto, OrderStatus } from '@nyk/shared';
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Railway/Render)
1. Connect your repo
2. Set root directory to `/backend`
3. Set environment variables
4. Deploy!

## 👥 Team

- Developer 1: Frontend + Auth
- Developer 2: Backend + Database

## 📄 License

Private - NYK Cosmetics © 2024
