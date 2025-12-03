import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Teacher = Tables<'teachers'>;
type TeacherInsert = TablesInsert<'teachers'>;
type TeacherUpdate = TablesUpdate<'teachers'>;

// Fetch all teachers
export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('full_name');
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch a single teacher by ID
export const useTeacher = (id: string) => {
  return useQuery({
    queryKey: ['teachers', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          classes (*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Add a new teacher
export const useAddTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (teacher: TeacherInsert) => {
      const { data, error } = await supabase
        .from('teachers')
        .insert(teacher)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

// Update a teacher
export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TeacherUpdate }) => {
      const { data, error } = await supabase
        .from('teachers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

// Delete a teacher
export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};
