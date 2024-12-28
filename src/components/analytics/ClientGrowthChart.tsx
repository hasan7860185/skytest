import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

interface Props {
  isRTL: boolean;
}

export function ClientGrowthChart({ isRTL }: Props) {
  // Subscribe to real-time updates
  useRealtimeSubscription('clients', ['clients']);

  const { data = [], isLoading } = useQuery({
    queryKey: ['client-growth'],
    queryFn: async () => {
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
          start: new Date(date.getFullYear(), date.getMonth(), 1),
          end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
          month: date.toLocaleDateString('ar-EG', { month: 'long' })
        };
      }).reverse();

      const monthlyData = await Promise.all(
        months.map(async ({ start, end, month }) => {
          const { count: clients } = await supabase
            .from('clients')
            .select('*', { count: 'exact' })
            .gte('created_at', start.toISOString())
            .lt('created_at', end.toISOString());

          // Calculate target (example: 20% more than previous month)
          const target = Math.round((clients || 0) * 1.2);

          return {
            month,
            clients: clients || 0,
            target
          };
        })
      );

      return monthlyData;
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={cn(
          "text-xl font-semibold text-gray-900",
          isRTL && "font-cairo"
        )}>
          {isRTL ? "أداء المبيعات" : "Sales Performance"}
        </CardTitle>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-gray-200 rounded-md px-2 py-1 text-sm font-cairo">
            <option>جميع العقارات</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={0}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis 
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#6B7280',
                  fontSize: 12,
                  fontFamily: 'Cairo'
                }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#6B7280',
                  fontSize: 12
                }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Bar 
                dataKey="clients" 
                fill="#4285F4"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar 
                dataKey="target" 
                fill="#E5E7EB"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}