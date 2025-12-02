# Build Instructions

## Overview
This document provides complete instructions on how to build and deploy the Homeo patient management system.

## Prerequisites

### Required Software
- **Node.js**: 20.x LTS or higher
- **npm**: 10.x or higher
- **PostgreSQL**: 14 or higher
- **Git**: Latest version

### Verify Installation
```bash
node --version  # Should be v20.x.x or higher
npm --version   # Should be 10.x or higher
psql --version  # Should be 14 or higher
```

## Development Build

### Step 1: Clone Repository
```bash
git clone https://github.com/jpranju-hub/homeo.git
cd homeo
```

### Step 2: Install Dependencies
```bash
npm install
```
This installs all dependencies across all packages in the monorepo (frontend, backend, shared, ui).

### Step 3: Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/homeo_dev
API_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
JWT_SECRET=generate_with_openssl_rand_base64_32
JWT_REFRESH_SECRET=generate_with_openssl_rand_base64_32
NODE_ENV=development
```

### Step 4: Database Setup
```bash
# Create PostgreSQL database
createdb homeo_dev

# Run migrations
npm run db:migrate

# Verify schema (optional)
npm run db:studio
```

### Step 5: Build All Packages
```bash
npm run build
```

### Step 6: Start Development Server
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Production Build

### Step 1: Install Dependencies
```bash
npm install --production=false
```

### Step 2: Build All Packages
```bash
npm run build
```

This creates:
- `apps/backend/dist/` - Compiled backend
- `apps/frontend/.next/` - Next.js build
- `packages/shared/dist/` - Compiled shared library
- `packages/ui/dist/` - Compiled UI library

### Step 3: Generate Prisma Client
```bash
npm run db:generate
```

### Step 4: Run Migrations
```bash
npm run db:migrate -- --skip-generate
```

### Step 5: Start Services

#### Backend
```bash
cd apps/backend
npm start
```

#### Frontend (in another terminal)
```bash
cd apps/frontend
npm start
```

## Docker Build

### Build Image
```bash
docker build -t homeo:latest .
```

### Run Container
```bash
docker run -p 3000:3000 -p 3001:3001 \
  -e DATABASE_URL="postgresql://user:password@db:5432/homeo" \
  homeo:latest
```

## Build Scripts Reference

### Root Level Scripts
```bash
npm run dev          # Development mode (all services)
npm run build        # Production build (all packages)
npm run test         # Run tests (all packages)
npm run lint         # Lint all packages
npm run type-check   # TypeScript type checking
npm run format       # Format with Prettier

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

### Package-Specific Scripts

#### Backend
```bash
cd apps/backend
npm run dev          # Start dev server (with ts-node)
npm run build        # TypeScript compilation
npm run start        # Run compiled code
npm run type-check   # Type checking
npm run lint         # Linting
```

#### Frontend
```bash
cd apps/frontend
npm run dev          # Next.js dev server
npm run build        # Next.js production build
npm run start        # Start production server
npm run lint         # Next.js linting
npm run type-check   # TypeScript checking
```

#### Shared Package
```bash
cd packages/shared
npm run build        # TypeScript compilation
npm run type-check   # Type checking
```

#### UI Package
```bash
cd packages/ui
npm run build        # TypeScript compilation
npm run type-check   # Type checking
```

## Build Verification

### Check Build Output
```bash
# Backend
ls -la apps/backend/dist/

# Frontend
ls -la apps/frontend/.next/

# Shared
ls -la packages/shared/dist/

# UI
ls -la packages/ui/dist/
```

### Run Type Checking
```bash
npm run type-check
```

### Run Linting
```bash
npm run lint
```

### Run Tests
```bash
npm run test
```

## Troubleshooting

### Build Fails with Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Prisma Client Issues
```bash
npm run db:generate
```

### TypeScript Errors
```bash
npm run type-check
```

### Port Already in Use
```bash
# Find and kill process using port
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3100 npm run dev
API_PORT=3101 npm run dev
```

### Database Connection Failed
```bash
# Verify PostgreSQL is running
psql -l

# Check DATABASE_URL in .env
# Ensure database exists
createdb homeo_dev

# Test connection
psql postgresql://user:password@localhost:5432/homeo_dev
```

## Performance Tips

1. **Use npm ci instead of npm install in CI/CD**
   ```bash
   npm ci
   ```

2. **Parallel builds with Turbo** (automatic)
   - Turbo runs independent builds in parallel

3. **Enable SWC for faster TypeScript compilation**
   - Already configured in tsconfig.json

4. **Cache management**
   - Delete `.turbo` to clear build cache
   - Delete `node_modules/.turbo` to clear turbo cache

## Deployment Checklist

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Build succeeds without errors
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Tests pass
- [ ] Production build verified
- [ ] API health check working
- [ ] Frontend loads correctly

## Continuous Integration

### GitHub Actions Example
```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npm run type-check
      - run: npm run lint
```

## Support & Troubleshooting

For issues:
1. Check existing documentation in `docs/`
2. Review `PROJECT_SUMMARY.md` for overview
3. Check `docs/SETUP.md` for detailed setup
4. Create GitHub issue with:
   - Error message
   - Environment details
   - Steps to reproduce

---

**Last Updated**: November 30, 2025
