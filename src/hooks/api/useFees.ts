import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Fee = Tables<'fees'>;
type FeeInsert = TablesInsert<'fees'>;
type FeeUpdate = TablesUpdate<'fees'>;

// Fetch all fees
export const useFees = () => {
  return useQuery({
    queryKey: ['fees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fees')
        .select(`
          *,
          students (
            full_name,
            student_id,
            class
          )
        `)
        .order('due_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Fetch fees for a specific student
export const useStudentFees = (studentId: string) => {
  return useQuery({
    queryKey: ['fees', 'student', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('student_id', studentId)
        .order('due_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentId,
  });
};

// Fetch recent payments
export const useRecentPayments = (limit: number = 10) => {
  return useQuery({
    queryKey: ['fees', 'recent-payments', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fees')
        .select(`
          *,
          students (
            full_name,
            student_id
          )
        `)
        .eq('status', 'paid')
        .not('paid_date', 'is', null)
        .order('paid_date', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });
};

// Add a new fee
export const useAddFee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (fee: FeeInsert) => {
      const { data, error } = await supabase
        .from('fees')
        .insert(fee)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Update a fee (e.g., mark as paid)
export const useUpdateFee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: FeeUpdate }) => {
      const { data, error } = await supabase
        .from('fees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Delete a fee
export const useDeleteFee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('fees')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};
