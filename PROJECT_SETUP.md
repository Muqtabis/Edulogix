# EduFlow Suite - Complete Project Setup Guide

This guide will walk you through setting up the EduFlow Suite school management system from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Configuration](#database-configuration)
4. [Running the Application](#running-the-application)
5. [Testing Authentication](#testing-authentication)
6. [Common Issues](#common-issues)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** - For version control
- **A Supabase account** - [Sign up for free](https://supabase.com/)

### Verify Prerequisites

```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show v9.0.0 or higher
git --version     # Should show installed version
```

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Muqtabis/Edulogix.git
cd Edulogix
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18.3
- TypeScript 5.8
- Vite 5.4
- Supabase Client
- Tailwind CSS
- shadcn/ui components

---

## Database Configuration

### 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **"New Project"**
3. Enter project details:
   - **Name**: EduFlow Suite (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
4. Click **"Create new project"**
5. Wait for the project to be provisioned (2-3 minutes)

### 2. Get Your Supabase Credentials

Once your project is ready:

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Project ID** (the xxxxx part before `.supabase.co`)
   - **anon/public key** (a long JWT token)

### 3. Configure Environment Variables

1. In the project root, copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your text editor and update with your values:
   ```env
   VITE_SUPABASE_PROJECT_ID="your_project_id_here"
   VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key_here"
   VITE_SUPABASE_URL="https://your_project_id.supabase.co"
   ```

3. Save the file

### 4. Run Database Migrations

You need to create the database schema. There are two ways to do this:

#### Option A: Using Supabase Dashboard (Recommended for Beginners)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Run migrations in order:

   **Step 1: Main Schema**
   - Open `supabase/migrations/20251203200917_a60a0a12-ccab-4122-b226-7f4dde39b3d7.sql`
   - Copy the entire content
   - Paste into SQL Editor
   - Click **"Run"**
   - Wait for success message

   **Step 2: Trigger Updates**
   - Open `supabase/migrations/20251203200954_eae4fd28-e910-415e-81f9-043cf6b1dac3.sql`
   - Copy the entire content
   - Paste into SQL Editor
   - Click **"Run"**

   **Step 3: Auth Fix**
   - Open `supabase/migrations/20251204000000_fix_auth_signup.sql`
   - Copy the entire content
   - Paste into SQL Editor
   - Click **"Run"**

   **Step 4: Seed Data (Optional)**
   - Open `supabase/migrations/20251203210000_seed_data.sql`
   - Copy the entire content
   - Paste into SQL Editor
   - Click **"Run"**
   - This creates sample data (5 teachers, 10 students, classes, etc.)

#### Option B: Using Supabase CLI (For Advanced Users)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your_project_id

# Push all migrations
supabase db push
```

### 5. Verify Database Setup

1. In Supabase Dashboard, go to **Table Editor**
2. You should see the following tables:
   - profiles
   - user_roles
   - students
   - teachers
   - classes
   - grades
   - attendance
   - fees
   - assignments
   - announcements

---

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

You should see:
```
  VITE v5.4.21  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Production Build

To build for production:

```bash
# Build the project
npm run build

# Preview the production build locally
npm run preview
```

---

## Testing Authentication

### 1. Sign Up (Create New Account)

1. Open your browser and go to http://localhost:5173
2. You'll be redirected to the authentication page
3. Click **"Don't have an account? Sign up"**
4. Fill in the form:
   - **Full Name**: John Doe
   - **Email**: admin@school.edu
   - **Password**: password123 (minimum 6 characters)
   - **Role**: Select "Administrator"
5. Click **"Create Account"**
6. You should see a success message and be redirected to the dashboard

### 2. Sign In (Existing Account)

1. Go to http://localhost:5173
2. You'll see the sign-in form
3. Enter your credentials:
   - **Email**: The email you registered with
   - **Password**: Your password
4. Click **"Sign In"**
5. You'll be redirected to the appropriate dashboard based on your role:
   - **Admin** → Admin Dashboard (full access)
   - **Teacher** → Teacher Dashboard (classes, grades, attendance)
   - **Student** → Student Dashboard (view grades, schedule)

### 3. Testing Different Roles

To test different role dashboards:

1. Sign out from the current account
2. Create new accounts with different roles:
   - **Teacher**: Use teacher@school.edu
   - **Student**: Use student@school.edu

---

## Common Issues

### Issue: "Invalid API Key" or Connection Errors

**Solution:**
1. Double-check your `.env` file has correct values
2. Ensure there are no extra spaces or quotes
3. Restart the dev server after changing `.env`:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### Issue: "No data showing in dashboard"

**Solution:**
1. Make sure all migrations were run successfully
2. Run the seed data migration to populate sample data
3. Check browser console for errors (F12 → Console tab)

### Issue: "Role assignment failed" during signup

**Solution:**
1. Ensure you ran the auth fix migration (`20251204000000_fix_auth_signup.sql`)
2. Check Supabase Dashboard → Table Editor → user_roles
3. If policy issues persist, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Issue: "Stuck on loading screen" after login

**Solution:**
1. Check that user has a role assigned:
   - Go to Supabase Dashboard → Table Editor → user_roles
   - Find your user_id (check auth.users table)
   - Ensure there's an entry with your user_id and a role
2. If no role exists, manually add one:
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('your-user-id', 'admin');
   ```

---

## Next Steps

After successful setup:

1. **Explore the Dashboard** - Navigate through different sections
2. **Read Documentation**:
   - [USER_GUIDE.md](./USER_GUIDE.md) - How to use the system
   - [ADMIN_MANUAL.md](./ADMIN_MANUAL.md) - Admin features
   - [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Technical details
3. **Customize** - Modify for your school's needs
4. **Deploy** - See deployment options in README.md

---

## Project Structure Overview

```
Edulogix/
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # Supabase client & types
│   ├── pages/            # Page components
│   └── App.tsx           # Main app component
├── supabase/
│   └── migrations/       # Database migrations
├── public/               # Static assets
├── .env                  # Environment variables (create this)
├── .env.example         # Environment template
└── package.json         # Dependencies & scripts
```

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
```

---

## Getting Help

- **Issues**: Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Bugs**: Report on [GitHub Issues](https://github.com/Muqtabis/Edulogix/issues)
- **Documentation**: See README.md and other docs

---

**Congratulations!** 🎉 You've successfully set up EduFlow Suite!
