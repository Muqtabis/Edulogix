# 🚀 EduLogix - Complete Setup Guide

This is your one-stop guide to set up and run EduLogix school management system.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **A Supabase account** ([Sign up free](https://supabase.com/))
- **15 minutes** of your time

**Verify your setup:**
```bash
node --version   # Should show v18.0.0 or higher
npm --version    # Should show v9.0.0 or higher
```

---

## 🎯 Quick Setup (3 Steps)

### Step 1: Install Dependencies
```bash
cd /path/to/Edulogix
npm install
```

### Step 2: Configure Credentials
**→ See [CREDENTIALS.md](./CREDENTIALS.md) for detailed instructions**

Quick summary:
1. Create a Supabase project at https://supabase.com
2. Get your API credentials (Project ID, URL, and anon key)
3. Copy `.env.example` to `.env`
4. Add your credentials to `.env`

### Step 3: Setup Database
Run these SQL migrations in your Supabase SQL Editor **in order**:

1. `supabase/migrations/20251203200917_*.sql` - Main schema
2. `supabase/migrations/20251203200954_*.sql` - Triggers
3. `supabase/migrations/20251204000000_*.sql` - Auth fix (REQUIRED!)
4. `supabase/migrations/20251203210000_*.sql` - Sample data (optional)

**Detailed instructions in [CREDENTIALS.md](./CREDENTIALS.md)**

---

## ▶️ Run the Application

### Development Mode
```bash
npm run dev
```
Open: http://localhost:5173

### Production Build
```bash
npm run build
npm run preview
```

---

## 👤 Create Your First Account

1. Go to http://localhost:5173
2. Click **"Sign up"**
3. Fill in your details
4. **Important**: Select **"Administrator"** as your role
5. Click "Create Account"
6. You're in! 🎉

---

## 📚 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run type-check   # Check TypeScript types
npm run format       # Format code with Prettier
```

---

## 🎨 What This System Does

### For Administrators 👨‍💼
- Manage students and teachers
- Track attendance and grades
- Monitor fees and payments
- View analytics and reports
- Create announcements
- Manage classes and schedules

### For Teachers 👨‍🏫
- View assigned classes
- Take attendance
- Enter and manage grades
- Create assignments
- Track student progress

### For Students 👨‍🎓
- View grades and GPA
- Check class schedule
- Read announcements
- Monitor attendance record
- Check fee payment status

---

## 🛠️ Technology Stack

- **Frontend**: React 18.3, TypeScript 5.8, Vite 5.4
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Authentication, Row Level Security)
- **State Management**: React Query, React Context

---

## 📁 Project Structure

```
Edulogix/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # Supabase client & types
│   ├── pages/          # Page components
│   └── App.tsx         # Main app component
├── supabase/
│   └── migrations/     # Database migration files
├── .env                # Your credentials (DO NOT COMMIT!)
├── .env.example        # Template for credentials
└── package.json        # Dependencies and scripts
```

---

## 🔒 Security

### Already Configured:
✅ Row Level Security (RLS) enabled on all tables
✅ Secure authentication with Supabase Auth
✅ Role-based access control (Admin, Teacher, Student)
✅ Environment variables for sensitive data

### You Should:
- ✅ Never commit `.env` files
- ✅ Use strong passwords
- ✅ Keep your Supabase credentials private
- ✅ Regularly update dependencies

---

## 🆘 Common Issues & Solutions

### "Invalid API Key" Error
**Problem**: Credentials in `.env` are incorrect
**Solution**: 
- Double-check your `.env` file
- Make sure there are no extra spaces or quotes
- Restart the dev server: `npm run dev`

### "Role assignment failed" Error
**Problem**: Auth fix migration not applied
**Solution**: 
- Run the migration: `supabase/migrations/20251204000000_fix_auth_signup.sql`
- This is CRITICAL for signup to work

### Stuck on "Loading..." Screen
**Problem**: User has no role assigned
**Solution**: 
- Check Supabase dashboard → Table Editor → user_roles
- Your user_id should have an entry with a role
- Manually add if missing (see CREDENTIALS.md)

### No Data Showing in Dashboard
**Problem**: Database is empty
**Solution**: 
- Run the seed data migration: `20251203210000_seed_data.sql`
- Or start adding data manually through the UI

### Port Already in Use
**Problem**: Port 5173 is already taken
**Solution**: 
```bash
# Use a different port
npm run dev -- --port 3000
```

---

## 📖 Additional Documentation

- **[CREDENTIALS.md](./CREDENTIALS.md)** - Detailed guide for setting up credentials
- **[README.md](./README.md)** - Project overview
- **[USER_GUIDE.md](./USER_GUIDE.md)** - How to use the system (all features)
- **[ADMIN_MANUAL.md](./ADMIN_MANUAL.md)** - Administrator guide

---

## 🐛 Debugging Tips

### Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Look for error messages (red text)

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Click **Logs** in sidebar
3. Check Auth logs, API logs, Database logs

### Common Console Errors

**"Failed to fetch"**
- Check your internet connection
- Verify Supabase project is active
- Check `.env` credentials

**"Permission denied"**
- RLS policies blocking access
- Make sure you're logged in
- Verify your role is set correctly

**"Cannot read property of undefined"**
- Data not loaded yet
- Add null checks in code
- Check if user is authenticated

---

## 🎓 Sample Data

If you ran the seed migration, you'll have:
- 5 sample teachers
- 10 sample students  
- 15 classes
- Sample grades, attendance, and fees

This helps you explore the system without manually entering data.

---

## 🚀 Deployment

### Deploy to Vercel
```bash
npm run build
# Then deploy the 'dist' folder to Vercel
```

### Deploy to Netlify
```bash
npm run build
# Then drag the 'dist' folder to Netlify
```

### Environment Variables
Make sure to add these environment variables in your hosting platform:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`

---

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] `.env` file configured with credentials
- [ ] All database migrations run successfully
- [ ] Development server starts without errors
- [ ] First admin account created
- [ ] Successfully logged into dashboard
- [ ] Tables visible in Supabase dashboard

---

## 📞 Getting Help

**Having issues?**
1. Check the [Common Issues](#-common-issues--solutions) section above
2. Review [CREDENTIALS.md](./CREDENTIALS.md) for setup details
3. Check browser console (F12) for errors
4. Check Supabase dashboard logs
5. Create an issue on GitHub

---

## 🎉 You're Ready!

Once you complete this setup, you'll have a fully functional school management system with:
- ✅ User authentication
- ✅ Role-based dashboards
- ✅ Student & teacher management
- ✅ Attendance tracking
- ✅ Grade management
- ✅ Fee tracking
- ✅ Announcements & assignments

**Start by creating your admin account and exploring the dashboard!**

---

**Made with ❤️ for educational institutions**
