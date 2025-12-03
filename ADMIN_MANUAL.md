# EduFlow Suite - Administrator Manual

## Table of Contents
1. [Administrator Overview](#administrator-overview)
2. [Initial System Setup](#initial-system-setup)
3. [User Management](#user-management)
4. [Data Management](#data-management)
5. [System Configuration](#system-configuration)
6. [Reporting and Analytics](#reporting-and-analytics)
7. [Backup and Recovery](#backup-and-recovery)
8. [Security Management](#security-management)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Maintenance Tasks](#maintenance-tasks)

---

## Administrator Overview

As a system administrator, you have complete access to all features and data in EduFlow Suite. Your responsibilities include:

- Managing user accounts and permissions
- Maintaining student and teacher records
- Overseeing financial operations
- Ensuring data integrity and security
- Generating reports and analytics
- System maintenance and troubleshooting

---

## Initial System Setup

### Step 1: Database Configuration

Before using the system, ensure the database is properly configured:

1. **Run Database Migrations**
   ```bash
   # Navigate to your Supabase project
   # Execute migrations in order:
   # 1. Schema migration (creates tables and RLS policies)
   # 2. Function updates
   # 3. Seed data (optional - provides sample data)
   ```

2. **Verify Environment Variables**
   - Check `.env` file has correct Supabase credentials
   - Confirm connection to database is working
   - Test authentication system

3. **Seed Initial Data (Optional)**
   - Run seed data migration for testing
   - Includes 10 sample students
   - Includes 5 sample teachers
   - Includes sample classes, grades, and fees

### Step 2: Create First Admin Account

1. **Sign up through the application**
2. **Assign admin role in database**:
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('your-user-id', 'admin');
   ```

3. **Verify admin access** by logging in

### Step 3: Configure School Information

Set up your school's basic information:
- School name
- Academic year
- Semester dates
- Fee structure
- Class sections

---

## User Management

### Creating User Accounts

#### Creating a Student Account

1. **Add Student Record**
   - Navigate to Students page
   - Click "Add Student"
   - Fill in all required fields:
     - Full name
     - Student ID (unique)
     - Class section
     - Email
     - Parent contact
     - Date of birth
     - Address

2. **Create User Account** (if student needs login access)
   ```sql
   -- Student record will be linked to auth.users
   -- After signup, link student record:
   UPDATE students 
   SET user_id = 'auth-user-id'
   WHERE student_id = 'STU001';
   ```

3. **Assign Student Role**
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('auth-user-id', 'student');
   ```

#### Creating a Teacher Account

1. **Add Teacher Record**
   - Navigate to Teachers page
   - Click "Add Teacher"
   - Enter teacher information:
     - Full name
     - Teacher ID (unique)
     - Subject specialization
     - Email
     - Phone
     - Qualifications

2. **Create User Account**
   - Teacher signs up through auth page
   - Link teacher record to user account

3. **Assign Teacher Role**
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('auth-user-id', 'teacher');
   ```

4. **Assign Classes**
   - Navigate to Classes management
   - Assign teacher to specific classes
   - Set schedule and room assignments

### Managing User Permissions

#### Role Hierarchy

1. **Admin** (Highest)
   - Full system access
   - Can manage all users
   - Can modify all data
   - Access to all reports

2. **Teacher** (Medium)
   - View all students
   - Manage assigned classes
   - Enter grades and attendance
   - Create assignments
   - Limited financial access

3. **Student** (Lowest)
   - View own data only
   - No editing capabilities
   - Read-only access

#### Changing User Roles

```sql
-- Update existing role
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'user-id';

-- Add additional role (if needed)
INSERT INTO user_roles (user_id, role)
VALUES ('user-id', 'teacher');
```

### Deactivating User Accounts

For security reasons, don't delete user accounts. Instead:

1. **Disable in Supabase Auth**
   - Go to Supabase Dashboard
   - Navigate to Authentication > Users
   - Find the user and disable their account

2. **Remove Role Assignment** (optional)
   ```sql
   DELETE FROM user_roles 
   WHERE user_id = 'user-id';
   ```

---

## Data Management

### Student Data Management

#### Bulk Student Import

For importing large numbers of students:

1. **Prepare CSV File** with columns:
   - student_id, full_name, email, class, parent_contact, date_of_birth, address

2. **Use SQL Import**:
   ```sql
   INSERT INTO students (student_id, full_name, email, class, parent_contact, date_of_birth, address)
   VALUES 
   ('STU011', 'John Doe', 'john@school.edu', '10-A', '+1-555-0111', '2008-01-15', '123 Main St'),
   ('STU012', 'Jane Smith', 'jane@school.edu', '10-A', '+1-555-0112', '2008-02-20', '456 Oak Ave');
   ```

3. **Verify Import**
   - Check student count
   - Verify all fields populated correctly
   - Test student login (if applicable)

#### Managing Student Transitions

**Promoting Students to Next Grade**:
```sql
-- Update all students from 10-A to 11-A
UPDATE students 
SET class = '11-A' 
WHERE class = '10-A';
```

**Transferring Students Between Classes**:
```sql
UPDATE students 
SET class = '10-B' 
WHERE student_id = 'STU001';
```

### Teacher Data Management

#### Assigning Teacher Schedules

1. **Create Class Records**:
   ```sql
   INSERT INTO classes (name, subject, teacher_id, room, schedule)
   VALUES ('10-A', 'Mathematics', 'teacher-uuid', 'Room 101', 
           '{"monday": "08:00-09:00", "wednesday": "10:00-11:00"}'::jsonb);
   ```

2. **Update Class Assignments**:
   - Use the Classes interface
   - Select teacher from dropdown
   - Set schedule and room

### Academic Data Management

#### Managing Grades

**Bulk Grade Entry**:
```sql
-- Enter grades for entire class
INSERT INTO grades (student_id, subject, score, max_score, exam_type, exam_date, teacher_id)
SELECT id, 'Mathematics', 85, 100, 'Midterm', CURRENT_DATE, 'teacher-uuid'
FROM students
WHERE class = '10-A';
```

**Grade Corrections**:
```sql
UPDATE grades 
SET score = 90 
WHERE id = 'grade-uuid';
```

#### Managing Attendance

**Bulk Attendance Entry**:
```sql
-- Mark all present for a class on a specific date
INSERT INTO attendance (student_id, class_id, date, status, marked_by)
SELECT s.id, c.id, CURRENT_DATE, 'present', 'teacher-uuid'
FROM students s
CROSS JOIN classes c
WHERE s.class = '10-A' AND c.name = '10-A' AND c.subject = 'Mathematics';
```

### Financial Data Management

#### Setting Up Fees

**Create Fee Records for All Students**:
```sql
INSERT INTO fees (student_id, amount, description, due_date, status)
SELECT id, 2400, 'Semester Fee', '2025-01-31', 'pending'
FROM students;
```

**Recording Payments**:
```sql
UPDATE fees 
SET status = 'paid', 
    paid_date = CURRENT_DATE 
WHERE student_id = 'student-uuid' 
  AND id = 'fee-uuid';
```

**Handling Overdue Fees**:
```sql
-- Automatically mark fees as overdue
UPDATE fees 
SET status = 'overdue' 
WHERE due_date < CURRENT_DATE 
  AND status = 'pending';
```

---

## System Configuration

### Academic Calendar Setup

Configure important dates:

1. **Semester Dates**
   - Start date
   - End date
   - Mid-term dates
   - Final exam dates

2. **Holidays and Breaks**
   - Create announcement for each holiday
   - Update class schedules accordingly

### Class Configuration

**Creating New Classes**:

1. Through UI:
   - Navigate to Classes (if page exists)
   - Or create via SQL:

```sql
INSERT INTO classes (name, subject, teacher_id, room, schedule)
VALUES (
  '12-A',
  'Chemistry',
  'teacher-uuid',
  'Lab 1',
  '{"monday": "10:00-11:00", "thursday": "14:00-15:00"}'::jsonb
);
```

### Fee Structure Configuration

Define different fee types:

```sql
-- Tuition fees
INSERT INTO fees (student_id, amount, description, due_date, status)
SELECT id, 2400, 'Tuition Fee - Semester 1', '2025-01-31', 'pending'
FROM students;

-- Activity fees
INSERT INTO fees (student_id, amount, description, due_date, status)
SELECT id, 200, 'Activity Fee', '2025-02-15', 'pending'
FROM students
WHERE class LIKE '11-%';

-- Library fees
INSERT INTO fees (student_id, amount, description, due_date, status)
SELECT id, 100, 'Library Fee', '2025-01-31', 'pending'
FROM students;
```

---

## Reporting and Analytics

### Standard Reports

#### 1. Enrollment Report

View total students by class:

```sql
SELECT class, COUNT(*) as student_count
FROM students
GROUP BY class
ORDER BY class;
```

#### 2. Academic Performance Report

Average grades by subject:

```sql
SELECT subject, 
       AVG(score) as average_score,
       MIN(score) as min_score,
       MAX(score) as max_score
FROM grades
GROUP BY subject
ORDER BY average_score DESC;
```

#### 3. Attendance Report

Overall attendance statistics:

```sql
SELECT 
  s.class,
  COUNT(*) as total_records,
  SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
  SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent,
  SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late,
  ROUND(100.0 * SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(*), 2) as attendance_rate
FROM attendance a
JOIN students s ON a.student_id = s.id
GROUP BY s.class
ORDER BY s.class;
```

#### 4. Financial Report

Fee collection summary:

```sql
SELECT 
  COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count,
  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_collected,
  SUM(CASE WHEN status != 'paid' THEN amount ELSE 0 END) as total_pending
FROM fees;
```

### Custom Reports

Create views for frequently used reports:

```sql
-- Create view for student performance summary
CREATE VIEW student_performance_summary AS
SELECT 
  s.student_id,
  s.full_name,
  s.class,
  COUNT(g.id) as total_grades,
  ROUND(AVG(g.score * 100.0 / g.max_score), 2) as average_percentage,
  COUNT(CASE WHEN g.score >= g.max_score * 0.9 THEN 1 END) as a_grades
FROM students s
LEFT JOIN grades g ON s.id = g.student_id
GROUP BY s.id, s.student_id, s.full_name, s.class;
```

### Exporting Data

Use browser's print function or:

1. Query the data in Supabase Dashboard
2. Export as CSV
3. Use data analysis tools (Excel, Google Sheets)

---

## Backup and Recovery

### Database Backups

**Automatic Backups** (Supabase):
- Daily automated backups
- Point-in-time recovery available
- Stored for 7-30 days (plan dependent)

**Manual Backups**:

1. **Export Database**:
   ```bash
   # Using Supabase CLI
   supabase db dump -f backup.sql
   ```

2. **Store Backup Securely**:
   - Keep backups off-site
   - Encrypt sensitive data
   - Test restore procedures regularly

### Recovery Procedures

**Restoring from Backup**:

1. **Using Supabase Dashboard**:
   - Navigate to Database > Backups
   - Select backup point
   - Click "Restore"

2. **Using SQL File**:
   ```bash
   # Import backup file
   psql -h db-host -U postgres -d database < backup.sql
   ```

### Data Recovery Best Practices

- Schedule regular backups
- Test restore procedures monthly
- Document recovery steps
- Keep multiple backup copies
- Monitor backup status

---

## Security Management

### Access Control

#### Monitoring User Access

```sql
-- View all active users and their roles
SELECT 
  u.email,
  ur.role,
  ur.created_at as role_assigned
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
ORDER BY ur.created_at DESC;
```

#### Audit Login Activity

Monitor user logins through Supabase Auth logs:
1. Go to Supabase Dashboard
2. Navigate to Authentication > Logs
3. Review login attempts and patterns

### Row Level Security (RLS)

The system uses RLS policies to protect data:

**Verify RLS is Enabled**:
```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false;
```

If any tables show `rowsecurity = false`, enable RLS:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Password Policies

Enforce strong passwords:
- Minimum 8 characters
- Mix of letters, numbers, symbols
- Regular password changes
- No password reuse

### Security Audits

Perform monthly security checks:

1. **Review User Permissions**
   - Check for unnecessary admin access
   - Verify student/teacher role assignments
   - Remove inactive accounts

2. **Check Data Access Logs**
   - Review unusual activity
   - Monitor bulk data exports
   - Track failed login attempts

3. **Update Dependencies**
   - Keep system updated
   - Apply security patches
   - Review vulnerability reports

---

## Troubleshooting Guide

### Common Admin Issues

#### Issue: Cannot Delete Student

**Cause**: Foreign key constraints

**Solution**:
```sql
-- Delete in order (child records first)
DELETE FROM attendance WHERE student_id = 'student-uuid';
DELETE FROM grades WHERE student_id = 'student-uuid';
DELETE FROM fees WHERE student_id = 'student-uuid';
DELETE FROM students WHERE id = 'student-uuid';
```

#### Issue: Teacher Cannot See Their Classes

**Cause**: Classes not assigned or missing role

**Solution**:
1. Verify teacher role: `SELECT * FROM user_roles WHERE user_id = 'teacher-uuid'`
2. Assign classes: `UPDATE classes SET teacher_id = 'teacher-uuid' WHERE name = '10-A'`
3. Check RLS policies are working

#### Issue: Fees Not Calculating Correctly

**Cause**: Multiple fee records or status mismatch

**Solution**:
```sql
-- Check fee records for student
SELECT * FROM fees WHERE student_id = 'student-uuid';

-- Update incorrect status
UPDATE fees 
SET status = 'paid', paid_date = '2025-01-15'
WHERE id = 'fee-uuid';
```

### Database Issues

#### Connection Problems

1. **Verify Environment Variables**:
   - Check `.env` file
   - Confirm Supabase URL and keys are correct
   - Test connection in Supabase dashboard

2. **Check Network**:
   - Firewall rules
   - VPN connections
   - Internet connectivity

#### Performance Issues

**Slow Queries**:
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_students_class ON students(class);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_fees_student_id ON fees(student_id);
CREATE INDEX idx_fees_status ON fees(status);
```

**Database Optimization**:
1. Regular VACUUM operations
2. Update statistics
3. Monitor query performance
4. Optimize complex queries

---

## Maintenance Tasks

### Daily Tasks

- [ ] Review system health dashboard
- [ ] Check for error notifications
- [ ] Monitor user login activity
- [ ] Respond to support requests

### Weekly Tasks

- [ ] Review new user registrations
- [ ] Verify data backup completion
- [ ] Check attendance records
- [ ] Review grade entries
- [ ] Process fee payments

### Monthly Tasks

- [ ] Generate financial reports
- [ ] Review user permissions
- [ ] Clean up old data (if applicable)
- [ ] Update system documentation
- [ ] Perform security audit
- [ ] Test backup restoration

### Semester Tasks

- [ ] Archive completed semester data
- [ ] Promote students to next grade
- [ ] Reset class assignments
- [ ] Generate year-end reports
- [ ] Update fee structures
- [ ] Plan for next semester

### System Maintenance

**Updating the Application**:

1. **Backup Current State**
2. **Test in Development Environment**
3. **Schedule Maintenance Window**
4. **Deploy Updates**
5. **Verify Functionality**
6. **Notify Users**

**Database Maintenance**:

```sql
-- Analyze tables for optimization
ANALYZE students;
ANALYZE teachers;
ANALYZE grades;
ANALYZE fees;

-- Check database size
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Best Practices for Administrators

### Data Management

1. **Regular Backups**: Ensure daily backups are running
2. **Data Validation**: Verify data accuracy regularly
3. **Archive Old Data**: Move historical data to archives
4. **Document Changes**: Keep log of all major changes

### Security

1. **Least Privilege**: Give users minimum required access
2. **Regular Audits**: Review permissions quarterly
3. **Monitor Activity**: Check logs for unusual patterns
4. **Update Regularly**: Keep system and dependencies updated

### Communication

1. **Clear Announcements**: Use announcement system effectively
2. **Training**: Provide user training sessions
3. **Documentation**: Keep user guides updated
4. **Support**: Respond to user issues promptly

### Performance

1. **Monitor Usage**: Track system performance metrics
2. **Optimize Queries**: Improve slow database operations
3. **Scale Resources**: Upgrade if needed
4. **Cache Strategy**: Use React Query caching effectively

---

## Support and Resources

### Getting Help

**Technical Documentation**:
- DATABASE_SETUP.md - Database configuration
- USER_GUIDE.md - End-user documentation
- IMPLEMENTATION_SUMMARY.md - System overview

**Support Channels**:
- Supabase Documentation: https://supabase.com/docs
- React Query Documentation: https://tanstack.com/query/latest
- GitHub Issues: Report bugs and feature requests

### Training Resources

**Administrator Training**:
- System overview video (to be created)
- Database management guide (this document)
- User management procedures
- Report generation tutorials

**End-User Training**:
- Teacher onboarding guide
- Student orientation materials
- Parent portal instructions

---

## Conclusion

As a system administrator, you play a crucial role in maintaining the EduFlow Suite. This manual provides the foundation for effective system management. Regular maintenance, proactive monitoring, and adherence to best practices will ensure smooth operations.

**Remember**: Document all changes, maintain regular backups, and prioritize security in all operations.

For additional assistance or clarification, refer to the technical documentation or contact the development team.

---

**Document**: ADMIN_MANUAL.md  
**Version**: 1.0  
**Last Updated**: December 2025  
**Target Audience**: System Administrators
