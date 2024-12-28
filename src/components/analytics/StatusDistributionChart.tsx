import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

interface Props {
  isRTL: boolean;
}

const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#8B44F7'];

export function StatusDistributionChart({ isRTL }: Props) {
  // Subscribe to real-time updates
  useRealtimeSubscription('clients', ['clients']);

  const { data = [], isLoading } = useQuery({
    queryKey: ['client-status-distribution'],
    queryFn: async () => {
      const statuses = ['new', 'sold', 'pending', 'cancelled'];
      const statusCounts = await Promise.all(
        statuses.map(async (status) => {
          const { count } = await supabase
            .from('clients')
            .select('*', { count: 'exact' })
            .eq('status', status);
          
          return {
            name: status === 'new' ? 'عملاء جدد' :
                  status === 'sold' ? 'تم البيع' :
                  status === 'pending' ? 'قيد' : 'ملغي',
            value: count || 0
          };
        })
      );
      
      return statusCounts;
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className={cn(
            "text-sm font-medium text-gray-900 dark:text-gray-100",
            isRTL && "font-cairo"
          )}>
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {`${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className={cn(
          "text-xl font-semibold text-gray-900",
          isRTL && "font-cairo text-right"
        )}>
          {isRTL ? "توزيع حالات العملاء" : "Client Status Distribution"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} ${value}`}
                labelLine={true}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}