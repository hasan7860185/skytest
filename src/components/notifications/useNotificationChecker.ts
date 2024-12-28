import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

export const useNotificationChecker = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const audio = new Audio("/notification-sound.mp3");
    
    const checkDelayedActions = async () => {
      try {
        const now = new Date();
        const currentTime = now.toISOString();

        const { data: clients, error } = await supabase
          .from('clients')
          .select('*')
          .not('next_action_type', 'is', null)
          .not('next_action_date', 'is', null)
          .filter('next_action_date', 'eq', currentTime);

        if (error) {
          console.error('Error checking delayed actions:', error);
          return;
        }

        if (clients && clients.length > 0) {
          for (const client of clients) {
            try {
              // Check for existing notifications
              const { data: existingNotifications, error: notificationError } = await supabase
                .from('notifications')
                .select('id')
                .eq('user_id', client.assigned_to || client.user_id)
                .eq('type', 'delayed_client')
                .eq('client_id', client.id)
                .eq('is_read', false);

              if (notificationError) {
                console.error('Error checking existing notifications:', notificationError);
                continue;
              }

              // Only create a new notification if none exist for this client
              if (!existingNotifications || existingNotifications.length === 0) {
                const title = isRTL 
                  ? t('notifications.delayedClient') 
                  : t('notifications.delayedClientEn');
                const message = isRTL 
                  ? t('notifications.delayedClientMessage', { name: client.name, action: client.next_action_type || '' })
                  : t('notifications.delayedClientMessageEn', { name: client.name, action: client.next_action_type || '' });

                const { error: createError } = await supabase
                  .from('notifications')
                  .insert({
                    user_id: client.assigned_to || client.user_id,
                    title,
                    message,
                    type: 'delayed_client',
                    is_read: false,
                    client_id: client.id
                  });

                if (createError) {
                  console.error('Error creating notification:', createError);
                  continue;
                }

                try {
                  await audio.play();
                } catch (error) {
                  console.error('Error playing sound:', error);
                }
              }
            } catch (error) {
              console.error('Error in notification creation:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error in checkDelayedActions:', error);
      }
    };

    // Check every minute
    checkDelayedActions();
    const interval = setInterval(checkDelayedActions, 60000);

    return () => {
      clearInterval(interval);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [t, i18n]);
};