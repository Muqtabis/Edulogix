import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Student = Tables<'students'>;
type StudentInsert = TablesInsert<'students'>;
type StudentUpdate = TablesUpdate<'students'>;

// Fetch all students with their fee information
export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          fees (
            id,
            amount,
            status,
            due_date,
            paid_date
          )
        `)
        .order('full_name');
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch a single student by ID
export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ['students', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          fees (*),
          grades (*),
          attendance (*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Add a new student
export const useAddStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (student: StudentInsert) => {
      const { data, error } = await supabase
        .from('students')
        .insert(student)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Update a student
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: StudentUpdate }) => {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Delete a student
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Get students with unpaid fees
export const useStudentsWithUnpaidFees = () => {
  return useQuery({
    queryKey: ['students', 'unpaid-fees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          fees!inner (
            id,
            amount,
            status,
            due_date
          )
        `)
        .in('fees.status', ['pending', 'overdue'])
        .order('full_name');
      
      if (error) throw error;
      return data;
    },
  });
};
