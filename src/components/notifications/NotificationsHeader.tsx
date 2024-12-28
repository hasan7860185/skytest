import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Bell, Check, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface NotificationsHeaderProps {
  isRTL: boolean;
  refetchNotifications: () => void;
}

export const NotificationsHeader = ({ isRTL, refetchNotifications }: NotificationsHeaderProps) => {
  const { t } = useTranslation();

  // Fetch unread notifications count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return 0;

        const { data, error } = await supabase
          .from('notifications')
          .select('id', { count: 'exact' })
          .eq('user_id', session.user.id)
          .eq('is_read', false);

        if (error) throw error;
        return data?.length || 0;
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
        return 0;
      }
    }
  });

  const handleDeleteAll = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error(t("errors.unauthorized"));
        return;
      }

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;

      refetchNotifications();
      toast.success(t('notifications.allDeleted'));
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      toast.error(t('notifications.deleteError'));
    }
  };

  return (
    <div className="flex flex-col gap-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-[#0EA5E9]" />
          <h1 className={cn(
            "text-2xl font-semibold text-primary",
            isRTL && "font-cairo"
          )}>
            {t("notifications.title")}
          </h1>
        </div>
        <div className={cn(
          "flex items-center gap-2 text-sm text-gray-500 w-full sm:w-auto",
          isRTL && "font-cairo"
        )}>
          {unreadCount > 0 ? (
            <span className="text-sm whitespace-normal sm:whitespace-nowrap">
              {isRTL 
                ? `لديك ${unreadCount} إشعارات غير مقروءة`
                : `You have ${unreadCount} unread notifications`
              }
            </span>
          ) : (
            <span className="text-sm whitespace-normal sm:whitespace-nowrap">
              {isRTL 
                ? 'لا توجد إشعارات غير مقروءة'
                : 'No unread notifications'
              }
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px] bg-white">
              <SelectValue placeholder="جميع الإشعارات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#0EA5E9]" />
                جميع الإشعارات
              </SelectItem>
              <SelectItem value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#8B5CF6]" />
                تذكير المواعيد
              </SelectItem>
              <SelectItem value="completed" className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#22C55E]" />
                مكتملة
              </SelectItem>
              <SelectItem value="warning" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#F97316]" />
                تحذيرات
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="link"
          size="sm"
          className={cn(
            "text-blue-600 hover:text-blue-700 p-0",
            isRTL && "font-cairo"
          )}
          onClick={handleDeleteAll}
        >
          تحديد الكل كمقروء
        </Button>
      </div>
    </div>
  );
};