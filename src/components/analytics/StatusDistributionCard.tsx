import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from "@/lib/utils";

interface Props {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ['#4096ff', '#52c41a', '#faad14', '#eb2f96', '#ff4d4f'];

export const StatusDistributionCard = ({ data }: Props) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

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
            {`${payload[0].value} (${((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  const totalClients = data.reduce((sum, item) => sum + item.value, 0);
  const summaryText = isRTL
    ? `إجمالي العملاء: ${totalClients} عميل`
    : `Total Clients: ${totalClients}`;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className={cn(
          "text-xl font-semibold text-gray-900 dark:text-gray-100",
          isRTL && "font-cairo text-right"
        )}>
          {t("dashboard.analytics.statusDistribution")}
        </CardTitle>
        <p className={cn(
          "text-sm text-gray-600 dark:text-gray-300",
          isRTL && "font-cairo text-right"
        )}>
          {summaryText}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};