import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Computer, LogOut, Smartphone, Globe, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isValid } from "date-fns";
import { ar } from "date-fns/locale";

interface UserSessionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  isRTL: boolean;
  refetch: () => void;
}

export function UserSessionsDialog({ 
  open, 
  onOpenChange, 
  userId,
  isRTL,
  refetch 
}: UserSessionsDialogProps) {
  const { data: sessions, isLoading, error, refetch: refetchSessions } = useQuery({
    queryKey: ['userSessions', userId],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error('No session');

        const { data, error } = await supabase.functions.invoke('get-user-sessions', {
          body: { userId },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          console.error('Error fetching sessions:', error);
          throw error;
        }

        return data;
      } catch (error: any) {
        console.error('Error in sessions query:', error);
        toast.error(isRTL ? 'حدث خطأ أثناء جلب الجلسات' : 'Error fetching sessions');
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000
  });

  const handleTerminateSession = async (sessionId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      const { error } = await supabase.functions.invoke('terminate-user-session', {
        body: { 
          userId, 
          sessionId 
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast.success(isRTL ? 'تم تسجيل الخروج بنجاح' : 'Successfully logged out');
      refetchSessions();
      refetch();
    } catch (error: any) {
      console.error('Error terminating session:', error);
      toast.error(isRTL ? 'فشل تسجيل الخروج' : 'Failed to log out');
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return isRTL ? 'غير محدد' : 'Not specified';
    
    try {
      const date = new Date(dateString);
      if (!isValid(date)) {
        return isRTL ? 'تاريخ غير صالح' : 'Invalid date';
      }
      
      return format(date, 'PPpp', {
        locale: isRTL ? ar : undefined
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return isRTL ? 'تاريخ غير صالح' : 'Invalid date';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className={isRTL ? "font-cairo text-right" : ""}>
            {isRTL ? "الأجهزة النشطة" : "Active Devices"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {isLoading ? (
            <div className="text-center py-4">
              {isRTL ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              {isRTL ? "حدث خطأ أثناء جلب الجلسات" : "Error loading sessions"}
            </div>
          ) : sessions?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              {isRTL ? "لا توجد جلسات نشطة" : "No active sessions"}
            </div>
          ) : (
            <div className="space-y-4">
              {sessions?.map((session: any) => (
                <div 
                  key={session.id} 
                  className="flex flex-col p-4 rounded-lg border bg-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {session.isMobile ? (
                        <Smartphone className="h-5 w-5 text-primary" />
                      ) : (
                        <Computer className="h-5 w-5 text-primary" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {session.os} - {session.browser}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          <span>IP: {session.ip}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                      className="ml-2"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {isRTL ? "آخر نشاط: " : "Last active: "}
                      {formatDate(session.lastActiveAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}