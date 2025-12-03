import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Attendance = Tables<'attendance'>;
type AttendanceInsert = TablesInsert<'attendance'>;
type AttendanceUpdate = TablesUpdate<'attendance'>;

// Fetch all attendance records
export const useAttendance = () => {
  return useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          students (
            full_name,
            student_id,
            class
          ),
          classes (
            name,
            subject
          ),
          teachers:marked_by (
            full_name
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch attendance for a specific student
export const useStudentAttendance = (studentId: string) => {
  return useQuery({
    queryKey: ['attendance', 'student', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          classes (
            name,
            subject
          )
        `)
        .eq('student_id', studentId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentId,
  });
};

// Fetch attendance for a specific date
export const useAttendanceByDate = (date: string) => {
  return useQuery({
    queryKey: ['attendance', 'date', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          students (
            full_name,
            student_id,
            class
          )
        `)
        .eq('date', date)
        .order('students(full_name)');
      
      if (error) throw error;
      return data;
    },
    enabled: !!date,
  });
};

// Add a new attendance record
export const useAddAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (attendance: AttendanceInsert) => {
      const { data, error } = await supabase
        .from('attendance')
        .insert(attendance)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

// Update an attendance record
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AttendanceUpdate }) => {
      const { data, error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

// Delete an attendance record
export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};
