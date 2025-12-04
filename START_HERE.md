# 🚀 Getting Started with EduLogix

**Welcome!** Follow these simple steps to get EduLogix running.

---

## ⚡ Quick Start (5 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Credentials
```bash
# Copy the example environment file
cp .env.example .env

# Open .env and add your Supabase credentials
```

**→ See [WHERE_TO_ADD_CREDENTIALS.md](./WHERE_TO_ADD_CREDENTIALS.md)** for exact instructions

**→ See [CREDENTIALS.md](./CREDENTIALS.md)** for how to get your Supabase credentials

### 3. Setup Database
- Go to your Supabase project dashboard
- Open SQL Editor
- Run the migrations in `supabase/migrations/` folder (in order)
- See CREDENTIALS.md for step-by-step instructions

### 4. Start the Application
```bash
npm run dev
```
Open http://localhost:5173

### 5. Create Your Admin Account
- Click "Sign up"
- Fill in your details
- **Important**: Select "Administrator" as your role
- Click "Create Account"

**Done!** 🎉 You're ready to use EduLogix!

---

## 📋 Checklist

Use this checklist to track your setup progress:

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created from `.env.example`
- [ ] Supabase credentials added to `.env`
- [ ] All database migrations run successfully
- [ ] Application starts without errors (`npm run dev`)
- [ ] First admin account created
- [ ] Successfully logged into dashboard

---

## 🆘 Need Help?

**Having issues?** Check these resources:

| Issue | Resource |
|-------|----------|
| Don't have Supabase credentials | [CREDENTIALS.md](./CREDENTIALS.md) |
| Setup problems | [SETUP.md](./SETUP.md) |
| Want to understand features | [USER_GUIDE.md](./USER_GUIDE.md) |
| Administrator features | [ADMIN_MANUAL.md](./ADMIN_MANUAL.md) |

**Quick Help:**
```bash
# Run setup verification script
./check-setup.sh

# Check if everything is configured correctly
```

---

## 🎯 What's Next?

After setup, you can:

1. **Explore the Dashboard** - Navigate through all features
2. **Add Users** - Create teacher and student accounts
3. **Setup Classes** - Create classes and assign teachers
4. **Add Students** - Enroll students in classes
5. **Try Features** - Test attendance, grades, fees, etc.

---

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide
- **[CREDENTIALS.md](./CREDENTIALS.md)** - How to add credentials  
- **[USER_GUIDE.md](./USER_GUIDE.md)** - Feature documentation
- **[ADMIN_MANUAL.md](./ADMIN_MANUAL.md)** - Admin features
- **[README.md](./README.md)** - Project overview

---

## 🔑 Important Notes

### Security
- ✅ Never commit `.env` files to git
- ✅ Keep your Supabase credentials private
- ✅ Use strong passwords for user accounts

### First Account
- ✅ Always create an Administrator account first
- ✅ Admin has full access to all features
- ✅ You can create additional roles later

### Database
- ✅ Run ALL migrations in order
- ✅ The auth fix migration is CRITICAL
- ✅ Sample data migration is optional but recommended

---

**Ready to go? Start with Step 1!** 🚀
