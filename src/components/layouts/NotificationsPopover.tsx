import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "../notifications/useNotifications";
import { useNotificationChecker } from "../notifications/useNotificationChecker";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationsList } from "../notifications/NotificationsList";
import { useNotificationSound } from "@/hooks/useNotificationSound";

interface NotificationsPopoverProps {
  unreadCount: number;
}

export function NotificationsPopover({ unreadCount }: NotificationsPopoverProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const isRTL = i18n.language === 'ar';
  const { notifications, isError, markAsReadMutation } = useNotifications();
  const queryClient = useQueryClient();
  const [prevUnreadCount, setPrevUnreadCount] = useState(unreadCount);
  const [audio] = useState(new Audio('https://jrxxemchkytvqqsvloso.supabase.co/storage/v1/object/public/notifications/audio1.mp3'));

  // Use the notification checker hook
  useNotificationChecker();

  // Handle notification sound
  useEffect(() => {
    if (unreadCount > prevUnreadCount) {
      console.log('Playing notification sound');
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.error('Error playing notification sound:', error);
        if (error.name === 'NotAllowedError') {
          toast.error('يرجى السماح بتشغيل الصوت في المتصفح');
        } else {
          toast.error('حدث خطأ أثناء تشغيل صوت الإشعار');
        }
      });
    }
  }, [unreadCount, prevUnreadCount, audio]);

  // Subscribe to real-time notifications
  useEffect(() => {
    console.log('Setting up notifications subscription');
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        async (payload) => {
          console.log('Received notification change:', payload);
          // Invalidate and refetch notifications
          await queryClient.invalidateQueries({ queryKey: ['notifications'] });
          await queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });

          // Show toast for new notifications
          if (payload.eventType === 'INSERT') {
            toast.success(t('notifications.new'));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up notifications subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient, t]);

  // Effect to update previous unread count
  useEffect(() => {
    setPrevUnreadCount(unreadCount);
  }, [unreadCount]);

  const handleNotificationClick = async (notification: any) => {
    try {
      if (!notification.is_read) {
        await markAsReadMutation.mutate(notification.id);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error(t("errors.unauthorized"));
        return;
      }

      const { data: unreadNotifications, error: fetchError } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('is_read', false);

      if (fetchError) throw fetchError;

      await Promise.all(
        (unreadNotifications || []).map(notification =>
          markAsReadMutation.mutateAsync(notification.id)
        )
      );

      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      
      toast.success(t('notifications.allMarkedAsRead'));
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error(t('notifications.errorMarkingRead'));
    }
  };

  console.log('Current unread count:', unreadCount); // Debug log

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-[#f0f8ff] text-primary-foreground"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full px-1 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className={cn(
            "font-semibold",
            isRTL && "font-cairo"
          )}>
            {t("notifications.title")}
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2"
              disabled={markAsReadMutation.isPending}
            >
              <Check className="h-4 w-4" />
              <span className={cn(isRTL && "font-cairo")}>
                {t("notifications.readStatus.markAllAsRead")}
              </span>
            </Button>
          )}
        </div>
        <NotificationsList
          notifications={notifications}
          isError={isError}
          handleNotificationClick={handleNotificationClick}
          isRTL={isRTL}
        />
      </PopoverContent>
    </Popover>
  );
}