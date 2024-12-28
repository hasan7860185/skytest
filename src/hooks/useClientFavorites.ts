import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useClientFavorites = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
          .from('client_favorites')
          .select('client_id')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching favorites:', error);
          return [];
        }
        return data?.map(f => f.client_id) || [];
      } catch (error) {
        console.error('Error in favorites query:', error);
        return [];
      }
    }
  });

  const toggleFavorite = async (clientId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (favorites.includes(clientId)) {
        await supabase
          .from('client_favorites')
          .delete()
          .eq('client_id', clientId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('client_favorites')
          .insert({
            client_id: clientId,
            user_id: user.id
          });
      }
      
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(t(favorites.includes(clientId) ? 'clients.removedFromFavorites' : 'clients.addedToFavorites'));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(t('errors.unexpected'));
    }
  };

  return { favorites, toggleFavorite };
};