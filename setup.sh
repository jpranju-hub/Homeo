#!/bin/bash

# Homeo Quick Start Script

echo "🏥 Homeo - Patient Management System Setup"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
node_version=$(node -v)
npm_version=$(npm -v)
echo "Node: $node_version"
echo "npm: $npm_version"

# Install dependencies
echo -e "\n${BLUE}Installing dependencies...${NC}"
npm install

# Create .env
echo -e "\n${BLUE}Setting up environment...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ .env created (please update with your configuration)${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

# Build packages
echo -e "\n${BLUE}Building packages...${NC}"
npm run build

echo -e "\n${GREEN}=========================================="
echo "Setup complete! 🎉"
echo "=========================================="
echo -e "${NC}"
echo "Next steps:"
echo "1. Update .env with your database URL"
echo "2. Run: npm run db:migrate"
echo "3. Run: npm run dev"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"
echo ""
echo "Documentation:"
echo "- Setup: docs/SETUP.md"
echo "- API: docs/API.md"
echo "- Database: docs/DATABASE.md"
