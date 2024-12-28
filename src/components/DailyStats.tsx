import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useClientStore } from "@/data/clientsData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserDailyStats {
  userId: string;
  fullName: string | null;
  stats: Record<string, number>;
  total: number;
}

export const DailyStats = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const clients = useClientStore((state) => state.clients);
  
  const { data: userStats = [] } = useQuery({
    queryKey: ['dailyUserStats'],
    queryFn: async () => {
      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get all clients created/updated today
      const todayClients = clients.filter(client => {
        const clientDate = new Date(client.createdAt);
        clientDate.setHours(0, 0, 0, 0);
        return clientDate.getTime() === today.getTime();
      });

      // Get unique user IDs from today's clients
      const userIds = [...new Set(todayClients.map(client => client.userId))];
      
      // Get user profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      // Calculate stats for each user
      const userStats: UserDailyStats[] = userIds.map(userId => {
        const userClients = todayClients.filter(client => client.userId === userId);
        const profile = profiles?.find(p => p.id === userId);
        
        // Count clients by status
        const stats: Record<string, number> = {};
        userClients.forEach(client => {
          stats[client.status] = (stats[client.status] || 0) + 1;
        });

        return {
          userId,
          fullName: profile?.full_name || t('common.unknownUser'),
          stats,
          total: userClients.length
        };
      });

      return userStats.sort((a, b) => b.total - a.total);
    }
  });

  const totalClients = userStats.reduce((sum, user) => sum + user.total, 0);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className={cn(
          "text-lg font-medium",
          isRTL && "font-cairo text-right"
        )}>
          {t("dashboard.dailyStats")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {userStats.map((user, index) => (
              <div key={user.userId} className="space-y-2">
                <div className={cn(
                  "flex items-center justify-between",
                  isRTL && "flex-row-reverse"
                )}>
                  <span className={cn(
                    "font-medium text-sm",
                    isRTL && "font-cairo"
                  )}>
                    {user.fullName}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-muted-foreground cursor-help">
                          {t("dashboard.totalClients")}: {user.total}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent 
                        side={isRTL ? "left" : "right"}
                        className={cn("w-64", isRTL && "font-cairo")}
                      >
                        <div className="space-y-2">
                          {Object.entries(user.stats).map(([status, count]) => (
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
                
                <div className={cn(
                  "grid grid-cols-2 gap-2 text-sm",
                  isRTL && "font-cairo text-right"
                )}>
                  {Object.entries(user.stats).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-md">
                      <span>{t(`clients.status.${status}`)}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
                
                {index < userStats.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Separator className="my-4" />
        
        <div className={cn(
          "flex items-center justify-between pt-2",
          isRTL && "flex-row-reverse"
        )}>
          <span className={cn(
            "font-medium",
            isRTL && "font-cairo"
          )}>
            {t("dashboard.totalDailyClients")}
          </span>
          <span className="font-bold text-lg">{totalClients}</span>
        </div>
      </CardContent>
    </Card>
  );
};