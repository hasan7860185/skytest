import { supabase } from "@/integrations/supabase/client";

export const getClientFromNotification = async (notification: any) => {
  try {
    // First try to get client from client_id
    if (notification.client_id) {
      const { data: client, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', notification.client_id)
        .maybeSingle();

      if (error) throw error;
      if (client) return client;
    }

    // If no client_id or client not found, try to extract from message
    if (notification.type === 'client_action') {
      const messageMatch = notification.message.match(/للعميل:\s*([^-]+)/);
      if (messageMatch) {
        const clientName = messageMatch[1].trim();
        const { data: clients, error } = await supabase
          .from('clients')
          .select('*')
          .eq('name', clientName)
          .limit(1);

        if (error) throw error;
        if (clients && clients.length > 0) {
          return clients[0];
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting client:', error);
    return null;
  }
};