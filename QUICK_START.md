# 🎓 EduFlow Suite - Quick Start Guide

**Welcome!** This is your quick reference guide to get started with EduFlow Suite.

## 📋 What You Need

- Node.js 18+ installed
- A Supabase account (free)
- 15 minutes of your time

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (2 min)

```bash
cd /path/to/Edulogix
npm install
```

### Step 2: Setup Environment (1 min)

1. Copy `.env.example` to `.env`
2. Get your Supabase credentials from https://app.supabase.com
3. Update `.env` with your credentials

### Step 3: Setup Database (5 min)

1. Go to Supabase Dashboard → SQL Editor
2. Run these migrations in order:
   - `supabase/migrations/20251203200917_*.sql` (main schema)
   - `supabase/migrations/20251203200954_*.sql` (triggers)
   - `supabase/migrations/20251204000000_*.sql` (auth fix) ⚠️ **IMPORTANT**
   - `supabase/migrations/20251203210000_*.sql` (sample data - optional)

### Step 4: Start App (1 min)

```bash
npm run dev
```

Visit: http://localhost:5173

### Step 5: Create Account

1. Click "Sign up"
2. Fill in your details
3. Select role: **Administrator**
4. Create account
5. You're in! 🎉

## ⚡ Common Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Check code quality
npm run type-check # Check TypeScript
```

## 🆘 Having Issues?

| Problem | Quick Fix |
|---------|-----------|
| Can't sign up | Did you run the auth fix migration? See `supabase/migrations/20251204000000_*.sql` |
| Stuck on loading | Check if you have a role assigned in `user_roles` table |
| No data showing | Run the seed data migration |
| Connection error | Verify `.env` credentials are correct |

## 📚 Need More Help?

- **Full Setup Guide**: [PROJECT_SETUP.md](./PROJECT_SETUP.md)
- **Fixing Issues**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **What Changed**: [FIXES_SUMMARY.md](./FIXES_SUMMARY.md)
- **Using the System**: [USER_GUIDE.md](./USER_GUIDE.md)

## ✨ What This System Does

### For Administrators
- Manage students and teachers
- Track finances and fees
- View analytics and reports
- Create announcements

### For Teachers
- Manage classes
- Take attendance
- Enter grades
- Create assignments

### For Students
- View grades and GPA
- Check class schedule
- Read announcements
- See attendance record

## 🔐 Default Test Accounts (After Seed Data)

If you ran the seed data migration, you can use these to explore:

**Note**: These are NOT real accounts in auth system. You need to create your own account first!

The seed data includes:
- 5 sample teachers
- 10 sample students
- 15 classes
- Sample grades and fees

## 🎯 Quick Tips

1. **Always use Administrator role** for your first account
2. **Run the auth fix migration** - it's crucial for signup to work
3. **Check browser console** (F12) if something doesn't work
4. **Start with sample data** - makes testing easier

## 📞 Getting Help

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) first
2. Review browser console for errors (F12)
3. Check Supabase logs in dashboard
4. Create GitHub issue if problem persists

---

**Ready to go?** Start with Step 1 above! 🚀
