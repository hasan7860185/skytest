import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (profileError) throw profileError;
          
          if (profile) {
            setUserRole(profile.role);
          }
        }
      } catch (err: any) {
        console.error('Error fetching user role:', err);
        if (err.message?.includes('Failed to fetch') && 
            err.stack?.includes('kaspersky-labs')) {
          toast.error(isRTL ? 
            'يرجى تعطيل كاسبرسكي مؤقتاً أو إضافة النطاق إلى القائمة البيضاء' : 
            'Please temporarily disable Kaspersky or add the domain to whitelist'
          );
        } else {
          toast.error(t('errors.unexpected'));
        }
      }
    };

    fetchUserRole();
  }, [t, isRTL]);

  return userRole;
};