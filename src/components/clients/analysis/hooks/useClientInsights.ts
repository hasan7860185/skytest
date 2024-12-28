import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ClientInsights } from '../types';

export const useClientInsights = (clientId: string | null) => {
  const [insights, setInsights] = useState<ClientInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!clientId) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching insights for client:', clientId);
        
        const { data, error } = await supabase
          .from('client_insights')
          .select('*')
          .eq('client_id', clientId)
          .order('last_analysis', { ascending: false })
          .maybeSingle();

        if (error) {
          console.error('Error fetching insights:', error);
          throw error;
        }

        if (data) {
          console.log('Received insights data:', data);
          const suggestedActions = data.suggested_actions as { recommendations: string[] } | null;
          
          setInsights({
            purchaseProbability: data.purchase_probability,
            bestContactTime: data.best_contact_time,
            recommendations: suggestedActions?.recommendations || [],
            nextSteps: data.next_steps || []
          });
        } else {
          console.log('No insights found for client:', clientId);
          setInsights(null);
        }
      } catch (err) {
        console.error('Error in fetchInsights:', err);
        toast.error('خطأ في جلب تحليلات العميل');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [clientId]);

  return { insights, isLoading };
};