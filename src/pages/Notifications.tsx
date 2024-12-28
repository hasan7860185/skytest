import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { NotificationsHeader } from "@/components/notifications/NotificationsHeader";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { PageLayout } from "@/components/layouts/PageLayout";

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  return (
    <PageLayout>
      <div className="max-w-screen-xl mx-auto">
        <NotificationsHeader 
          isRTL={isRTL} 
          refetchNotifications={refetch} 
        />
        <NotificationsList 
          notifications={notifications}
          isLoading={isLoading}
          isRTL={isRTL}
          refetchNotifications={refetch}
        />
      </div>
    </PageLayout>
  );
};

export default Notifications;