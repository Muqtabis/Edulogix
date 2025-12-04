# 🔑 Credentials Setup Guide

This guide explains where and how to add your credentials to make the application work.

## Step 1: Get Supabase Credentials

### 1.1 Create a Supabase Account
1. Go to https://supabase.com/
2. Click "Start your project"
3. Sign up for a free account

### 1.2 Create a New Project
1. Once logged in, click "New Project"
2. Fill in the details:
   - **Name**: edulogix (or your preferred name)
   - **Database Password**: Choose a strong password (save it somewhere safe!)
   - **Region**: Select the region closest to you
3. Click "Create new project"
4. Wait 2-3 minutes for the project to initialize

### 1.3 Get Your API Credentials
1. Once the project is ready, go to **Settings** (⚙️ icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see three important values:

   **Project URL**: 
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **Project ID** (the xxxxx part before .supabase.co):
   ```
   xxxxxxxxxxxxx
   ```
   
   **anon/public Key** (a long JWT token starting with "eyJ..."):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
   ```

4. **Keep these values safe!** You'll need them in the next step.

---

## Step 2: Add Credentials to Your Project

### 2.1 Locate the Environment File
In your project root directory, you'll find a file called `.env.example`

### 2.2 Create Your .env File
1. Copy `.env.example` to create a new file called `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file in your text editor

### 2.3 Replace Placeholder Values
Update the `.env` file with YOUR credentials from Supabase:

```bash
# Replace 'your_project_id_here' with your actual Project ID
VITE_SUPABASE_PROJECT_ID="your_project_id_here"

# Replace 'your_publishable_key_here' with your actual anon/public key
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key_here"

# Replace the URL with your actual Project URL
VITE_SUPABASE_URL="https://your_project_id.supabase.co"
```

**Example with real values** (DO NOT use these - they won't work):
```bash
VITE_SUPABASE_PROJECT_ID="xyzabc123456"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyMzQ1NiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk..."
VITE_SUPABASE_URL="https://xyzabc123456.supabase.co"
```

### 2.4 Save the File
- Make sure to **save** the `.env` file
- Do NOT commit this file to git (it's already in .gitignore)

---

## Step 3: Setup Database Schema

After adding your credentials, you need to set up the database tables.

### 3.1 Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **"New Query"**

### 3.2 Run Migrations in Order

Run these SQL files **in this exact order**:

#### Migration 1: Main Schema
1. Open: `supabase/migrations/20251203200917_a60a0a12-ccab-4122-b226-7f4dde39b3d7.sql`
2. Copy the **entire content** of the file
3. Paste it into the SQL Editor
4. Click **"Run"** button
5. Wait for "Success. No rows returned" message

#### Migration 2: Triggers
1. Open: `supabase/migrations/20251203200954_eae4fd28-e910-415e-81f9-043cf6b1dac3.sql`
2. Copy the **entire content**
3. Paste into SQL Editor
4. Click **"Run"**

#### Migration 3: Authentication Fix (CRITICAL!)
1. Open: `supabase/migrations/20251204000000_fix_auth_signup.sql`
2. Copy the **entire content**
3. Paste into SQL Editor
4. Click **"Run"**
5. ⚠️ **This migration is REQUIRED for authentication to work!**

#### Migration 4: Sample Data (Optional)
1. Open: `supabase/migrations/20251203210000_seed_data.sql`
2. Copy the **entire content**
3. Paste into SQL Editor
4. Click **"Run"**
5. This creates sample students, teachers, and classes for testing

### 3.3 Verify Database Setup
1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
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

## Step 4: Test Your Setup

### 4.1 Start the Application
```bash
npm install  # If you haven't already
npm run dev
```

The application should start at: http://localhost:5173

### 4.2 Create Your First Account
1. Open http://localhost:5173 in your browser
2. Click **"Don't have an account? Sign up"**
3. Fill in the form:
   - **Full Name**: Your Name
   - **Email**: your.email@example.com
   - **Password**: At least 6 characters
   - **Role**: Select **"Administrator"** (recommended for first account)
4. Click **"Create Account"**

### 4.3 Verify Success
✅ If everything is set up correctly:
- You'll see a success message
- You'll be redirected to the dashboard
- The dashboard will show your name and role

❌ If you see an error:
- Check that all migrations were run successfully
- Verify your `.env` file has correct credentials
- Check browser console (F12) for detailed error messages
- Ensure there are no typos in your credentials

---

## 🔒 Security Notes

### What to KEEP SECRET:
- ✅ Your `.env` file - NEVER commit this to git
- ✅ Your Supabase database password
- ✅ Your anon/public key (though it's less sensitive)

### What's SAFE to share:
- ✅ Your Project ID (it's in the URL)
- ✅ Your Project URL (it's public anyway)

### Best Practices:
1. **Never commit `.env` files** to version control
2. **Use different projects** for development and production
3. **Regenerate keys** if accidentally exposed
4. **Enable Row Level Security (RLS)** - already configured in migrations
5. **Use environment variables** for all sensitive data

---

## 🆘 Troubleshooting

### Error: "Invalid API Key"
**Solution**: Double-check your credentials in `.env`
- Make sure there are NO extra spaces
- Make sure there are NO extra quotes (should look like: `KEY="value"`)
- Ensure you copied the entire anon/public key

### Error: "Failed to fetch"
**Solution**: 
1. Verify your Project URL is correct
2. Check if your Supabase project is active (green status)
3. Make sure you have internet connection

### Error: "Role assignment failed"
**Solution**: 
- Make sure you ran Migration 3 (fix_auth_signup.sql)
- Check the policies exist in Supabase:
  ```sql
  SELECT * FROM pg_policies 
  WHERE tablename = 'user_roles';
  ```

### Error: "Stuck on loading screen"
**Solution**:
- Sign out and sign in again
- Check if your user has a role:
  ```sql
  SELECT * FROM user_roles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'your@email.com'
  );
  ```
- If no role found, manually add one:
  ```sql
  INSERT INTO user_roles (user_id, role)
  VALUES (
    (SELECT id FROM auth.users WHERE email = 'your@email.com'),
    'admin'
  );
  ```

---

## ✅ Checklist

Use this checklist to make sure everything is set up:

- [ ] Created Supabase account
- [ ] Created new Supabase project
- [ ] Got Project ID from Supabase
- [ ] Got anon/public key from Supabase
- [ ] Got Project URL from Supabase
- [ ] Created `.env` file from `.env.example`
- [ ] Added Project ID to `.env`
- [ ] Added anon/public key to `.env`
- [ ] Added Project URL to `.env`
- [ ] Ran Migration 1 (main schema)
- [ ] Ran Migration 2 (triggers)
- [ ] Ran Migration 3 (auth fix) ⚠️ CRITICAL
- [ ] Ran Migration 4 (seed data) - Optional
- [ ] Verified tables exist in Supabase
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Created first admin account
- [ ] Successfully logged in
- [ ] Dashboard loads correctly

---

## 📞 Need More Help?

If you're still having issues:
1. Check the browser console (press F12) for error messages
2. Check Supabase logs in the dashboard
3. Verify all migrations ran without errors
4. Try creating a fresh Supabase project and start over

---

**That's it!** Once you complete these steps, your application will be fully functional. 🎉
