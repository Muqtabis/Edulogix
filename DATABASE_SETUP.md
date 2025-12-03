# Database Setup and Backend Integration Guide

## Overview

This application uses **Supabase** as its backend database and authentication provider. All mock data has been replaced with real database operations using React Query hooks for efficient data fetching and caching.

## Database Schema

The database includes the following tables:

### Core Tables

1. **profiles** - User profile information
2. **user_roles** - Role assignments (admin, teacher, student)
3. **students** - Student records with personal information
4. **teachers** - Teacher records with qualifications and contact info
5. **classes** - Class schedules and assignments
6. **grades** - Student grades and exam scores
7. **attendance** - Student attendance records
8. **fees** - Fee payments and outstanding dues
9. **assignments** - Homework and project assignments
10. **announcements** - School-wide announcements

## Setup Instructions

### 1. Environment Variables

Ensure your `.env` file contains the following Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-public-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

### 2. Running Database Migrations

The migrations are located in the `supabase/migrations/` directory. There are three migration files:

1. **20251203200917_a60a0a12-ccab-4122-b226-7f4dde39b3d7.sql** - Creates all tables and Row Level Security policies
2. **20251203200954_eae4fd28-e910-415e-81f9-043cf6b1dac3.sql** - Updates trigger functions
3. **20251203210000_seed_data.sql** - Populates database with sample data

#### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file content in order
4. Execute each migration

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

### 3. Seeding the Database

The seed data migration (`20251203210000_seed_data.sql`) includes:

- 5 sample teachers
- 10 sample students
- 15 classes across different subjects
- Sample grades for all students
- Fee records with various statuses
- 5 school announcements
- 5 assignments

**Note:** The seed data will only insert if the records don't already exist (uses `ON CONFLICT DO NOTHING`).

## API Hooks

All database operations are handled through custom React Query hooks located in `src/hooks/api/`:

### Students
- `useStudents()` - Fetch all students with fee information
- `useStudent(id)` - Fetch a single student with related data
- `useAddStudent()` - Add a new student
- `useUpdateStudent()` - Update student information
- `useDeleteStudent()` - Delete a student
- `useStudentsWithUnpaidFees()` - Get students with unpaid fees

### Teachers
- `useTeachers()` - Fetch all teachers
- `useTeacher(id)` - Fetch a single teacher
- `useAddTeacher()` - Add a new teacher
- `useUpdateTeacher()` - Update teacher information
- `useDeleteTeacher()` - Delete a teacher

### Announcements
- `useAnnouncements()` - Fetch all announcements
- `useAddAnnouncement()` - Create a new announcement
- `useUpdateAnnouncement()` - Update an announcement
- `useDeleteAnnouncement()` - Delete an announcement

### Fees
- `useFees()` - Fetch all fees
- `useStudentFees(studentId)` - Fetch fees for a specific student
- `useRecentPayments(limit)` - Fetch recent payments
- `useAddFee()` - Add a new fee
- `useUpdateFee()` - Update fee (e.g., mark as paid)

### Grades
- `useGrades()` - Fetch all grades
- `useStudentGrades(studentId)` - Fetch grades for a specific student
- `useAddGrade()` - Add a new grade
- `useUpdateGrade()` - Update a grade

### Attendance
- `useAttendance()` - Fetch all attendance records
- `useStudentAttendance(studentId)` - Fetch attendance for a specific student
- `useAttendanceByDate(date)` - Fetch attendance for a specific date
- `useAddAttendance()` - Add attendance record
- `useUpdateAttendance()` - Update attendance record

### Classes
- `useClasses()` - Fetch all classes
- `useClass(id)` - Fetch a single class
- `useTeacherClasses(teacherId)` - Fetch classes for a specific teacher
- `useAddClass()` - Add a new class
- `useUpdateClass()` - Update class information

### Assignments
- `useAssignments()` - Fetch all assignments
- `useClassAssignments(className)` - Fetch assignments for a specific class
- `useAddAssignment()` - Add a new assignment
- `useUpdateAssignment()` - Update an assignment

## Authentication and Authorization

### User Roles

The application supports three roles:
- **admin** - Full access to all features
- **teacher** - Access to class management, grades, attendance
- **student** - View own grades, schedule, and announcements

### Row Level Security (RLS)

All tables have RLS policies that enforce role-based access:

- Students can only view their own records
- Teachers can view all students but only manage their own classes
- Admins have full access to all data

### Creating Users

To create a user with a specific role:

1. Sign up through the application
2. A profile is automatically created
3. Assign a role by inserting into the `user_roles` table:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid', 'admin'); -- or 'teacher' or 'student'
```

4. For teachers and students, also create records in the respective tables:

```sql
-- For teachers
INSERT INTO teachers (user_id, teacher_id, full_name, subject, email)
VALUES ('user-uuid', 'TCH006', 'John Doe', 'Computer Science', 'john@school.edu');

-- For students
INSERT INTO students (user_id, student_id, full_name, class, email)
VALUES ('user-uuid', 'STU011', 'Jane Doe', '10-A', 'jane@school.edu');
```

## Dashboard Pages

All dashboard pages have been updated to use real data:

1. **AdminDashboard** - Overview with stats, announcements, and unpaid fees
2. **StudentsPage** - Full CRUD operations for student management
3. **TeachersPage** - Full CRUD operations for teacher management
4. **FinancesPage** - Fee management and payment tracking
5. **AnnouncementsPage** - Create and view announcements
6. **StudentDashboard** - Student-specific view with grades and schedule
7. **TeacherDashboard** - Teacher tools for attendance, grades, and assignments

## Development

### Running the Development Server

```bash
npm install
npm run dev
```

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### Issue: "No data showing in dashboard"

**Solution:**
1. Check that migrations have been run successfully
2. Verify environment variables are correct
3. Run the seed data migration
4. Check browser console for API errors
5. Verify RLS policies are properly configured

### Issue: "Permission denied" errors

**Solution:**
1. Ensure the user has a role assigned in `user_roles` table
2. Check that the user's profile exists
3. For students/teachers, verify they have records in respective tables
4. Review RLS policies for the specific table

### Issue: "Cannot insert/update data"

**Solution:**
1. Verify user has the correct role (admin for most operations)
2. Check RLS policies allow the operation
3. Ensure all required fields are provided
4. Check Supabase logs for detailed error messages

## Next Steps

- Implement real-time subscriptions for live updates
- Add more comprehensive attendance tracking
- Implement assignment submission system
- Add reporting and analytics features
- Implement email notifications for fees and announcements
