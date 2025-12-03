-- Seed data for EduFlow Suite

-- Insert sample teachers
INSERT INTO public.teachers (teacher_id, full_name, email, subject, phone, qualification) VALUES
  ('TCH001', 'Dr. Sarah Mitchell', 's.mitchell@school.edu', 'Mathematics', '+1 555-1001', 'PhD in Mathematics'),
  ('TCH002', 'Mr. James Anderson', 'j.anderson@school.edu', 'Physics', '+1 555-1002', 'MSc in Physics'),
  ('TCH003', 'Ms. Emily Roberts', 'e.roberts@school.edu', 'English', '+1 555-1003', 'MA in English Literature'),
  ('TCH004', 'Mr. David Lee', 'd.lee@school.edu', 'Chemistry', '+1 555-1004', 'MSc in Chemistry'),
  ('TCH005', 'Dr. Lisa Chen', 'l.chen@school.edu', 'Biology', '+1 555-1005', 'PhD in Biology')
ON CONFLICT (teacher_id) DO NOTHING;

-- Insert sample students
INSERT INTO public.students (student_id, full_name, email, class, parent_contact, date_of_birth, address) VALUES
  ('STU001', 'Emma Thompson', 'emma.t@school.edu', '10-A', '+1 555-0101', '2008-03-15', '123 Oak Street'),
  ('STU002', 'Liam Johnson', 'liam.j@school.edu', '10-A', '+1 555-0102', '2008-05-22', '456 Maple Avenue'),
  ('STU003', 'Olivia Williams', 'olivia.w@school.edu', '10-B', '+1 555-0103', '2008-07-10', '789 Pine Road'),
  ('STU004', 'Noah Brown', 'noah.b@school.edu', '10-B', '+1 555-0104', '2008-02-28', '321 Elm Street'),
  ('STU005', 'Ava Davis', 'ava.d@school.edu', '11-A', '+1 555-0105', '2007-09-14', '654 Cedar Lane'),
  ('STU006', 'Ethan Miller', 'ethan.m@school.edu', '11-A', '+1 555-0106', '2007-11-03', '987 Birch Court'),
  ('STU007', 'Sophia Wilson', 'sophia.w@school.edu', '11-B', '+1 555-0107', '2007-04-19', '147 Willow Drive'),
  ('STU008', 'Mason Taylor', 'mason.t@school.edu', '11-B', '+1 555-0108', '2007-12-25', '258 Spruce Way'),
  ('STU009', 'Isabella Martinez', 'isabella.m@school.edu', '10-A', '+1 555-0109', '2008-06-08', '369 Ash Boulevard'),
  ('STU010', 'Lucas Garcia', 'lucas.g@school.edu', '10-B', '+1 555-0110', '2008-08-30', '741 Cherry Circle')
ON CONFLICT (student_id) DO NOTHING;

-- Get teacher IDs for classes
DO $$
DECLARE
  teacher_math_id UUID;
  teacher_physics_id UUID;
  teacher_english_id UUID;
  teacher_chemistry_id UUID;
  teacher_biology_id UUID;
BEGIN
  -- Get teacher IDs
  SELECT id INTO teacher_math_id FROM public.teachers WHERE teacher_id = 'TCH001';
  SELECT id INTO teacher_physics_id FROM public.teachers WHERE teacher_id = 'TCH002';
  SELECT id INTO teacher_english_id FROM public.teachers WHERE teacher_id = 'TCH003';
  SELECT id INTO teacher_chemistry_id FROM public.teachers WHERE teacher_id = 'TCH004';
  SELECT id INTO teacher_biology_id FROM public.teachers WHERE teacher_id = 'TCH005';

  -- Insert sample classes
  INSERT INTO public.classes (name, subject, teacher_id, room, schedule) VALUES
    ('10-A', 'Mathematics', teacher_math_id, 'Room 101', '{"monday": "08:00-09:00", "wednesday": "10:00-11:00", "friday": "14:00-15:00"}'::jsonb),
    ('10-B', 'Mathematics', teacher_math_id, 'Room 101', '{"monday": "09:15-10:15", "thursday": "08:00-09:00"}'::jsonb),
    ('11-A', 'Mathematics', teacher_math_id, 'Room 203', '{"tuesday": "11:00-12:00", "friday": "08:00-09:00"}'::jsonb),
    ('10-A', 'Physics', teacher_physics_id, 'Lab 1', '{"tuesday": "08:00-09:00", "thursday": "10:00-11:00"}'::jsonb),
    ('11-A', 'Physics', teacher_physics_id, 'Lab 1', '{"monday": "10:00-11:00", "wednesday": "14:00-15:00"}'::jsonb),
    ('11-B', 'Physics', teacher_physics_id, 'Lab 1', '{"wednesday": "08:00-09:00", "friday": "10:00-11:00"}'::jsonb),
    ('10-A', 'English', teacher_english_id, 'Room 205', '{"monday": "11:00-12:00", "wednesday": "08:00-09:00"}'::jsonb),
    ('10-B', 'English', teacher_english_id, 'Room 205', '{"tuesday": "10:00-11:00", "thursday": "14:00-15:00"}'::jsonb),
    ('11-B', 'English', teacher_english_id, 'Room 205', '{"monday": "14:00-15:00", "friday": "11:00-12:00"}'::jsonb),
    ('10-B', 'Chemistry', teacher_chemistry_id, 'Lab 2', '{"monday": "14:00-15:00", "wednesday": "10:00-11:00"}'::jsonb),
    ('11-A', 'Chemistry', teacher_chemistry_id, 'Lab 2', '{"tuesday": "08:00-09:00", "thursday": "11:00-12:00"}'::jsonb),
    ('11-B', 'Chemistry', teacher_chemistry_id, 'Lab 2', '{"wednesday": "11:00-12:00", "friday": "08:00-09:00"}'::jsonb),
    ('10-A', 'Biology', teacher_biology_id, 'Lab 3', '{"tuesday": "14:00-15:00", "thursday": "08:00-09:00"}'::jsonb),
    ('10-B', 'Biology', teacher_biology_id, 'Lab 3', '{"monday": "10:00-11:00", "wednesday": "14:00-15:00"}'::jsonb),
    ('11-A', 'Biology', teacher_biology_id, 'Lab 3', '{"tuesday": "10:00-11:00", "friday": "14:00-15:00"}'::jsonb)
  ON CONFLICT DO NOTHING;
END $$;

-- Insert sample grades
DO $$
DECLARE
  student_rec RECORD;
  teacher_id UUID;
BEGIN
  -- Get a teacher ID for grades
  SELECT id INTO teacher_id FROM public.teachers WHERE teacher_id = 'TCH001' LIMIT 1;

  -- Insert grades for each student
  FOR student_rec IN SELECT id FROM public.students LOOP
    INSERT INTO public.grades (student_id, subject, score, max_score, exam_type, exam_date, teacher_id) VALUES
      (student_rec.id, 'Mathematics', 85 + (random() * 15)::int, 100, 'Quiz', CURRENT_DATE - INTERVAL '10 days', teacher_id),
      (student_rec.id, 'Physics', 80 + (random() * 20)::int, 100, 'Test', CURRENT_DATE - INTERVAL '8 days', teacher_id),
      (student_rec.id, 'English', 88 + (random() * 12)::int, 100, 'Essay', CURRENT_DATE - INTERVAL '5 days', teacher_id),
      (student_rec.id, 'Chemistry', 82 + (random() * 18)::int, 100, 'Lab Report', CURRENT_DATE - INTERVAL '3 days', teacher_id),
      (student_rec.id, 'Biology', 87 + (random() * 13)::int, 100, 'Midterm', CURRENT_DATE - INTERVAL '1 day', teacher_id)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Insert sample fees
DO $$
DECLARE
  student_rec RECORD;
  fee_statuses TEXT[] := ARRAY['paid', 'pending', 'overdue'];
  random_status TEXT;
BEGIN
  FOR student_rec IN SELECT id FROM public.students LOOP
    -- Safely get random status (1-based array indexing, so 1, 2, or 3)
    random_status := fee_statuses[(floor(random() * 3)::int) + 1];
    
    INSERT INTO public.fees (student_id, amount, description, due_date, paid_date, status) VALUES
      (
        student_rec.id, 
        2400, 
        'Semester Fee', 
        CURRENT_DATE + INTERVAL '30 days',
        CASE WHEN random_status = 'paid' THEN CURRENT_DATE - INTERVAL '5 days' ELSE NULL END,
        random_status
      )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Insert sample announcements (need to use a system user or handle author_id being null)
INSERT INTO public.announcements (title, content, target_audience) VALUES
  ('Parent-Teacher Meeting', 'Annual PTM scheduled for next Friday at 3 PM. All parents are requested to attend.', ARRAY['admin', 'teacher', 'student']),
  ('Science Fair 2024', 'Registration for the annual Science Fair is now open. Submit your projects by Feb 15.', ARRAY['student', 'teacher']),
  ('Winter Break Schedule', 'School will remain closed from Feb 1-5 for winter break.', ARRAY['admin', 'teacher', 'student']),
  ('Exam Schedule Released', 'The final exam schedule has been published. Please check the notice board for details.', ARRAY['student', 'teacher']),
  ('Library Hours Extended', 'Library will now be open until 8 PM on weekdays to support exam preparation.', ARRAY['student'])
ON CONFLICT DO NOTHING;

-- Insert sample assignments
DO $$
DECLARE
  teacher_id UUID;
BEGIN
  SELECT id INTO teacher_id FROM public.teachers WHERE teacher_id = 'TCH001' LIMIT 1;

  INSERT INTO public.assignments (title, description, subject, class, due_date, teacher_id) VALUES
    ('Algebra Problem Set', 'Complete exercises 1-20 from Chapter 5', 'Mathematics', '10-A', CURRENT_DATE + INTERVAL '7 days', teacher_id),
    ('Physics Lab Report', 'Write a detailed report on the pendulum experiment', 'Physics', '10-A', CURRENT_DATE + INTERVAL '10 days', teacher_id),
    ('Book Review', 'Write a 500-word review of "To Kill a Mockingbird"', 'English', '10-B', CURRENT_DATE + INTERVAL '14 days', teacher_id),
    ('Chemistry Homework', 'Balance the chemical equations on worksheet 3', 'Chemistry', '11-A', CURRENT_DATE + INTERVAL '5 days', teacher_id),
    ('Biology Project', 'Create a poster on the human digestive system', 'Biology', '11-B', CURRENT_DATE + INTERVAL '21 days', teacher_id)
  ON CONFLICT DO NOTHING;
END $$;
