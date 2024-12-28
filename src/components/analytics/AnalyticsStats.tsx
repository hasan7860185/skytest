import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { TrendingUp, Users, Building2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StatsProps {
  isRTL: boolean;
}

export function AnalyticsStats({ isRTL }: StatsProps) {
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      try {
        console.log('Fetching analytics data...');
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Get tasks for the current month - now using created_at instead of due_date
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('id')
          .gte('created_at', startOfMonth.toISOString());

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
          .gte('created_at', startOfMonth.toISOString());

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

  const stats = [
    {
      title: isRTL ? 'إجمالي المبيعات' : 'Total Sales',
      value: analyticsData?.totalSales || 0,
      change: '+12.5%',
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-50'
    },
    {
      title: isRTL ? 'العملاء الجدد' : 'New Clients',
      value: analyticsData?.newClients || 0,
      change: '+8.2%',
      icon: Users,
      color: 'green',
      bgColor: 'bg-green-50'
    },
    {
      title: isRTL ? 'العقارات' : 'Properties',
      value: analyticsData?.properties || 0,
      change: '-2.3%',
      icon: Building2,
      color: 'purple',
      bgColor: 'bg-purple-50'
    },
    {
      title: isRTL ? 'المواعيد هذا الشهر' : 'Appointments This Month',
      value: analyticsData?.appointments || 0,
      change: '+15.8%',
      icon: Calendar,
      color: 'yellow',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "text-sm text-gray-500",
                  isRTL && "font-cairo"
                )}>{stat.title}</p>
                <p className={cn(
                  "text-2xl font-bold text-gray-900",
                  isRTL && "font-cairo"
                )}>{stat.value}</p>
              </div>
              <div className={cn(
                "p-3 rounded-lg",
                stat.bgColor
              )}>
                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-${stat.change.startsWith('+') ? 'green' : 'red'}-500 text-sm`}>
                {stat.change}
              </span>
              <span className={cn(
                "text-gray-500 text-sm",
                isRTL && "font-cairo"
              )}>
                {isRTL ? ' مقارنة بالفترة السابقة' : ' vs previous period'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}