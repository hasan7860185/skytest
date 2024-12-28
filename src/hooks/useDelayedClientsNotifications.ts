import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useDelayedClientsNotifications = () => {
  const { t, i18n } = useTranslation();

  const createNotificationIfNeeded = useCallback(async (client: any) => {
    try {
      // Get current time and set seconds/milliseconds to 0
      const now = new Date();
      now.setSeconds(0);
      now.setMilliseconds(0);
      
      // Get client's scheduled time and set seconds/milliseconds to 0
      const clientTime = new Date(client.next_action_date);
      clientTime.setSeconds(0);
      clientTime.setMilliseconds(0);

      // Add 15 seconds to the client time for the delay
      const delayedTime = new Date(clientTime.getTime() + 15000);

      // Check if we're within the 15-second window
      if (now < clientTime || now > delayedTime) {
        console.log('Skipping notification - outside 15-second window:', {
          client: client.name,
          scheduledTime: clientTime.toISOString(),
          currentTime: now.toISOString()
        });
        return;
      }

      // Check for existing notifications
      const { data: existingNotifications, error: fetchError } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', client.assigned_to || client.user_id)
        .eq('type', 'delayed_client')
        .eq('client_id', client.id)
        .eq('is_read', false);

      if (fetchError) throw fetchError;

      if (existingNotifications && existingNotifications.length > 0) {
        console.log('Notification already exists for client:', client.name);
        return;
      }

      // Format notification message with exact time
      const title = t('notifications.delayedClient.title');
      const formattedTime = clientTime.toLocaleTimeString();
      const message = t('notifications.delayedClient.message', {
        clientName: client.name,
        actionType: client.next_action_type || t('notifications.delayedClient.defaultAction'),
        time: formattedTime,
        userName: client.profiles?.full_name || t('notifications.delayedClient.unknownUser')
      });

      // Create new notification
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

      if (createError) throw createError;

      console.log('Created notification for client:', client.name);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }, [t]);

  return {
    createNotificationIfNeeded
  };
};