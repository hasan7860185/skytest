import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Client, ClientStatus } from '@/types/client';
import { useTranslation } from "react-i18next";

export const useClientData = (clientId: string) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Not authenticated');
        }

        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .maybeSingle();

        if (error) {
          if (error.message?.includes('profiles')) {
            console.warn('Profile-related error, attempting to proceed:', error);
          } else {
            throw error;
          }
        }

        if (data) {
          const isValidStatus = (status: string): status is ClientStatus => {
            return [
              'new',
              'potential',
              'interested',
              'responded',
              'noResponse',
              'scheduled',
              'postMeeting',
              'whatsappContact',
              'facebookContact',
              'booked',
              'cancelled',
              'sold',
              'postponed',
              'resale'
            ].includes(status);
          };

          if (!isValidStatus(data.status)) {
            throw new Error(`Invalid status: ${data.status}`);
          }

          // Map database fields to Client interface
          const mappedClient: Client = {
            id: data.id,
            name: data.name,
            status: data.status,
            phone: data.phone,
            country: data.country,
            email: data.email || '',
            city: data.city || '',
            project: data.project || '',
            budget: data.budget || '',
            salesPerson: data.sales_person || '',
            contactMethod: data.contact_method,
            facebook: data.facebook || '',
            campaign: data.campaign || '',
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
            userId: data.user_id,
            assignedTo: data.assigned_to || '',
            rating: data.rating || 0,
            nextActionDate: data.next_action_date ? new Date(data.next_action_date) : undefined,
            nextActionType: data.next_action_type || '',
            comments: data.comments || []
          };
          setClient(mappedClient);
        }
      } catch (err: any) {
        console.error('Error fetching client:', err);
        if (err.message?.includes('Failed to fetch')) {
          toast.error(
            isRTL ?
            'خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت وتعطيل أي برامج مكافحة الفيروسات قد تمنع الاتصال' :
            'Connection error. Please check your internet connection and disable any antivirus software that might be blocking the connection'
          );
        } else if (!err.message?.includes('profiles')) {
          toast.error(isRTL ? 'خطأ في جلب بيانات العميل' : 'Error fetching client data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId, t, isRTL]);

  return { client, isLoading };
};