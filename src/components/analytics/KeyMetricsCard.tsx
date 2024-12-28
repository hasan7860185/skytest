import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const KeyMetricsCard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: metricsData, isLoading } = useQuery({
    queryKey: ['keyMetrics'],
    queryFn: async () => {
      // Get all clients
      const { data: clients } = await supabase
        .from('clients')
        .select('status, budget')
        .not('budget', 'is', null);

      if (!clients) return { conversionRate: 0, averageProjectValue: 0 };

      // Calculate conversion rate (clients with 'sold' status)
      const soldClients = clients.filter(client => client.status === 'sold').length;
      const conversionRate = clients.length > 0 
        ? ((soldClients / clients.length) * 100).toFixed(1)
        : 0;

      // Calculate average project value
      const validBudgets = clients
        .filter(client => client.budget)
        .map(client => {
          const numericBudget = parseFloat(client.budget.replace(/[^0-9.-]+/g, ""));
          return isNaN(numericBudget) ? 0 : numericBudget;
        });

      const averageProjectValue = validBudgets.length > 0
        ? Math.round(validBudgets.reduce((a, b) => a + b, 0) / validBudgets.length)
        : 0;

      return {
        conversionRate,
        averageProjectValue: averageProjectValue.toLocaleString()
      };
    }
  });

  if (isLoading) {
    return (
      <Card className="md:col-span-2 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className={cn(
          "text-xl",
          isRTL && "font-cairo text-right"
        )}>
          {t("dashboard.analytics.keyMetrics")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cn(
            "p-4 rounded-lg bg-white/50 dark:bg-gray-800/50",
            "hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-2",
              isRTL && "font-cairo text-right"
            )}>
              {t("dashboard.analytics.conversionRate")}
            </h3>
            <p className="text-3xl font-bold text-primary">
              {metricsData?.conversionRate}%
            </p>
          </div>
          <div className={cn(
            "p-4 rounded-lg bg-white/50 dark:bg-gray-800/50",
            "hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors"
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-2",
              isRTL && "font-cairo text-right"
            )}>
              {t("dashboard.analytics.averageProjectValue")}
            </h3>
            <p className="text-3xl font-bold text-primary">
              {metricsData?.averageProjectValue}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};