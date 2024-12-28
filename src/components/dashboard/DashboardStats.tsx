import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Users, Building2, Calendar, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  isRTL: boolean;
  todayStats: {
    activities: number;
    connected: number;
    connectedUsers: number;
  };
}

export function DashboardStats({ isRTL, todayStats }: DashboardStatsProps) {
  const { data: analyticsData } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Get total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Get total companies count
      const { count: companiesCount } = await supabase
        .from('companies')
        .select('*', { count: 'exact' });

      // Get total tasks count
      const { count: tasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' });

      // Get total clients count
      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact' });

      return {
        usersCount: usersCount || 0,
        companiesCount: companiesCount || 0,
        tasksCount: tasksCount || 0,
        clientsCount: clientsCount || 0
      };
    },
    refetchInterval: 30000
  });

  const stats = [
    {
      title: isRTL ? 'إجمالي المستخدمين' : 'Total Users',
      value: analyticsData?.usersCount || 0,
      icon: Users,
      color: 'blue'
    },
    {
      title: isRTL ? 'إجمالي الشركات' : 'Total Companies',
      value: analyticsData?.companiesCount || 0,
      icon: Building2,
      color: 'green'
    },
    {
      title: isRTL ? 'إجمالي المهام' : 'Total Tasks',
      value: analyticsData?.tasksCount || 0,
      icon: Calendar,
      color: 'purple'
    },
    {
      title: isRTL ? 'إجمالي العملاء' : 'Total Clients',
      value: analyticsData?.clientsCount || 0,
      icon: TrendingUp,
      color: 'yellow'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={cn(
            `bg-${stat.color}-50 dark:bg-gray-800`,
            "w-[75%] sm:w-full mx-auto" // Reduced width to 75% on mobile
          )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={cn(
                "text-sm font-medium",
                isRTL && "font-cairo"
              )}>
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 text-${stat.color}-500`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}