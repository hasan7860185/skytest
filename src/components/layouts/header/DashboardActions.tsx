import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NotificationsPopover } from "../NotificationsPopover";
import { UserMenu } from "../UserMenu";
import { CalendarPopover } from "../CalendarPopover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function DashboardActions() {
  const { data: unreadCount = 0, error } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return 0;

        const { data, error } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('is_read', false);

        if (error) {
          console.error('Error fetching unread notifications:', error);
          toast.error('فشل في تحميل الإشعارات');
          return 0;
        }

        console.log('Unread notifications count:', data?.length || 0); // Debug log
        return data?.length || 0;
      } catch (error: any) {
        console.error('Error in unread notifications query:', error);
        toast.error('حدث خطأ أثناء تحميل الإشعارات');
        return 0;
      }
    },
    retry: 3,
    retryDelay: 1000,
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
    meta: {
      errorMessage: 'فشل في تحميل الإشعارات'
    }
  });

  if (error) {
    console.error('Error in unread notifications query:', error);
  }

  return (
    <div className="flex items-center gap-1 md:gap-3">
      <CalendarPopover />
      <NotificationsPopover unreadCount={unreadCount} />
      <LanguageSwitcher />
      <div className="min-w-[36px] md:min-w-[40px]">
        <UserMenu />
      </div>
    </div>
  );
}