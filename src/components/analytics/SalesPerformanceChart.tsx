import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ClientData {
  id: string;
  created_at: string;
  status: string;
}

interface Props {
  data: ClientData[];
}

export const SalesPerformanceChart = ({ data }: Props) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['sales-performance'],
    queryFn: async () => {
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const { data: clients, error } = await supabase
          .from('clients')
          .select('created_at, status')
          .gte('created_at', sixMonthsAgo.toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Group by month and count sales (status = 'sold')
        const monthlyData = (clients || []).reduce((acc: Record<string, { sales: number, target: number }>, client) => {
          const date = new Date(client.created_at);
          const monthKey = format(date, 'MMMM', { locale: isRTL ? ar : undefined });
          
          if (!acc[monthKey]) {
            acc[monthKey] = { sales: 0, target: 50 }; // Default target of 50 per month
          }
          
          if (client.status === 'sold') {
            acc[monthKey].sales += 1;
          }
          
          return acc;
        }, {});

        return Object.entries(monthlyData).map(([month, data]) => ({
          month,
          ...data
        }));
      } catch (error: any) {
        console.error('Error fetching sales data:', error);
        toast.error(isRTL ? 'حدث خطأ أثناء تحميل بيانات المبيعات' : 'Error loading sales data');
        return [];
      }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ 
              fill: 'currentColor',
              fontSize: 12,
              fontFamily: isRTL ? 'Cairo' : 'inherit'
            }}
          />
          <YAxis />
          <Tooltip />
          <Bar 
            dataKey="sales" 
            fill="#4096ff" 
            name={isRTL ? 'المبيعات' : 'Sales'} 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="target" 
            fill="#E5E7EB" 
            name={isRTL ? 'المستهدف' : 'Target'} 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};