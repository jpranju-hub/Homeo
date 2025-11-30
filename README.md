# Homeo - Homeopathic Patient Management SaaS

A production-grade, full-stack SaaS application for managing homeopathic patient care across web and mobile platforms.

## Project Structure

```
homeo/
├── apps/
│   ├── backend/          # Node.js/Express API
│   └── frontend/         # Next.js web application
├── packages/
│   ├── shared/           # Shared types and schemas
│   └── ui/               # Reusable UI components
├── docs/                 # Documentation
└── [config files]
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **State Management**: Zustand (authentication), TanStack Query (server state)
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Custom component library with Radix UI primitives
- **API Client**: Axios with automatic token refresh

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (Access + Refresh tokens)
- **Password Security**: bcryptjs

### Database
- **Primary**: PostgreSQL
- **ORM**: Prisma
- **Features**: Full audit logging, HIPAA-ready structure

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL 14+

### Quick Start
```bash
git clone <repository-url>
cd homeo
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:3001

## Documentation

- [Setup Guide](./docs/SETUP.md) - Detailed installation and configuration
- [API Documentation](./docs/API.md) - Complete API endpoints reference
- [Database Schema](./docs/DATABASE.md) - Data model and relationships

## Available Scripts

```bash
npm run dev          # Start all services in development
npm run build        # Build all packages
npm run test         # Run tests
npm run lint         # Lint all packages
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## Key Features

✅ **User Management**
- Multi-role support (Admin, Doctor, Patient, Receptionist)
- JWT-based authentication with refresh tokens
- Secure password hashing

✅ **Patient Management**
- Complete patient profiles
- Medical history tracking
- Document storage and organization

✅ **Appointments & Consultations**
- Appointment scheduling
- Consultation records
- Prescription management

✅ **Security & Compliance**
- GDPR ready
- HIPAA considerations
- Audit logging
- Role-based access control

✅ **Scalable Architecture**
- Monorepo with Turborepo
- Type-safe API layers
- Progressive web app ready

## Security

- Helmet.js for HTTP headers
- CORS protection
- JWT authentication
- Password hashing (bcryptjs)
- Input validation (Zod schemas)
- Audit logging

## Contributing

1. Create feature branch
2. Follow conventional commits
3. Run `npm run lint && npm run test`
4. Submit PR

## License

Proprietary - Homeo Patient Management System

---

**Version**: 1.0.0 | **Status**: Production Ready | **Last Updated**: November 2025
