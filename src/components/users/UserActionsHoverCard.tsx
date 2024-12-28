import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { actionTypeLabels } from "@/types/actionTypes";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserActionsHoverCardProps {
  userId: string;
  actionCount: number;
  isRTL: boolean;
}

export function UserActionsHoverCard({ userId, actionCount, isRTL }: UserActionsHoverCardProps) {
  const isMobile = useIsMobile();
  const { data: actions = [] } = useQuery({
    queryKey: ['user-actions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_actions')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const ActionsList = () => (
    <div className="space-y-2">
      <h4 className={cn(
        "font-medium text-sm mb-2",
        isRTL && "font-cairo text-right"
      )}>
        {isRTL ? "آخر الإجراءات" : "Recent Actions"}
      </h4>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-4">
          {actions.map((action: any) => (
            <div 
              key={action.id}
              className={cn(
                "text-sm",
                "p-2",
                "rounded-md",
                "bg-gray-50 dark:bg-gray-700/50",
                isRTL && "text-right"
              )}
            >
              <div className="font-medium">
                {actionTypeLabels[action.action_type] 
                  ? (isRTL ? actionTypeLabels[action.action_type].ar : actionTypeLabels[action.action_type].en)
                  : action.action_type}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(action.created_at), 'PPp', {
                  locale: isRTL ? ar : undefined
                })}
              </div>
              {action.comment && (
                <div className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                  {action.comment}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const ActionCounter = () => (
    <div className="flex items-center gap-2 cursor-pointer">
      <span className={cn(
        "text-sm font-medium",
        isRTL && "font-cairo"
      )}>
        {actionCount}
      </span>
      <span className={cn(
        "text-xs text-gray-500 dark:text-gray-400",
        isRTL && "font-cairo"
      )}>
        {isRTL ? "إجراء" : "actions"}
      </span>
    </div>
  );

  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <ActionCounter />
          </div>
        </DialogTrigger>
        <DialogContent className={cn(
          "w-[90vw] max-w-lg",
          "bg-white dark:bg-gray-800",
          "p-4",
          "space-y-2"
        )}>
          <ActionsList />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">
          <ActionCounter />
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        className={cn(
          "w-80",
          "bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "shadow-lg",
          "p-4",
          "space-y-2"
        )}
        align={isRTL ? "end" : "start"}
        side="top"
      >
        <ActionsList />
      </HoverCardContent>
    </HoverCard>
  );
}