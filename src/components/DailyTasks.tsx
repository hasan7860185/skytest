import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DailyTasksChart } from "./daily-tasks/DailyTasksChart";
import { DailyStatsCounter } from "./daily-tasks/DailyStatsCounter";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { useChartData } from "@/hooks/useChartData";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const DailyTasks = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const userProfiles = useUserProfiles();
  const chartData = useChartData(userProfiles, isRTL);

  // Get today's data
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayData = chartData.find(data => data.date.getTime() === today.getTime());
  const todayUsers = todayData?.users || [];
  const todayClients = todayData?.totalNewClients || 0;

  console.log('Today Users:', todayUsers); // For debugging

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className={cn(
          "text-lg font-medium",
          isRTL && "font-cairo text-right"
        )}>
          {t("dashboard.dailyStats")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DailyTasksChart chartData={chartData} isRTL={isRTL} />
        
        <ScrollArea className="h-[200px] mt-4">
          <div className="space-y-4">
            {todayUsers.map((user) => (
              <div key={user.id} className="space-y-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className={cn(
                      "flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
                      isRTL && "flex-row-reverse"
                    )}>
                      <span className={cn(
                        "font-medium text-sm",
                        isRTL && "font-cairo"
                      )}>
                        {user.name}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm text-muted-foreground cursor-help">
                              {t("dashboard.totalActions")}: {Object.values(user.statuses).reduce((a, b) => a + b, 0)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent 
                            side={isRTL ? "left" : "right"}
                            className={cn("w-64", isRTL && "font-cairo")}
                          >
                            <div className="space-y-2">
                              {Object.entries(user.statuses).map(([status, count]) => (
                                <div key={status} className="flex justify-between items-center">
                                  <span>{t(`clients.status.${status}`)}</span>
                                  <span className="font-medium">{count}</span>
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent 
                    className={cn(
                      "w-80",
                      isRTL && "font-cairo"
                    )}
                    align={isRTL ? "end" : "start"}
                  >
                    <div className="space-y-2">
                      <h4 className={cn(
                        "text-sm font-semibold",
                        isRTL && "text-right"
                      )}>
                        {t("dashboard.actionBreakdown")}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(user.statuses).map(([status, count]) => (
                          <div key={status} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <span className="text-sm">{t(`clients.status.${status}`)}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                
                {todayUsers.indexOf(user) < todayUsers.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Separator className="my-4" />
        <DailyStatsCounter count={todayClients} isRTL={isRTL} />
      </CardContent>
    </Card>
  );
};