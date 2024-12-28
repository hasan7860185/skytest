import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Calendar, Check, AlertOctagon, Bell } from "lucide-react";

interface NotificationContentProps {
  notification: {
    type: string;
    title: string;
    message: string;
    created_at: string;
  };
  selectedClient?: {
    name?: string;
    next_action_type?: string;
    next_action_date?: string | null;
  };
  isRTL: boolean;
}

export function NotificationContent({ notification, selectedClient, isRTL }: NotificationContentProps) {
  const { t } = useTranslation();

  // Format the date to show exact time, with safety checks
  const formattedDate = notification.created_at ? 
    format(new Date(notification.created_at), "dd/MM/yyyy HH:mm") : 
    "";

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'client_action':
        return <Calendar className="h-6 w-6 text-blue-500" />;
      case 'success':
        return <Check className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertOctagon className="h-6 w-6 text-yellow-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start gap-4 w-full">
      <div className="flex-shrink-0">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1">
        <p className={cn(
          "text-base font-medium text-gray-900 dark:text-gray-100",
          isRTL && "font-cairo"
        )}>
          {notification.title}
        </p>
        <p className={cn(
          "text-sm text-gray-500 dark:text-gray-400 mt-1",
          isRTL && "font-cairo"
        )}>
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
          {formattedDate}
        </p>
      </div>
    </div>
  );
}