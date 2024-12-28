import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ActivityChartProps {
  data: Array<{
    hour: string;
    tasks: number;
    meetings: number;
  }>;
  isRTL: boolean;
}

export function ActivityChart({ data, isRTL }: ActivityChartProps) {
  const { t } = useTranslation();

  return (
    <Card className="bg-gradient-to-br from-background/50 to-background border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className={cn(
          "text-lg font-medium",
          isRTL && "font-cairo"
        )}>
          {isRTL ? 'النشاط اليومي' : 'Daily Activity'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="hour" 
                reversed={isRTL}
                tick={{ 
                  fill: 'currentColor',
                  fontSize: 12,
                  fontFamily: isRTL ? 'Cairo' : 'inherit'
                }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                tick={{ fill: 'currentColor' }}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  textAlign: isRTL ? 'right' : 'left',
                  direction: isRTL ? 'rtl' : 'ltr',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="#8B5CF6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTasks)"
                name={isRTL ? 'المهام' : 'Tasks'}
              />
              <Area
                type="monotone"
                dataKey="meetings"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMeetings)"
                name={isRTL ? 'الاجتماعات' : 'Meetings'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}