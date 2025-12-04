# 🎓 EduLogix - School Management System

A modern, full-stack school management system built with React, TypeScript, and Supabase.

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

---

## 🚀 First Time Here?

**👉 Start here: [START_HERE.md](./START_HERE.md)** - Simple 5-step guide to get running!

---

## ✨ Features

### 👨‍💼 For Administrators
- Complete student and teacher management
- Financial tracking (fees, payments, reports)
- System analytics and dashboards
- Announcements and communications
- Class and schedule management

### 👨‍🏫 For Teachers
- Class and student management
- Attendance tracking
- Grade entry and management
- Assignment creation and distribution
- Student progress monitoring

### 👨‍🎓 For Students
- View grades and GPA
- Check class schedules
- Read announcements
- Monitor attendance
- Check fee payment status

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Setup Credentials
**→ See [WHERE_TO_ADD_CREDENTIALS.md](./WHERE_TO_ADD_CREDENTIALS.md)** for exact location

**Quick version:**
```bash
# 1. Copy the template
cp .env.example .env

# 2. Get your Supabase credentials from https://supabase.com
# 3. Open .env and replace the placeholder values
# 4. Save the file
```

Detailed guide: [CREDENTIALS.md](./CREDENTIALS.md)

### 3️⃣ Setup Database
Run the SQL migrations in your Supabase dashboard (see [SETUP.md](./SETUP.md))

### 4️⃣ Start the App
```bash
npm run dev
```
Open: http://localhost:5173

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[SETUP.md](./SETUP.md)** | Complete setup guide - start here! |
| **[CREDENTIALS.md](./CREDENTIALS.md)** | How to add your Supabase credentials |
| **[USER_GUIDE.md](./USER_GUIDE.md)** | How to use all features |
| **[ADMIN_MANUAL.md](./ADMIN_MANUAL.md)** | Administrator features guide |

---

## 🛠️ Built With

- **Frontend**: React 18.3, TypeScript 5.8, Vite 5.4
- **UI**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Authentication, RLS)
- **State**: React Query, React Context

---

## 🔒 Security

- ✅ Row Level Security (RLS) enabled
- ✅ Secure authentication with Supabase Auth
- ✅ Role-based access control
- ✅ Environment variables for credentials
- ✅ No hardcoded secrets

---

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run type-check   # Type check with TypeScript
npm run format       # Format code with Prettier
```

---

## 🗂️ Project Structure

```
Edulogix/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   └── integrations/    # Supabase client
├── supabase/
│   └── migrations/      # Database migrations
├── .env.example         # Template for credentials
├── SETUP.md            # Complete setup guide
├── CREDENTIALS.md      # Credentials setup guide
└── package.json        # Dependencies
```

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid API Key" | Check your `.env` file and restart dev server |
| "Role assignment failed" | Run the auth fix migration (see CREDENTIALS.md) |
| Stuck on loading screen | User needs a role assigned in database |
| No data showing | Run the seed data migration (optional) |

**More help**: See [SETUP.md](./SETUP.md) troubleshooting section

---

## 🎯 First Time Setup

1. **Read [SETUP.md](./SETUP.md)** - Complete setup instructions
2. **Read [CREDENTIALS.md](./CREDENTIALS.md)** - How to add credentials
3. **Create admin account** - Use "Administrator" role for first user
4. **Explore the system** - Check out all the features!

---

## 📦 Deployment

### Vercel / Netlify
```bash
npm run build
# Deploy the 'dist' folder
```

**Don't forget** to add your environment variables:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file.

---

## 🌟 Support

- 📖 **Documentation**: Check [SETUP.md](./SETUP.md) and other guides
- 🐛 **Issues**: Report on [GitHub Issues](https://github.com/Muqtabis/Edulogix/issues)
- 💬 **Questions**: Create a discussion on GitHub

---

**Made with ❤️ for educational institutions worldwide**
