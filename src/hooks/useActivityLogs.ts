import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActivityLog } from "@/types/activityLog";

export function useActivityLogs(filters?: {
  entity_type?: string;
  action_type?: string;
  user_id?: string;
  from_date?: Date;
  to_date?: Date;
}) {
  return useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar
          )
        `)
        .order('created_at', { ascending: false });

      if (filters?.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }
      if (filters?.action_type) {
        query = query.eq('action_type', filters.action_type);
      }
      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters?.from_date) {
        query = query.gte('created_at', filters.from_date.toISOString());
      }
      if (filters?.to_date) {
        query = query.lte('created_at', filters.to_date.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
      }

      return data as (ActivityLog & { 
        profiles: { 
          full_name: string; 
          avatar: string | null;
        }; 
      })[];
    }
  });
}