import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { DayStatsTooltip } from "./DayStatsTooltip";
import type { DayData } from "./types";

interface DailyTasksChartProps {
  chartData: DayData[];
  isRTL: boolean;
}

export function DailyTasksChart({ chartData, isRTL }: DailyTasksChartProps) {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis 
            dataKey="name" 
            reversed={isRTL}
            tick={{ 
              fill: 'currentColor',
              fontSize: 12,
              fontFamily: isRTL ? 'Cairo' : 'inherit'
            }}
          />
          <Tooltip 
            content={({ payload }) => (
              <div className={cn(
                "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700",
                "text-sm",
                isRTL && "text-right font-cairo"
              )}>
                {payload && payload[0] && (
                  <DayStatsTooltip 
                    payload={payload[0].payload}
                    isRTL={isRTL}
                  />
                )}
              </div>
            )}
          />
          <Bar 
            name="completed"
            dataKey="completed" 
            fill="#22C55E" 
            radius={[4, 4, 0, 0]}
            stackId="stack" 
          />
          <Bar 
            name="pending"
            dataKey="pending" 
            fill="#EAB308" 
            radius={[4, 4, 0, 0]}
            stackId="stack" 
          />
          <Bar 
            name="cancelled"
            dataKey="cancelled" 
            fill="#EF4444" 
            radius={[4, 4, 0, 0]}
            stackId="stack" 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}