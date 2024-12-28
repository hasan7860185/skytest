import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useClientAssignment = () => {
  const { t } = useTranslation();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleUnassign = async (selectedClients: string[]) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ assigned_to: null })
        .in('id', selectedClients);

      if (error) throw error;
      
      toast.success(t('clients.unassignSuccess'));
      return true;
    } catch (err) {
      console.error('Error unassigning clients:', err);
      toast.error(t('clients.unassignError'));
      return false;
    }
  };

  return {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    handleUnassign
  };
};