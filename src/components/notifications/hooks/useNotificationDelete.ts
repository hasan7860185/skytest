import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface UseNotificationDeleteProps {
  onDelete?: (id: string) => void;
}

export const useNotificationDelete = ({ onDelete }: UseNotificationDeleteProps) => {
  const { t } = useTranslation();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      if (onDelete) {
        onDelete(id);
      }
      
      toast.success(t('notifications.deleteSuccess'));
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(t('notifications.deleteError'));
    }
  };

  return { handleDelete };
};