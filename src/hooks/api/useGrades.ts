import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Grade = Tables<'grades'>;
type GradeInsert = TablesInsert<'grades'>;
type GradeUpdate = TablesUpdate<'grades'>;

// Fetch all grades
export const useGrades = () => {
  return useQuery({
    queryKey: ['grades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          students (
            full_name,
            student_id,
            class
          ),
          teachers (
            full_name
          )
        `)
        .order('exam_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch grades for a specific student
export const useStudentGrades = (studentId: string) => {
  return useQuery({
    queryKey: ['grades', 'student', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          teachers (
            full_name
          )
        `)
        .eq('student_id', studentId)
        .order('exam_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentId,
  });
};

// Add a new grade
export const useAddGrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (grade: GradeInsert) => {
      const { data, error } = await supabase
        .from('grades')
        .insert(grade)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
};

// Update a grade
export const useUpdateGrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: GradeUpdate }) => {
      const { data, error } = await supabase
        .from('grades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
};

// Delete a grade
export const useDeleteGrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
};
