import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export function useUserProfiles() {
  const { data: userProfiles = {}, refetch } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('is_enabled', true);
      
      if (error) {
        console.error('Error fetching profiles:', error);
        return {};
      }

      return profiles.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, { full_name: string }>);
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Subscribe to real-time changes on profiles
  useEffect(() => {
    const channel = supabase
      .channel('profiles_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        (payload) => {
          console.log('Profile change received:', payload);
          refetch(); // Trigger a refetch when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return userProfiles;
}