import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface UserGrowthChartProps {
  data: Array<{
    month: string;
    users: number;
    clients: number;
  }>;
  isRTL: boolean;
}

export function UserGrowthChart({ data, isRTL }: UserGrowthChartProps) {
  const { t } = useTranslation();

  return (
    <Card className="bg-gradient-to-br from-background/50 to-background border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className={cn(
          "text-lg font-medium",
          isRTL && "font-cairo"
        )}>
          {isRTL ? 'نمو المستخدمين والعملاء' : 'Users & Clients Growth'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
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
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#3B82F6" 
                name={isRTL ? 'المستخدمين' : 'Users'} 
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="clients" 
                stroke="#10B981" 
                name={isRTL ? 'العملاء' : 'Clients'} 
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}