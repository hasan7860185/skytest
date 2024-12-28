import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useDelayedClientActions = (clientId: string, onAction: () => void) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const handleDialogClose = async (open: boolean) => {
    if (!open) {
      try {
        const { error: updateError } = await supabase
          .from('clients')
          .update({
            next_action_date: null,
            next_action_type: null
          })
          .eq('id', clientId);

        if (updateError) throw updateError;

        onAction();
        queryClient.invalidateQueries({ queryKey: ['delayedClients'] });
        toast.success(t('clients.removedFromDelayed'));
      } catch (error) {
        console.error('Error updating client:', error);
        toast.error(t('errors.unexpected'));
      }
    }
    setIsPreviewOpen(open);
  };

  return {
    isPreviewOpen,
    setIsPreviewOpen,
    handleDialogClose
  };
};