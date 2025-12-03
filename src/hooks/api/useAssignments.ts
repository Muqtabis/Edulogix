import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Assignment = Tables<'assignments'>;
type AssignmentInsert = TablesInsert<'assignments'>;
type AssignmentUpdate = TablesUpdate<'assignments'>;

// Fetch all assignments
export const useAssignments = () => {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          teachers (
            full_name
          )
        `)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch a single assignment by ID
export const useAssignment = (id: string) => {
  return useQuery({
    queryKey: ['assignments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          teachers (
            full_name,
            email
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Fetch assignments for a specific class
export const useClassAssignments = (className: string) => {
  return useQuery({
    queryKey: ['assignments', 'class', className],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          teachers (
            full_name
          )
        `)
        .eq('class', className)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!className,
  });
};

// Add a new assignment
export const useAddAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignment: AssignmentInsert) => {
      const { data, error } = await supabase
        .from('assignments')
        .insert(assignment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};

// Update an assignment
export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AssignmentUpdate }) => {
      const { data, error } = await supabase
        .from('assignments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};

// Delete an assignment
export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};
