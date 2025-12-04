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
    
    # Extract major version (with error handling)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//' | grep -E '^[0-9]+$' || echo "0")
    if [ "$MAJOR_VERSION" -lt 18 ] 2>/dev/null; then
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
    
    # Check if it contains placeholder values or missing project ID format
    if grep -q "your_project_id_here" .env || grep -q "your_publishable_key_here" .env; then
        echo -e "${YELLOW}⚠${NC} .env file contains placeholder values"
        echo "  Please add your actual Supabase credentials"
        echo "  See: CREDENTIALS.md for detailed instructions"
        SETUP_COMPLETE=false
    # Also check for basic credential format (Project ID should not be a URL or too short)
    elif ! grep -E 'VITE_SUPABASE_PROJECT_ID=".{15,}"' .env > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠${NC} Project ID in .env appears incomplete"
        echo "  Please verify your Supabase credentials"
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
echo "  Files in supabase/migrations/ (run in alphabetical order):"

# Dynamically list migration files
if [ -d "supabase/migrations" ]; then
    MIGRATION_COUNT=0
    for migration in supabase/migrations/*.sql; do
        if [ -f "$migration" ]; then
            MIGRATION_COUNT=$((MIGRATION_COUNT + 1))
            filename=$(basename "$migration")
            if [[ "$filename" == *"fix_auth_signup"* ]]; then
                echo "    $MIGRATION_COUNT. $filename (CRITICAL!)"
            elif [[ "$filename" == *"seed_data"* ]]; then
                echo "    $MIGRATION_COUNT. $filename (optional - sample data)"
            else
                echo "    $MIGRATION_COUNT. $filename"
            fi
        fi
    done
    
    if [ $MIGRATION_COUNT -eq 0 ]; then
        echo -e "    ${RED}⚠ No migration files found!${NC}"
    fi
else
    echo -e "    ${RED}⚠ supabase/migrations/ directory not found!${NC}"
fi
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
