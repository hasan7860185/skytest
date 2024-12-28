import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useDelayedClients = (createNotificationIfNeeded: (client: any) => Promise<void>) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ['delayedClients'],
    queryFn: async () => {
      try {
        const now = new Date();
        console.log('Checking for delayed clients at:', now);

        const { data, error } = await supabase
          .from('clients')
          .select(`
            *,
            profiles!clients_assigned_to_fkey(full_name)
          `)
          .not('next_action_type', 'is', null)
          .not('next_action_date', 'is', null)
          .lt('next_action_date', now.toISOString())
          .order('next_action_date', { ascending: true });

        if (error) {
          console.error('Error fetching delayed clients:', error);
          throw error;
        }

        // Create notifications for any clients that need them
        if (data) {
          for (const client of data) {
            await createNotificationIfNeeded(client);
          }
        }

        console.log('Found delayed clients:', data);
        return data || [];

      } catch (error: any) {
        // Check if error is from security software
        if (error.message?.includes('Failed to fetch')) {
          if (error.stack?.includes('gpteng.co')) {
            toast.error(t('errors.securitySoftware'), {
              description: t('errors.whitelistDomain')
            });
            // Don't retry if it's blocked by security software
            throw new Error('Security software blocking connection');
          }
        }

        console.error('Error in delayed clients query:', error);
        toast.error(t('errors.unexpected'));
        return [];
      }
    },
    refetchInterval: 15000, // Check every 15 seconds
    retry: (failureCount, error: any) => {
      // Don't retry if blocked by security software
      if (error.message === 'Security software blocking connection') {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),
    meta: {
      errorMessage: t('errors.loadingClients')
    }
  });
};