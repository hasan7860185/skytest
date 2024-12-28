import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DelayedClient {
  id: string;
  name: string;
  next_action_date: string;
  next_action_type: string;
  assigned_to: string | null;
  user_id: string;
}

export const checkExistingNotification = async (client: DelayedClient) => {
  try {
    const { data: existingNotifications, error: notificationError } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', client.assigned_to || client.user_id)
      .eq('type', 'delayed_client')
      .eq('client_id', client.id)
      .eq('is_read', false);

    if (notificationError) {
      console.error('Error checking existing notification:', notificationError);
      return { error: notificationError };
    }

    return { data: existingNotifications };
  } catch (error) {
    console.error('Error in checkExistingNotification:', error);
    return { error };
  }
};

export const createDelayedClientNotification = async (
  client: DelayedClient,
  title: string,
  message: string
) => {
  try {
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
      return { error: createError };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in createDelayedClientNotification:', error);
    return { error };
  }
};