# EduFlow Suite - Troubleshooting Guide

This guide helps you diagnose and fix common issues with the EduFlow Suite application.

## Table of Contents

1. [Authentication Issues](#authentication-issues)
2. [Database Issues](#database-issues)
3. [Build and Development Issues](#build-and-development-issues)
4. [UI and Display Issues](#ui-and-display-issues)
5. [Performance Issues](#performance-issues)
6. [Debugging Tips](#debugging-tips)

---

## Authentication Issues

### Problem: Cannot Sign Up - "Role assignment failed"

**Symptoms:**
- After filling sign-up form, you see an error message
- Error says "Account created but role assignment failed"

**Cause:**
Row Level Security (RLS) policies blocking role insertion

**Solution:**
1. Ensure the auth fix migration was applied:
   ```sql
   -- Run this in Supabase SQL Editor
   -- Check if policy exists
   SELECT * FROM pg_policies 
   WHERE tablename = 'user_roles' 
   AND policyname = 'Users can set own role on signup';
   ```

2. If policy doesn't exist, run the migration:
   - Open `supabase/migrations/20251204000000_fix_auth_signup.sql`
   - Copy all content
   - Paste in Supabase SQL Editor
   - Click "Run"

3. Alternative: Manually add the policy:
   ```sql
   CREATE POLICY "Users can set own role on signup" ON public.user_roles
     FOR INSERT 
     TO authenticated
     WITH CHECK (auth.uid() = user_id);
   ```

### Problem: Cannot Sign In - "Invalid login credentials"

**Symptoms:**
- Correct email and password, but login fails
- Error message: "Invalid login credentials"

**Possible Causes & Solutions:**

**1. Account not confirmed (if email confirmation is enabled)**
```sql
-- Check in Supabase Dashboard → Authentication → Users
-- Look for your email, check if "Email Confirmed" is true
-- If false, click the user and click "Confirm Email"
```

**2. Wrong password**
- Use password reset flow
- Or manually reset in Supabase Dashboard → Authentication → Users

**3. Account doesn't exist**
- Try signing up again
- Check Supabase Dashboard → Authentication → Users to verify account

### Problem: Stuck on "Loading your dashboard..." screen

**Symptoms:**
- Successfully logged in
- See loading spinner forever
- Dashboard never loads

**Cause:**
User doesn't have a role assigned in `user_roles` table

**Solution:**

1. **Check if role exists:**
   ```sql
   -- In Supabase SQL Editor
   SELECT ur.*, u.email 
   FROM user_roles ur
   JOIN auth.users u ON ur.user_id = u.id
   WHERE u.email = 'your@email.com';
   ```

2. **If no role found, manually add one:**
   ```sql
   -- First, get your user_id
   SELECT id, email FROM auth.users WHERE email = 'your@email.com';
   
   -- Then insert role (replace YOUR_USER_ID with actual ID)
   INSERT INTO user_roles (user_id, role)
   VALUES ('YOUR_USER_ID', 'admin');
   ```

3. **Refresh the page** - Dashboard should now load

### Problem: "Must provide a role" error on signup

**Symptoms:**
- Sign up form shows error
- Can't proceed without selecting a role

**Solution:**
This is expected behavior. You MUST select a role (Admin/Teacher/Student) during signup.

### Problem: Automatically signed out after closing browser

**Symptoms:**
- Need to log in every time you open the app

**Cause:**
Session persistence issue

**Solution:**

1. Check browser settings - ensure cookies are enabled
2. Clear browser cache and local storage:
   - Open Developer Tools (F12)
   - Go to Application tab → Local Storage
   - Delete all entries
   - Try logging in again

3. Verify Supabase client config in `src/integrations/supabase/client.ts`:
   ```typescript
   auth: {
     storage: localStorage,
     persistSession: true,
     autoRefreshToken: true,
   }
   ```

---

## Database Issues

### Problem: "No data showing in dashboard"

**Symptoms:**
- Dashboard loads but shows empty tables
- No students, teachers, or classes visible

**Solutions:**

**1. Check if database is populated:**
```sql
-- In Supabase SQL Editor
SELECT COUNT(*) as student_count FROM students;
SELECT COUNT(*) as teacher_count FROM teachers;
SELECT COUNT(*) as class_count FROM classes;
```

**2. If counts are 0, run seed data:**
- Open `supabase/migrations/20251203210000_seed_data.sql`
- Copy all content
- Paste in Supabase SQL Editor
- Click "Run"

**3. Check RLS policies:**
```sql
-- Verify policies exist
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

**4. Check browser console for errors:**
- Press F12 → Console tab
- Look for red errors
- Common error: "permission denied" means RLS blocking access

### Problem: "Permission denied" when trying to add/edit data

**Symptoms:**
- Can view data but can't modify
- Error in console: "new row violates row-level security policy"

**Cause:**
User role doesn't have permission for this operation

**Solutions:**

**1. Verify your role:**
```sql
SELECT ur.role, u.email
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.id = auth.uid();
```

**2. Check if you're admin:**
- Only admins can add/edit/delete students and teachers
- Teachers can only manage their own classes
- Students can only view their own data

**3. Grant admin role if needed:**
```sql
-- Get your user_id first
SELECT id FROM auth.users WHERE email = 'your@email.com';

-- Update role to admin (or insert if doesn't exist)
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin')
ON CONFLICT (user_id, role) 
DO UPDATE SET role = 'admin';
```

### Problem: Database connection fails

**Symptoms:**
- All pages show errors
- Console shows "Failed to fetch" or network errors

**Solutions:**

**1. Verify environment variables:**
```bash
# Check .env file exists
cat .env

# Should contain:
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
# VITE_SUPABASE_PROJECT_ID=xxxxx
```

**2. Test Supabase connection:**
- Go to Supabase Dashboard
- Check if project is running
- Check API status

**3. Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## Build and Development Issues

### Problem: "npm install" fails

**Symptoms:**
- Errors during dependency installation
- Missing packages

**Solutions:**

**1. Clear npm cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**2. Check Node version:**
```bash
node --version  # Should be v18.0.0 or higher
```

**3. If using different Node version:**
```bash
# Install nvm (Node Version Manager) if not installed
# Then:
nvm install 18
nvm use 18
npm install
```

### Problem: "npm run dev" fails or shows errors

**Symptoms:**
- Dev server won't start
- Port already in use

**Solutions:**

**1. Port 5173 already in use:**
```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

**2. Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problem: TypeScript errors

**Symptoms:**
- Red squiggles in IDE
- Build fails with type errors

**Solutions:**

**1. Run type check:**
```bash
npm run type-check
```

**2. If errors persist, regenerate types:**
```bash
# In Supabase Dashboard → API Docs → TypeScript
# Copy the generated types
# Paste into src/integrations/supabase/types.ts
```

**3. Clear TypeScript cache:**
```bash
rm -rf node_modules/.vite
npm run dev
```

### Problem: Build fails in production

**Symptoms:**
- `npm run build` shows errors
- Works in dev but not in build

**Solutions:**

**1. Check for environment-specific code:**
- Ensure no `console.log` in production code
- Check for missing dependencies

**2. Build with verbose output:**
```bash
npm run build -- --mode production
```

**3. Test production build locally:**
```bash
npm run build
npm run preview
```

---

## UI and Display Issues

### Problem: Styling looks broken or missing

**Symptoms:**
- No colors or styles applied
- Layout looks broken

**Solutions:**

**1. Clear browser cache:**
- Ctrl+Shift+Delete (Chrome/Firefox)
- Clear cached images and files
- Reload page

**2. Check if Tailwind is working:**
```bash
# Rebuild CSS
npm run dev
```

**3. Verify PostCSS config:**
- Check `postcss.config.js` exists
- Check `tailwind.config.ts` exists

### Problem: Components not rendering

**Symptoms:**
- Blank areas where components should be
- Console shows errors

**Solutions:**

**1. Check browser console (F12):**
- Look for React errors
- Fix any missing props or hooks errors

**2. Verify component imports:**
- Check file paths are correct
- Check component exports

---

## Performance Issues

### Problem: App is slow or laggy

**Solutions:**

**1. Clear browser data:**
- Clear cache and cookies
- Restart browser

**2. Check network tab (F12 → Network):**
- Look for slow API calls
- Check if data is being fetched repeatedly

**3. Optimize queries:**
- Ensure proper indexes in database
- Use pagination for large datasets

### Problem: High memory usage

**Solutions:**

**1. Close unused tabs:**
- Each tab uses memory

**2. Check for memory leaks:**
- Open React DevTools
- Check for components not unmounting

---

## Debugging Tips

### Enable Detailed Logging

Add to your component:
```typescript
console.log('Current user:', user);
console.log('Current role:', role);
console.log('Loading state:', loading);
```

### Check Supabase Logs

1. Go to Supabase Dashboard
2. Click "Logs" in sidebar
3. Select log type:
   - API logs
   - Database logs
   - Auth logs

### Browser Developer Tools

**Essential shortcuts:**
- F12 - Open DevTools
- Ctrl+Shift+C - Inspect element
- Ctrl+Shift+I - Console

**Useful tabs:**
- **Console** - JavaScript errors and logs
- **Network** - API calls and responses
- **Application** - Local storage, cookies, session
- **Sources** - Debug with breakpoints

### Common Console Errors and Fixes

**Error: "Cannot read property 'x' of undefined"**
- Check if data is loaded before accessing
- Add null checks: `data?.property`

**Error: "Failed to fetch"**
- Check network connection
- Verify Supabase credentials
- Check CORS settings

**Error: "Maximum update depth exceeded"**
- Remove useState updates inside render
- Move to useEffect

---

## Still Having Issues?

If you've tried these solutions and still have problems:

1. **Check the documentation:**
   - [PROJECT_SETUP.md](./PROJECT_SETUP.md)
   - [DATABASE_SETUP.md](./DATABASE_SETUP.md)
   - [USER_GUIDE.md](./USER_GUIDE.md)

2. **Look for similar issues:**
   - Check [GitHub Issues](https://github.com/Muqtabis/Edulogix/issues)
   - Search for your error message

3. **Create a new issue:**
   - Go to GitHub Issues
   - Click "New Issue"
   - Provide:
     - Description of problem
     - Steps to reproduce
     - Error messages
     - Screenshots if applicable
     - Your environment (OS, Node version, browser)

4. **Debug systematically:**
   - Isolate the problem
   - Test one thing at a time
   - Document what you've tried

---

## Quick Reference

### Restart Everything
```bash
# Stop all processes
# Press Ctrl+C in terminal

# Clear everything
rm -rf node_modules dist
npm cache clean --force

# Reinstall
npm install

# Start fresh
npm run dev
```

### Reset Database (DANGER - Deletes all data!)

**⚠️ WARNING: This will DELETE ALL DATA in your database! Only do this in development, NEVER in production!**

If you need to completely reset your database and start fresh:

#### Option 1: Using Supabase Dashboard (Safest)

1. **Backup important data first** (if any)
2. Go to Supabase Dashboard → Database → Tables
3. For each table, click the table → Delete table
4. Or, go to SQL Editor and run:
   ```sql
   -- Drop all tables (will fail if foreign key constraints exist)
   DROP TABLE IF EXISTS public.announcements CASCADE;
   DROP TABLE IF EXISTS public.assignments CASCADE;
   DROP TABLE IF EXISTS public.fees CASCADE;
   DROP TABLE IF EXISTS public.attendance CASCADE;
   DROP TABLE IF EXISTS public.grades CASCADE;
   DROP TABLE IF EXISTS public.classes CASCADE;
   DROP TABLE IF EXISTS public.teachers CASCADE;
   DROP TABLE IF EXISTS public.students CASCADE;
   DROP TABLE IF EXISTS public.user_roles CASCADE;
   DROP TABLE IF EXISTS public.profiles CASCADE;
   DROP TYPE IF EXISTS public.app_role CASCADE;
   ```
5. Re-run all migrations in order (see [PROJECT_SETUP.md](./PROJECT_SETUP.md))

#### Option 2: Create New Supabase Project (Cleanest)

1. Create a new Supabase project
2. Update `.env` with new credentials
3. Run migrations from scratch
4. Start fresh with clean database

#### Option 3: Using Supabase CLI

```bash
# Reset the database (requires confirmation)
supabase db reset

# Then push migrations again
supabase db push
```

**Remember**: After reset, you'll need to:
1. Re-run all migrations
2. Re-create user accounts
3. Re-populate with data (run seed migration or add manually)

### Check Service Status
- Supabase: https://status.supabase.com/
- Your project: Supabase Dashboard → Settings → General

---

**Remember:** Most issues are caused by:
1. Missing environment variables
2. Database migrations not run
3. Missing or incorrect user roles
4. RLS policy restrictions

Check these first before diving deeper!
