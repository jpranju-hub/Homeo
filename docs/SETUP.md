# Installation & Setup Guide

## System Requirements

- Node.js 20.x LTS or higher
- npm 10.x or higher
- PostgreSQL 14 or higher
- Git

## Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/homeo.git
cd homeo
```

### 2. Install Dependencies
```bash
npm install
```

This installs dependencies for all workspace packages (frontend, backend, shared, ui).

### 3. Environment Configuration

#### Create .env file
```bash
cp .env.example .env
```

#### Edit .env with your settings
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/homeo_dev

# API
API_PORT=3001
API_BASE_URL=http://localhost:3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

# JWT
JWT_SECRET=your_super_secret_jwt_key_generate_with_openssl
JWT_REFRESH_SECRET=your_super_secret_refresh_key

# Node Environment
NODE_ENV=development
```

### 4. Database Setup

#### Create PostgreSQL Database
```bash
createdb homeo_dev
```

Or using psql:
```bash
psql -U postgres
CREATE DATABASE homeo_dev;
\q
```

#### Run Migrations
```bash
npm run db:migrate
```

This creates all tables based on the Prisma schema.

#### Verify Database
```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555

### 5. Build Packages
```bash
npm run build
```

### 6. Start Development Servers
```bash
npm run dev
```

This starts both frontend and backend in development mode:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Development Setup

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

### Running Tests
```bash
npm run test
```

## First Time Setup Checklist

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create and configure `.env`
- [ ] Create PostgreSQL database
- [ ] Run `npm run db:migrate`
- [ ] Run `npm run build`
- [ ] Start dev server with `npm run dev`
- [ ] Access http://localhost:3000

## Generate JWT Secrets

For development, you can use these commands:

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate JWT_REFRESH_SECRET
openssl rand -base64 32
```

## Docker Setup (Optional)

### Build Image
```bash
docker build -t homeo:latest .
```

### Run Container
```bash
docker run -p 3000:3000 -p 3001:3001 \
  -e DATABASE_URL=postgresql://user:password@host:5432/homeo_dev \
  homeo:latest
```

## Troubleshooting

### "Module not found" errors
```bash
npm install
npm run build
```

### Database connection errors
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists: `createdb homeo_dev`

### Port already in use
- Frontend: `PORT=3100 npm run dev`
- Backend: `API_PORT=3101 npm run dev`

### Prisma client issues
```bash
npm run db:generate
```

## Next Steps

1. Read [API Documentation](./API.md)
2. Review [Database Schema](./DATABASE.md)
3. Check [Architecture Guide](./ARCHITECTURE.md)
4. Start building features!

## Support

For issues:
1. Check existing GitHub issues
2. Create detailed bug report
3. Include environment details and error logs
