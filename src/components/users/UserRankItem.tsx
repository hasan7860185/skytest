import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { TopUser } from "@/types/userTypes";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { actionTypeLabels } from "@/types/actionTypes";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserRankItemProps {
  user: TopUser;
  index: number;
  showCrown?: boolean;
}

export function UserRankItem({ user, index, showCrown = false }: UserRankItemProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isMobile = useIsMobile();

  const { data: actionsByType } = useQuery({
    queryKey: ['userActionsByType', user.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_actions')
        .select('action_type')
        .eq('created_by', user.user_id);

      if (error) {
        console.error('Error fetching actions:', error);
        return {};
      }

      const counts: Record<string, number> = {};
      data.forEach(action => {
        counts[action.action_type] = (counts[action.action_type] || 0) + 1;
      });

      return counts;
    }
  });

  const getRankIcon = (index: number, showCrown: boolean) => {
    if (showCrown) {
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    }
    return null;
  };

  const getRoleTranslation = (role: string | null) => {
    if (!role) return '';
    
    switch (role.toLowerCase()) {
      case 'admin':
        return t('users.roles.admin');
      case 'employee':
        return t('users.roles.employee');
      case 'supervisor':
        return t('users.roles.supervisor');
      case 'sales':
        return t('users.roles.sales');
      default:
        return role;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || ""} />
            <AvatarFallback>
              {user.full_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {showCrown && (
            <div className="absolute -top-1 -right-1">
              {getRankIcon(index, showCrown)}
            </div>
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger 
              asChild
              className="touch-manipulation select-none cursor-help"
            >
              <div>
                <p className="text-sm font-medium">{user.full_name}</p>
                <div className="flex flex-col text-xs">
                  <span className="text-muted-foreground">
                    {t("dashboard.actions")}: {user.action_count}
                  </span>
                  {user.role && (
                    <span className="text-muted-foreground">
                      {getRoleTranslation(user.role)}
                    </span>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent 
              side={isRTL ? "left" : "right"}
              className={cn(
                "w-72 touch-none select-none overflow-auto",
                "max-h-[80vh] md:max-h-none",
                "z-[100]",
                "bg-white dark:bg-gray-800",
                "shadow-lg",
                "border border-gray-200 dark:border-gray-700",
                "p-4",
                isRTL && "font-cairo",
                isMobile && "fixed inset-x-4 top-1/4 w-auto"
              )}
              sideOffset={5}
            >
              <div className="space-y-2">
                <h4 className={cn(
                  "text-sm font-semibold",
                  isRTL && "text-right"
                )}>
                  {t("dashboard.userDetails")}
                </h4>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span>{t("dashboard.role")}</span>
                    <span className="font-medium">{getRoleTranslation(user.role)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium border-b pb-1">
                      {t("dashboard.totalActions")}: {user.action_count}
                    </span>
                    {actionsByType && Object.entries(actionsByType).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center text-sm">
                        <span>{isRTL ? actionTypeLabels[type]?.ar : actionTypeLabels[type]?.en}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}