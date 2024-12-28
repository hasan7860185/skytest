import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientStatus } from '@/types/client';
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useClientData = (status: string, userRole: string | null) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        console.log('Fetching clients with status:', status);
        
        let query = supabase
          .from('clients')
          .select(`
            *,
            assigned_profile:profiles!clients_assigned_to_fkey(full_name)
          `);

        // Add status filter if provided
        if (status !== 'all') {
          query = query.eq('status', status);
        }

        const { data, error: fetchError } = await query.order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        // Add debug logging
        console.log('Raw client data from Supabase:', data);

        if (data) {
          const mappedClients = data
            .map(client => {
              const validStatus = (status: string): status is ClientStatus => {
                return ['new', 'potential', 'interested', 'responded', 'noResponse',
                  'scheduled', 'postMeeting', 'whatsappContact', 'facebookContact',
                  'booked', 'cancelled', 'sold', 'postponed', 'resale'].includes(status);
              };

              if (!validStatus(client.status)) {
                console.error(`Invalid status: ${client.status} for client ${client.id}`);
                return null;
              }

              // Add debug logging for post_url and comment
              console.log(`Client ${client.id} post_url:`, client.post_url);
              console.log(`Client ${client.id} comment:`, client.comment);

              const mappedClient: Client = {
                id: client.id,
                name: client.name,
                status: client.status,
                phone: client.phone,
                country: client.country,
                contactMethod: client.contact_method,
                userId: client.user_id,
                createdAt: new Date(client.created_at),
                updatedAt: new Date(client.updated_at),
                email: client.email || undefined,
                city: client.city || undefined,
                project: client.project || undefined,
                budget: client.budget || undefined,
                salesPerson: client.sales_person || undefined,
                facebook: client.facebook || undefined,
                campaign: client.campaign || undefined,
                assignedTo: client.assigned_to || undefined,
                rating: client.rating || undefined,
                nextActionDate: client.next_action_date ? new Date(client.next_action_date) : undefined,
                nextActionType: client.next_action_type || undefined,
                comments: client.comments || undefined,
                post_url: client.post_url || undefined,
                comment: client.comment || undefined
              };

              return mappedClient;
            })
            .filter((client): client is Client => client !== null);

          console.log('Mapped clients with post_url and comments:', mappedClients);
          setClients(mappedClients);
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError(err as Error);
        toast.error(t('errors.loadingClients'));
      }
    };

    fetchClients();
  }, [status, t]);

  return { clients, error };
};