import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { ImportLogic } from "../ImportLogic";
import { useQueryClient } from "@tanstack/react-query";

export const useImportHandlers = (setOpen: (open: boolean) => void, setFile: (file: File | null) => void) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const importLogic = new ImportLogic();
  const queryClient = useQueryClient();

  const handleFileSelect = (selectedFile: File) => {
    console.log('File selected:', selectedFile.name);
    setFile(selectedFile);
    toast.success(
      isRTL ? `تم اختيار الملف: ${selectedFile.name}` : `File selected: ${selectedFile.name}`,
      {
        duration: 3000,
      }
    );
  };

  const handleDataMapped = async (mappedData: any[]) => {
    try {
      console.log('Starting import with mapped data:', mappedData);
      
      toast.loading(
        isRTL ? "جاري معالجة البيانات..." : "Processing data...",
        {
          id: "processing",
          duration: Infinity,
        }
      );

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.dismiss("processing");
        toast.error(t('errors.unauthorized'), {
          duration: 4000,
        });
        return;
      }

      toast.dismiss("processing");
      toast.loading(
        isRTL ? "جاري استيراد العملاء..." : "Importing clients...",
        {
          id: "importing",
          duration: Infinity,
        }
      );

      const result = await importLogic.importClients(mappedData, user.id);
      console.log('Import result:', result);

      toast.dismiss("importing");

      if (result.duplicates > 0) {
        const duplicateMessage = isRTL
          ? `تم العثور على ${result.duplicates} عميل تم إضافته سابقاً ولم يتم إضافته مرة أخرى`
          : `Found ${result.duplicates} duplicate clients that were not added`;
        
        const duplicateDetails = result.duplicateDetails
          .map(d => `${d.name} (${d.phone})`)
          .join('\n');

        toast.warning(duplicateMessage, {
          description: duplicateDetails,
          duration: 5000,
        });
      }

      if (result.imported > 0) {
        const successMessage = isRTL
          ? `تم استيراد ${result.imported} عميل جديد بنجاح`
          : `Successfully imported ${result.imported} new clients`;
        toast.success(successMessage, {
          duration: 4000,
        });
      }

      if (result.imported === 0) {
        if (result.duplicates > 0) {
          const allDuplicatesMessage = isRTL
            ? `جميع العملاء (${result.duplicates} عميل) تم إضافتهم سابقاً ولم يتم إضافة أي عميل جديد`
            : `All clients (${result.duplicates}) were duplicates. No new clients were added`;
          toast.error(allDuplicatesMessage, {
            duration: 4000,
          });
        } else {
          toast.error(t('clients.importClients.noValidData'), {
            duration: 4000,
          });
        }
      }

      const summaryMessage = isRTL
        ? `تم الانتهاء من الاستيراد: ${result.imported} عميل جديد، ${result.duplicates} عميل مكرر`
        : `Import completed: ${result.imported} new clients, ${result.duplicates} duplicates`;
      toast.success(summaryMessage, { 
        duration: 5000,
      });

      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      
      setOpen(false);
      setFile(null);
    } catch (error: any) {
      console.error('Error importing clients:', error);
      toast.dismiss("processing");
      toast.dismiss("importing");
      
      if (error.message?.includes('Failed to fetch') && 
          error.stack?.includes('kaspersky-labs')) {
        toast.error(isRTL ? 
          'يرجى تعطيل كاسبرسكي مؤقتاً أو إضافة النطاق إلى القائمة البيضاء' : 
          'Please temporarily disable Kaspersky or add the domain to whitelist',
          {
            duration: 5000,
          }
        );
      } else {
        toast.error(error.message || t('errors.importFailed'), {
          duration: 4000,
        });
      }
    }
  };

  return {
    handleFileSelect,
    handleDataMapped
  };
};