import { useImportLogic } from "../ImportLogic";
import type { ImportResult } from "../ImportLogic";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useImportHandlers = () => {
  const { t } = useTranslation();
  const { processClients } = useImportLogic({
    onComplete: async (result: ImportResult) => {
      if (result.duplicates > 0) {
        const duplicateMessage = t('clients.importClients.duplicatesFound', { count: result.duplicates });
        toast.error(duplicateMessage);
      }

      if (result.imported > 0) {
        const successMessage = t('clients.importClients.success', { count: result.imported });
        toast.success(successMessage);
      }
    },
    onError: async (error) => {
      console.error('Error during import:', error);
      toast.error(t('clients.importClients.error'));
    }
  });

  const handleImport = async (mappedData: any[]) => {
    await processClients(mappedData);
  };

  return {
    handleImport
  };
};