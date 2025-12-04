#!/bin/bash

# ============================================
# EduLogix - Setup Helper Script
# ============================================
# This script helps you verify your setup
# and provides guidance if anything is missing.
# ============================================

echo "🎓 EduLogix - Setup Verification"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if setup is complete
SETUP_COMPLETE=true

# Check Node.js version
echo "📦 Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
    
    # Extract major version
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo -e "${RED}✗${NC} Node.js version should be 18 or higher"
        echo "  Current: $NODE_VERSION"
        echo "  Please upgrade Node.js: https://nodejs.org/"
        SETUP_COMPLETE=false
    fi
else
    echo -e "${RED}✗${NC} Node.js not installed"
    echo "  Please install Node.js 18+: https://nodejs.org/"
    SETUP_COMPLETE=false
fi
echo ""

# Check if node_modules exists
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Dependencies not installed"
    echo "  Run: npm install"
    SETUP_COMPLETE=false
fi
echo ""

# Check if .env file exists
echo "🔑 Checking environment configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    
    # Check if it contains placeholder values
    if grep -q "your_project_id_here" .env || grep -q "your_publishable_key_here" .env; then
        echo -e "${YELLOW}⚠${NC} .env file contains placeholder values"
        echo "  Please add your actual Supabase credentials"
        echo "  See: CREDENTIALS.md for detailed instructions"
        SETUP_COMPLETE=false
    else
        echo -e "${GREEN}✓${NC} .env file configured (credentials added)"
    fi
else
    echo -e "${RED}✗${NC} .env file not found"
    echo "  Run: cp .env.example .env"
    echo "  Then edit .env and add your Supabase credentials"
    echo "  See: CREDENTIALS.md for detailed instructions"
    SETUP_COMPLETE=false
fi
echo ""

# Check Supabase migrations info
echo "🗄️  Database setup..."
echo -e "${YELLOW}ℹ${NC} Database migrations must be run manually in Supabase"
echo "  1. Go to your Supabase project dashboard"
echo "  2. Open SQL Editor"
echo "  3. Run migrations in order (see CREDENTIALS.md)"
echo "  Files:"
echo "    - supabase/migrations/20251203200917_*.sql"
echo "    - supabase/migrations/20251203200954_*.sql"
echo "    - supabase/migrations/20251204000000_*.sql (CRITICAL!)"
echo "    - supabase/migrations/20251203210000_*.sql (optional)"
echo ""

# Summary
echo "=================================="
if [ "$SETUP_COMPLETE" = true ]; then
    echo -e "${GREEN}✓ Setup appears complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start the dev server: npm run dev"
    echo "2. Open: http://localhost:5173"
    echo "3. Create your first admin account"
    echo ""
    echo "📚 Documentation:"
    echo "  - SETUP.md - Complete setup guide"
    echo "  - CREDENTIALS.md - How to add credentials"
    echo "  - USER_GUIDE.md - How to use the system"
else
    echo -e "${RED}⚠ Setup incomplete${NC}"
    echo ""
    echo "Please complete the steps marked with ✗ or ⚠ above"
    echo ""
    echo "📚 For help, see:"
    echo "  - SETUP.md - Complete setup guide"
    echo "  - CREDENTIALS.md - Credentials setup"
    echo ""
    exit 1
fi
