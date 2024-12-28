import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import type { ChatMessage } from "@/integrations/supabase/types/chat";

interface MessageHeaderProps {
  message: ChatMessage;
  isRTL: boolean;
}

export function MessageHeader({ message, isRTL }: MessageHeaderProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Get current user's role
  const { data: userProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const formatDate = (date: string) => {
    return format(new Date(date), "PPp", {
      locale: isRTL ? ar : undefined
    });
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error(isRTL ? "يجب تسجيل الدخول" : "Must be logged in");
        return;
      }

      // Check if user is admin/supervisor or message owner
      const canDelete = userProfile?.role === 'admin' || 
                       userProfile?.role === 'supervisor' || 
                       message.user_id === session.user.id;

      if (!canDelete) {
        toast.error(isRTL ? "ليس لديك صلاحية لحذف هذه الرسالة" : "You don't have permission to delete this message");
        return;
      }

      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', message.id);

      if (error) throw error;

      toast.success(isRTL ? "تم حذف الرسالة بنجاح" : "Message deleted successfully");
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error(isRTL ? "حدث خطأ أثناء حذف الرسالة" : "Error deleting message");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-2 justify-between",
      isRTL ? "flex-row-reverse" : ""
    )}>
      <div className={cn(
        "flex items-center gap-2",
        isRTL ? "flex-row-reverse" : ""
      )}>
        <span className="font-medium">{message.user?.full_name}</span>
        <span className="text-sm text-muted-foreground">
          {formatDate(message.created_at)}
        </span>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}