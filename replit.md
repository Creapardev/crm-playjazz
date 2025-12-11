# PlayJazz CRM

## Overview
A React-based CRM dashboard application for music education management. Built with React 19, TypeScript, Vite, Express backend, and PostgreSQL database.

## Project Structure
- `components/` - React components (Dashboard, Financial, SalesCRM, Settings, Students)
- `services/` - API client services with retry logic
- `server/` - Express backend server
  - `server/index.ts` - Server entry point (port 3001)
  - `server/routes.ts` - API routes for leads, students, payments, users, config
  - `server/db.ts` - Database connection
  - `server/seed.ts` - Database seeding script
- `shared/` - Shared code between frontend and backend
  - `shared/schema.ts` - Drizzle ORM database schema
- `App.tsx` - Main application component
- `types.ts` - TypeScript type definitions
- `constants.ts` - Application constants

## Tech Stack
- React 19
- TypeScript
- Vite (frontend dev server on port 5000)
- Express (backend on port 3001)
- PostgreSQL (Drizzle ORM)
- Recharts (charts)
- Lucide React (icons)
- Tailwind CSS (via CDN)

## Development
- `npm run dev` - Starts both backend and frontend (backend starts first, then Vite after 3 seconds)
- `npm run server` - Starts backend only
- `npm run db:push` - Push database schema changes
- `npm run db:seed` - Seed database with initial data
- `npm run build` - Build for production

## Database
- PostgreSQL database with tables: units, users, leads, students, payments, timeline_logs, system_config
- Connected via DATABASE_URL environment variable
- Data is persisted across sessions

## API Endpoints
- GET/POST /api/leads - Manage leads
- GET/POST/DELETE /api/students - Manage students
- GET /api/payments - Get payments
- GET/POST /api/config - System configuration
- GET /api/users - Get users
- GET /api/units - Get units

## Note
If the app shows a loading screen after workflow restart, refresh the page. This is due to a race condition during startup where the frontend loads before the backend is fully ready.
