import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const useUserDetails = (userId: string, assignedTo?: string | null) => {
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          const { data: currentUserProfile, error: currentUserError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (currentUserError) {
            console.error('Error fetching current user profile:', currentUserError);
            throw currentUserError;
          }
          
          if (currentUserProfile) {
            setUserRole(currentUserProfile.role);
          }
        }

        const targetUserId = assignedTo || userId;
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', targetUserId)
          .maybeSingle();
        
        if (profileError) {
          console.error('Error fetching target user profile:', profileError);
          throw profileError;
        }
        
        setUserName(profile?.full_name || t('clients.common.unnamed'));
      } catch (error: any) {
        console.error('Error in fetchUserDetails:', error);
        toast.error(t('errors.fetchingUserDetails'));
        setUserName(t('clients.common.unnamed'));
      }
    };

    // Add retry logic for network issues
    const retryFetch = async (retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          await fetchUserDetails();
          break;
        } catch (error) {
          if (i === retries - 1) {
            console.error('Max retries reached:', error);
            toast.error(t('errors.fetchingUserDetails'));
          } else {
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
          }
        }
      }
    };

    retryFetch();
  }, [userId, assignedTo, t]);

  const shouldShowClient = userRole === 'admin' || userRole === 'supervisor' || 
                         currentUserId === userId || 
                         currentUserId === assignedTo;

  return {
    userName,
    shouldShowClient
  };
};