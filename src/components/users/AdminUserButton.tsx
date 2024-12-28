import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface AdminUserButtonProps {
  userId: string;
}

export function AdminUserButton({ userId }: AdminUserButtonProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setIsAdmin(profile?.role === 'admin');
      } catch (error) {
        console.error('Error fetching admin status:', error);
      }
    };

    fetchAdminStatus();
  }, [userId]);

  const handleUpdateUser = async () => {
    try {
      setIsUpdating(true);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);

      if (profileError) throw profileError;

      setIsAdmin(true);
      toast.success(isRTL ? "تم تعيين المستخدم كمشرف بنجاح" : "User has been set as admin successfully");
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تعيين المستخدم كمشرف" : "Error setting user as admin");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button 
      onClick={handleUpdateUser} 
      disabled={isUpdating || isAdmin}
      variant={isAdmin ? "secondary" : "outline"}
      size="sm"
      className={cn(
        isRTL && "font-cairo",
        isAdmin && "bg-primary text-white dark:bg-primary/90 dark:text-white hover:bg-primary/80 dark:hover:bg-primary/70",
        !isAdmin && "bg-background text-foreground hover:bg-accent dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-600"
      )}
    >
      {isAdmin 
        ? (isRTL ? "مشرف" : "Admin")
        : (isUpdating 
          ? (isRTL ? "جاري التحديث..." : "Updating...") 
          : (isRTL ? "تعيين كمشرف" : "Set as Admin")
        )
      }
    </Button>
  );
}
