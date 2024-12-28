import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityLog } from "@/types/activityLog";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LogItemHeader } from "./log-item/LogItemHeader";
import { LogItemTimestamp } from "./log-item/LogItemTimestamp";
import { LogItemDetails } from "./log-item/LogItemDetails";
import { LogItemClientInfo } from "./log-item/LogItemClientInfo";

interface ActivityLogItemProps {
  log: ActivityLog & {
    profiles: {
      full_name: string;
      avatar: string | null;
    };
  };
}

export function ActivityLogItem({ log }: ActivityLogItemProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
      "flex flex-col gap-4 p-4 rounded-lg border bg-card",
      "hover:bg-accent/5 transition-colors"
    )}>
      <LogItemHeader 
        profileName={log.profiles.full_name}
        profileAvatar={log.profiles.avatar}
        actionType={log.action_type}
        entityType={log.entity_type}
      />
      
      <LogItemClientInfo details={log.details} />
      
      <LogItemTimestamp timestamp={log.created_at} />

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )} />
          <span>
            {isRTL ? 
              (isOpen ? "إخفاء التفاصيل" : "عرض التفاصيل") : 
              (isOpen ? "Hide Details" : "Show Details")
            }
          </span>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          {log.details && (
            <div className="mt-2 text-sm bg-muted p-2 rounded-md overflow-x-auto">
              <LogItemDetails details={log.details} />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}