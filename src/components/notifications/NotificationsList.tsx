import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { NotificationItem } from "./NotificationItem";

interface NotificationsListProps {
  notifications: any[];
  isError?: boolean;
  isLoading?: boolean;
  handleNotificationClick?: (notification: any) => Promise<void>;
  isRTL: boolean;
  refetchNotifications?: () => void;
}

export function NotificationsList({ 
  notifications, 
  isError,
  isLoading,
  handleNotificationClick,
  isRTL,
  refetchNotifications
}: NotificationsListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="max-h-[400px] overflow-y-auto">
        <div className={cn(
          "text-center py-8 text-gray-500 dark:text-gray-400",
          isRTL && "font-cairo"
        )}>
          {t("common.loading")}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-h-[400px] overflow-y-auto">
        <div className={cn(
          "text-center py-8 text-gray-500 dark:text-gray-400",
          isRTL && "font-cairo"
        )}>
          {t("notifications.error")}
        </div>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="max-h-[400px] overflow-y-auto">
        <div className={cn(
          "text-center py-8 text-gray-500 dark:text-gray-400",
          isRTL && "font-cairo"
        )}>
          {t("notifications.empty")}
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={handleNotificationClick}
          isRTL={isRTL}
          onDelete={(id) => {
            // Handle delete notification
            console.log('Delete notification:', id);
          }}
        />
      ))}
    </div>
  );
}