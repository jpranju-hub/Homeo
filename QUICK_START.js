#!/usr/bin/env node

/**
 * Homeo - Quick Build & Run Guide
 * 
 * This guide provides step-by-step instructions for building and running
 * the Homeo Patient Management System
 */

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                    HOMEO - PATIENT MANAGEMENT SYSTEM                      ║
║                         Production-Ready Setup                            ║
╚═══════════════════════════════════════════════════════════════════════════╝

📁 PROJECT STRUCTURE
═══════════════════════════════════════════════════════════════════════════

homeo/
├── apps/
│   ├── backend/                # Express.js API Server
│   │   ├── src/
│   │   │   ├── index.ts       # Entry point
│   │   │   ├── routes/        # API endpoints
│   │   │   ├── middleware/    # Auth, error handling
│   │   │   └── utils/         # Helpers, JWT, logging
│   │   ├── prisma/
│   │   │   └── schema.prisma  # Database schema
│   │   └── package.json
│   │
│   └── frontend/               # Next.js Web App
│       ├── src/
│       │   ├── app/           # Pages (App Router)
│       │   ├── components/    # React components
│       │   ├── hooks/         # Custom hooks
│       │   ├── lib/           # API client
│       │   └── store/         # Zustand state
│       ├── tailwind.config.js
│       └── package.json
│
├── packages/
│   ├── shared/                # Shared Types & Schemas
│   │   ├── src/
│   │   │   ├── types/         # TypeScript interfaces
│   │   │   └── schemas/       # Zod validators
│   │   └── package.json
│   │
│   └── ui/                     # UI Component Library
│       ├── src/
│       │   ├── components/    # Button, Input, Card, etc.
│       │   └── utils/         # Styling utilities
│       └── package.json
│
├── docs/                       # Documentation
│   ├── SETUP.md               # Installation guide
│   ├── API.md                 # API endpoints
│   └── DATABASE.md            # Schema documentation
│
├── BUILDING.md                # Detailed build instructions
├── PROJECT_SUMMARY.md         # Complete project overview
├── package.json               # Root workspace config
├── turbo.json                 # Turborepo config
├── tsconfig.json              # TypeScript config
├── .eslintrc.json             # ESLint rules
├── .prettierrc.json           # Prettier config
├── .env.example               # Environment template
└── README.md                  # Project README


🚀 QUICK START (5 minutes)
═══════════════════════════════════════════════════════════════════════════

1. INSTALL DEPENDENCIES
   $ npm install

2. CREATE ENVIRONMENT FILE
   $ cp .env.example .env
   
   Edit .env and set:
   - DATABASE_URL=postgresql://user:password@localhost:5432/homeo_dev
   - JWT_SECRET=<run: openssl rand -base64 32>
   - JWT_REFRESH_SECRET=<run: openssl rand -base64 32>

3. SETUP DATABASE
   $ npm run db:migrate

4. START DEVELOPMENT SERVERS
   $ npm run dev

5. OPEN IN BROWSER
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001


📦 BUILD FOR PRODUCTION
═══════════════════════════════════════════════════════════════════════════

$ npm run build

Output:
✓ apps/backend/dist/          (Compiled Node.js server)
✓ apps/frontend/.next/        (Next.js optimized build)
✓ packages/shared/dist/       (Compiled types & validators)
✓ packages/ui/dist/           (Compiled UI components)


🛠️  USEFUL COMMANDS
═══════════════════════════════════════════════════════════════════════════

Development
  npm run dev              Start all services in development
  npm run build            Build all packages
  npm run lint             Check code quality
  npm run format           Format code with Prettier
  npm run type-check       TypeScript type checking

Database
  npm run db:migrate       Run migrations
  npm run db:studio        Open Prisma Studio (visual editor)
  npm run db:generate      Generate Prisma client

Backend Specific (cd apps/backend)
  npm run dev              Start backend with hot reload
  npm run build            Compile TypeScript
  npm start                Run compiled backend

Frontend Specific (cd apps/frontend)
  npm run dev              Start Next.js dev server
  npm run build            Build for production
  npm start                Run production server


🔐 SECURITY FEATURES
═══════════════════════════════════════════════════════════════════════════

✅ JWT Authentication         - Secure access + refresh tokens
✅ Password Hashing           - bcryptjs with 10 salt rounds
✅ Input Validation           - Zod schemas on client & server
✅ CORS Protection            - Configured middleware
✅ Security Headers           - Helmet.js implementation
✅ Role-Based Access          - Multi-role support (Admin, Doctor, Patient)
✅ Audit Logging              - Complete action tracking
✅ Token Refresh              - Automatic token rotation
✅ Protected Routes           - Frontend route protection


📊 DATABASE SCHEMA
═══════════════════════════════════════════════════════════════════════════

Core Tables (12 total):
• User              - Authentication & basic info
• Patient           - Patient profiles
• Doctor            - Doctor profiles
• Appointment       - Scheduled appointments
• Consultation      - Medical consultation records
• Prescription      - Medicine prescriptions
• MedicalRecord     - File references (reports, images)
• Invoice           - Billing records
• AuditLog          - Security audit trail

Features:
✓ Relationships & Foreign Keys
✓ Proper Indexing
✓ Cascade Deletes
✓ Timestamps (createdAt, updatedAt)
✓ Enum Types for Status


🌐 API ENDPOINTS
═══════════════════════════════════════════════════════════════════════════

Authentication
  POST   /api/auth/register      Create new account
  POST   /api/auth/login         Sign in
  POST   /api/auth/refresh       Refresh access token

Patients
  GET    /api/patients           List patients (paginated)
  GET    /api/patients/:id       Get patient details
  POST   /api/patients           Create patient
  PUT    /api/patients/:id       Update patient
  DELETE /api/patients/:id       Delete patient

Appointments
  GET    /api/appointments       List appointments
  GET    /api/appointments/:id   Get appointment
  POST   /api/appointments       Schedule appointment
  PUT    /api/appointments/:id   Update appointment
  DELETE /api/appointments/:id   Cancel appointment

Consultations
  GET    /api/consultations      List consultations
  GET    /api/consultations/:id  Get consultation
  POST   /api/consultations      Create consultation
  PUT    /api/consultations/:id  Update consultation

All endpoints (except auth) require: Authorization: Bearer <token>


🎨 FRONTEND FEATURES
═══════════════════════════════════════════════════════════════════════════

✓ Responsive Design            - Works on desktop, tablet, mobile
✓ Form Validation              - React Hook Form + Zod
✓ State Management             - Zustand + TanStack Query
✓ Component Library            - Reusable UI components
✓ Authentication Flow          - Login, Register, Protected routes
✓ Error Handling               - User-friendly error messages
✓ Loading States               - Spinners, skeleton screens
✓ Token Management             - Auto-refresh & logout


📚 DOCUMENTATION
═══════════════════════════════════════════════════════════════════════════

📖 docs/SETUP.md
   Complete installation and configuration guide

📖 docs/API.md
   Full API reference with request/response examples

📖 docs/DATABASE.md
   Database schema with table descriptions and relationships

📖 BUILDING.md
   Detailed build instructions and troubleshooting

📖 PROJECT_SUMMARY.md
   Complete project overview and development status


⚙️  TECHNOLOGY STACK
═══════════════════════════════════════════════════════════════════════════

Frontend Stack
  • Next.js 14+              - React framework with App Router
  • TypeScript 5+            - Type safety
  • Tailwind CSS             - Utility-first styling
  • React Hook Form          - Form management
  • Zod                      - Schema validation
  • TanStack Query           - Server state management
  • Zustand                  - Client state management
  • Axios                    - HTTP client
  • Radix UI                 - Unstyled UI primitives

Backend Stack
  • Express.js               - Node.js framework
  • TypeScript 5+            - Type safety
  • PostgreSQL 14+           - Relational database
  • Prisma ORM               - Database ORM
  • JWT                      - Authentication
  • bcryptjs                 - Password hashing
  • Helmet.js                - Security headers
  • CORS                     - Cross-origin handling

DevOps & Build
  • Turborepo                - Monorepo management
  • npm workspaces           - Dependency management
  • ESLint                   - Code quality
  • Prettier                 - Code formatting
  • Docker                   - Containerization


💾 ENVIRONMENT VARIABLES
═══════════════════════════════════════════════════════════════════════════

DATABASE_URL              PostgreSQL connection string
API_PORT                  Backend port (default: 3001)
API_BASE_URL              Backend base URL
NEXT_PUBLIC_API_URL       Frontend API endpoint

JWT_SECRET                JWT signing key (generate: openssl rand -base64 32)
JWT_REFRESH_SECRET        Refresh token key (generate: openssl rand -base64 32)

NODE_ENV                  development | staging | production

Optional Services:
REDIS_URL                 Redis connection (for caching)
AWS_*                     AWS credentials (for file uploads)
SMTP_*                    Email service (for notifications)


🧪 TESTING (Coming Soon)
═══════════════════════════════════════════════════════════════════════════

Unit Tests
  $ npm run test            Run Vitest suite

E2E Tests
  $ npm run test:e2e        Run Playwright tests

Coverage
  Target: >80% frontend, >85% backend


🐳 DOCKER DEPLOYMENT
═══════════════════════════════════════════════════════════════════════════

Build Image
  $ docker build -t homeo:latest .

Run Container
  $ docker run -p 3000:3000 -p 3001:3001 \\
      -e DATABASE_URL=postgresql://... \\
      homeo:latest

Docker Compose (coming soon)
  $ docker-compose up


📈 PERFORMANCE OPTIMIZATION
═══════════════════════════════════════════════════════════════════════════

Frontend
  ✓ Code splitting         - Automatic with Next.js
  ✓ Image optimization     - Next.js image component
  ✓ Lazy loading           - Dynamic imports
  ✓ Caching                - TanStack Query deduplication

Backend
  ✓ Connection pooling     - Prisma configuration
  ✓ Query optimization     - Proper indexing
  ✓ Pagination             - Max 100 items per request
  ✓ Response compression   - Express middleware

Database
  ✓ Indexes                - On foreign keys & common queries
  ✓ Query analysis         - EXPLAIN plans
  ✓ Backup strategy        - Daily dumps


🆘 TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════════════

Q: "Module not found" errors
A: npm install && npm run build

Q: "Cannot connect to database"
A: Check DATABASE_URL in .env and ensure PostgreSQL is running

Q: "Port already in use"
A: PORT=3100 npm run dev or kill existing process

Q: "TypeScript errors"
A: npm run type-check for details

Q: "Build fails"
A: npm install, npm run db:generate, npm run build


📞 SUPPORT & RESOURCES
═══════════════════════════════════════════════════════════════════════════

Documentation
  📖 See docs/ folder for detailed guides
  
Issues & Questions
  🐛 GitHub Issues
  📧 Email support
  💬 Discussion forum

Learning Resources
  🎓 Official docs in docs/ folder
  📚 Inline code comments
  🔗 External references in documentation


✅ VERIFICATION CHECKLIST
═══════════════════════════════════════════════════════════════════════════

Before deploying:
  □ All dependencies installed
  □ Environment variables configured
  □ Database migrations run successfully
  □ npm run build completes without errors
  □ npm run type-check passes
  □ npm run lint passes
  □ Frontend loads at http://localhost:3000
  □ Backend API responds at http://localhost:3001/health
  □ Can register and login
  □ Can create patient record


═══════════════════════════════════════════════════════════════════════════

Ready to build? Start with: npm install && npm run dev

Questions? Check the docs/ folder!

Happy coding! 🎉
═══════════════════════════════════════════════════════════════════════════
`);
