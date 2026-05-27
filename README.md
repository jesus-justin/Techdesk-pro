# TechDesk Pro

Cross-platform enterprise IT Help Desk and Asset Management system built as a Turborepo monorepo.

## Tech Stack

| Platform | Framework | Local DB | Styling |
| --- | --- | --- | --- |
| Desktop | Tauri v2 + React + TypeScript | better-sqlite3 | TailwindCSS + shadcn/ui |
| Mobile | Expo SDK 51 + React Native + TypeScript | expo-sqlite | NativeWind |
| Backend | Express + TypeScript + Prisma + PostgreSQL | PostgreSQL | N/A |

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL

## Getting Started

1. Clone repository:
   git clone <your-repo-url>
2. Install dependencies:
   pnpm install
3. Configure environment:
   copy apps/backend/.env.example to apps/backend/.env
4. Fill required values:
   DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET
5. Push schema:
   pnpm --filter @techdesk-pro/backend exec prisma db push
6. Seed database:
   pnpm --filter @techdesk-pro/backend exec prisma db seed
7. Start all apps:
   pnpm dev

## Project Structure

- apps/desktop: Tauri desktop app
- apps/mobile: Expo mobile app
- apps/backend: API server with Prisma
- packages/ui: shared UI primitives and badges
- packages/types: shared TypeScript interfaces
- packages/validators: shared Zod schemas
- packages/sync: offline queue utilities
- packages/constants: shared enums, labels, status flows

## Default Credentials

| Email | Password | Role |
| --- | --- | --- |
| admin@techdesk.local | Password123! | ADMIN |
| staff1@techdesk.local | Password123! | IT_STAFF |
| staff2@techdesk.local | Password123! | IT_STAFF |
| emp1@techdesk.local | Password123! | EMPLOYEE |
| emp2@techdesk.local | Password123! | EMPLOYEE |
| emp3@techdesk.local | Password123! | EMPLOYEE |

## API Endpoints

| Method | Path | Auth | Minimum Role |
| --- | --- | --- | --- |
| POST | /api/v1/auth/login | No | Public |
| POST | /api/v1/auth/register | No | Public |
| POST | /api/v1/auth/refresh-token | No | Public |
| POST | /api/v1/auth/logout | Yes | EMPLOYEE |
| GET | /api/v1/tickets | Yes | EMPLOYEE |
| POST | /api/v1/tickets | Yes | EMPLOYEE |
| PATCH | /api/v1/tickets/:id | Yes | IT_STAFF |
| DELETE | /api/v1/tickets/:id | Yes | ADMIN |
| GET | /api/v1/assets | Yes | IT_STAFF |
| POST | /api/v1/assets | Yes | IT_STAFF |
| POST | /api/v1/assets/:id/assign | Yes | IT_STAFF |
| GET | /api/v1/users | Yes | ADMIN |
| PATCH | /api/v1/users/:id/role | Yes | ADMIN |
| GET | /api/v1/audit | Yes | ADMIN |
| GET | /api/v1/dashboard | Yes | EMPLOYEE |

## Offline Support

- Offline mutations are queued in local SQLite storage.
- Background sync runs on reconnect through NetInfo (mobile) or online events (desktop).
- Conflicts are resolved through last-write-wins using server timestamps.

## Screenshots

- Login screen: placeholder
- Dashboard: placeholder
- Tickets module: placeholder
- Assets module: placeholder
- Admin module: placeholder

## License

MIT
