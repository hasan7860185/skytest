import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAnalyticsData = () => {
  return useQuery({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      try {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // First get the user's profile to get role and company_id
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No authenticated user');

        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('role, company_id')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          throw profileError;
        }

        // Get tasks based on user role and company
        const tasksQuery = supabase
          .from('tasks')
          .select('id, created_by, assigned_to')
          .gte('created_at', firstDayOfMonth.toISOString());

        const { data: tasks, error: tasksError } = await tasksQuery;

        if (tasksError) {
          console.error('Error fetching tasks:', tasksError);
          throw tasksError;
        }

        // Get total properties count
        const { data: properties, error: propertiesError } = await supabase
          .from('properties')
          .select('id');

        if (propertiesError) {
          console.error('Error fetching properties:', propertiesError);
          throw propertiesError;
        }

        // Get new clients this month
        const { data: newClients, error: newClientsError } = await supabase
          .from('clients')
          .select('id')
          .gte('created_at', firstDayOfMonth.toISOString());

        if (newClientsError) {
          console.error('Error fetching new clients:', newClientsError);
          throw newClientsError;
        }

        // Get total sales (clients with 'sold' status)
        const { data: sales, error: salesError } = await supabase
          .from('clients')
          .select('id')
          .eq('status', 'sold');

        if (salesError) {
          console.error('Error fetching sales:', salesError);
          throw salesError;
        }

        return {
          appointments: tasks?.length || 0,
          properties: properties?.length || 0,
          newClients: newClients?.length || 0,
          totalSales: sales?.length || 0
        };
      } catch (error: any) {
        console.error('Error in analytics data fetch:', error);
        toast.error('Error fetching analytics data');
        throw error;
      }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};