import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DailyStats {
  date: Date;
  count: number;
  users: { id: string; name: string; count: number }[];
}

interface MessengerStats {
  dailyStats: DailyStats[];
}

export function useMessengerStats() {
  const [stats, setStats] = useState<MessengerStats | null>(null);

  const { data: messengerStats, isLoading } = useQuery({
    queryKey: ["messengerStats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get daily Facebook contacts for the last 7 days
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return date;
      }).reverse();

      // Fetch client actions and profiles separately
      const { data: clientActions } = await supabase
        .from('client_actions')
        .select('created_at, created_by')
        .eq('action_type', 'facebookContact');

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name');

      console.log('Messenger Stats - Raw Data:', { clientActions, profiles });

      const dailyData = last7Days.map(date => {
        const dayActions = (clientActions || []).filter(action => {
          const actionDate = new Date(action.created_at);
          return actionDate.toDateString() === date.toDateString();
        });

        // Group actions by user
        const userStats = dayActions.reduce((acc, action) => {
          const userId = action.created_by;
          const userProfile = profiles?.find(p => p.id === userId);
          const userName = userProfile?.full_name || 'Unknown User';
          
          const existingUser = acc.find(u => u.id === userId);
          if (existingUser) {
            existingUser.count++;
          } else {
            acc.push({ id: userId, name: userName, count: 1 });
          }
          return acc;
        }, [] as { id: string; name: string; count: number }[]);

        return {
          date,
          count: dayActions.length,
          users: userStats
        };
      });

      console.log('Messenger Stats - Processed Data:', dailyData);

      return {
        dailyStats: dailyData
      };
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  useEffect(() => {
    if (messengerStats) {
      setStats(messengerStats);
    }
  }, [messengerStats]);

  return { stats, isLoading };
}