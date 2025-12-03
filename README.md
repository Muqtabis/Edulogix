# EduFlow Suite - Complete School Management System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Muqtabis/eduflow-suite)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)

A comprehensive, full-stack school management system built with modern web technologies. EduFlow Suite provides complete solutions for managing students, teachers, academics, finances, and communications in educational institutions.

## 🌟 Features

### 👨‍💼 For Administrators
- **Student Management** - Complete student records with grades, attendance, and fees
- **Teacher Management** - Staff profiles, class assignments, and schedules
- **Financial Tracking** - Fee management, payment tracking, and financial reports
- **System Analytics** - Real-time statistics and comprehensive reports
- **User Management** - Role-based access control and permissions

### 👨‍🏫 For Teachers
- **Class Management** - View assigned classes and schedules
- **Attendance Tracking** - Mark and monitor daily attendance
- **Grade Entry** - Record and manage student grades
- **Assignment Creation** - Create and distribute homework and projects
- **Student Progress** - Track individual and class performance

### 👨‍🎓 For Students
- **Academic Dashboard** - View grades, GPA, and academic progress
- **Class Schedule** - Weekly timetable with all classes
- **Announcements** - Stay updated with school notices
- **Fee Status** - Check payment status and dues
- **Attendance Record** - Monitor attendance history

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for database)

### Installation

```bash
# Clone the repository
git clone https://github.com/Muqtabis/eduflow-suite.git

# Navigate to project directory
cd eduflow-suite

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run database migrations (see DATABASE_SETUP.md)

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 📚 Documentation

Comprehensive documentation is available:

- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete guide for all users
- **[ADMIN_MANUAL.md](ADMIN_MANUAL.md)** - Administrator manual
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Technical setup guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Development overview

## 🏗️ Technology Stack

- **Frontend**: React 18.3, TypeScript 5.8, Vite 5.4, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **State Management**: React Query, React Context

## 📧 Support

- 📖 Documentation: See docs above
- 🐛 Bug Reports: [GitHub Issues](https://github.com/Muqtabis/eduflow-suite/issues)

---

**Made with ❤️ for educational institutions worldwide**
