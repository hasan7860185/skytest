import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface DailyStats {
  date: Date;
  count: number;
  users: { id: string; name: string; count: number }[];
}

interface MessengerStatsChartProps {
  stats: {
    dailyStats: DailyStats[];
  } | null;
}

export function MessengerStatsChart({ stats }: MessengerStatsChartProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!stats) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <p className="text-muted-foreground">{isRTL ? 'لا توجد بيانات' : 'No data'}</p>
      </div>
    );
  }

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={stats.dailyStats}>
          <XAxis 
            dataKey={(data) => format(data.date, 'd')}
            reversed={isRTL}
            tick={{ 
              fill: 'currentColor',
              fontSize: 12,
              fontFamily: isRTL ? 'Cairo' : 'inherit'
            }}
          />
          <Tooltip 
            contentStyle={{ 
              textAlign: isRTL ? 'right' : 'left',
              direction: isRTL ? 'rtl' : 'ltr',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px'
            }}
            formatter={(value: number, name: string, props: any) => {
              const { date, users } = props.payload;
              const formattedDate = format(date, 'EEEE, d MMMM yyyy', {
                locale: isRTL ? ar : undefined
              });

              const userDetails = users.map((user: { name: string; count: number }) => 
                `${user.name}: ${user.count} ${t("dashboard.sent")}`
              ).join('\n');

              return [
                [
                  `${value} ${t("dashboard.sent")}`,
                  formattedDate,
                  '',
                  isRTL ? 'المستخدمين:' : 'Users:',
                  userDetails
                ].join('\n'),
                ''
              ];
            }}
            labelFormatter={() => t("dashboard.messenger")}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}