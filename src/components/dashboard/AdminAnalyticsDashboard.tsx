import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Users, Building2, Calendar, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { UserGrowthChart } from "./charts/UserGrowthChart";
import { ActivityChart } from "./charts/ActivityChart";

export function AdminAnalyticsDashboard() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Query for growth data
  const { data: growthData = [], refetch } = useQuery({
    queryKey: ['admin-growth-data'],
    queryFn: async () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Get monthly user counts
      const { data: users } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString());

      // Get monthly client counts
      const { data: clients } = await supabase
        .from('clients')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString());

      // Process data by month
      const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthUsers = users?.filter(u => {
          const createdAt = new Date(u.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length || 0;

        const monthClients = clients?.filter(c => {
          const createdAt = new Date(c.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length || 0;

        return {
          month: date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'long' }),
          users: monthUsers,
          clients: monthClients
        };
      }).reverse();

      return monthlyData;
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Query for daily activity data
  const { data: activityData = [] } = useQuery({
    queryKey: ['admin-activity-data'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get tasks for today
      const { data: tasks } = await supabase
        .from('tasks')
        .select('created_at')
        .gte('created_at', today.toISOString());

      // Generate hourly data
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        const hourStart = new Date(today);
        hourStart.setHours(i);
        const hourEnd = new Date(hourStart);
        hourEnd.setHours(i + 1);

        const tasksInHour = tasks?.filter(t => {
          const taskDate = new Date(t.created_at);
          return taskDate >= hourStart && taskDate < hourEnd;
        }).length || 0;

        // Simulated meetings data (you can replace this with real data)
        const meetingsInHour = Math.floor(Math.random() * 5);

        return {
          hour: `${hour}:00`,
          tasks: tasksInHour,
          meetings: meetingsInHour
        };
      });
    },
    refetchInterval: 30000
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const profilesChannel = supabase.channel('profiles_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => refetch()
      )
      .subscribe();

    const clientsChannel = supabase.channel('clients_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients' }, 
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(clientsChannel);
    };
  }, [refetch]);

  return (
    <div className="space-y-6">
      <h2 className={cn(
        "text-2xl font-bold",
        isRTL && "font-cairo text-right"
      )}>
        {isRTL ? 'لوحة تحكم المدير' : 'Admin Dashboard'}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart data={growthData} isRTL={isRTL} />
        <ActivityChart data={activityData} isRTL={isRTL} />
      </div>
    </div>
  );
}