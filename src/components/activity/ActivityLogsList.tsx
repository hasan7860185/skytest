import { useTranslation } from "react-i18next";
import { ActivityLogItem } from "./ActivityLogItem";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ActivityLogsListProps {
  filters?: {
    entity_type?: string;
    action_type?: string;
    user_id?: string;
    from_date?: Date;
    to_date?: Date;
  };
}

export function ActivityLogsList({ filters }: ActivityLogsListProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const { data: logs, isLoading, error } = useActivityLogs(filters);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "text-center py-8 text-muted-foreground",
        isRTL && "font-cairo"
      )}>
        {isRTL ? "حدث خطأ أثناء تحميل السجلات" : "Error loading activity logs"}
      </div>
    );
  }

  if (!logs?.length) {
    return (
      <div className={cn(
        "text-center py-8 text-muted-foreground",
        isRTL && "font-cairo"
      )}>
        {isRTL ? "لا توجد سجلات نشاط" : "No activity logs found"}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4 p-1">
        {logs.map((log) => (
          <ActivityLogItem key={log.id} log={log} />
        ))}
      </div>
    </ScrollArea>
  );
}