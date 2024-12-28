import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileUp } from "lucide-react";
import { useState } from "react";
import { FileDropZone } from "./import/FileDropZone";
import { FieldMapping } from "./import/FieldMapping";
import { ImportLogic } from "./import/ImportLogic";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import Swal from 'sweetalert2';

interface ImportClientsSheetProps {
  children?: React.ReactNode;
}

export function ImportClientsSheet({ children }: ImportClientsSheetProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const importLogic = new ImportLogic();
  const queryClient = useQueryClient();

  const handleFileSelect = (selectedFile: File) => {
    console.log('File selected:', selectedFile.name);
    setFile(selectedFile);
    toast.success(
      isRTL ? `تم اختيار الملف: ${selectedFile.name}` : `File selected: ${selectedFile.name}`,
      {
        duration: 3000,
        position: isRTL ? 'bottom-left' : 'bottom-right',
      }
    );
  };

  const handleDataMapped = async (mappedData: any[]) => {
    try {
      console.log('Starting import with mapped data:', mappedData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        await Swal.fire({
          icon: 'error',
          title: t('errors.unauthorized'),
          text: isRTL ? 'يرجى تسجيل الدخول أولاً' : 'Please login first',
        });
        return;
      }

      await Swal.fire({
        title: isRTL ? 'جاري معالجة البيانات...' : 'Processing data...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const result = await importLogic.importClients(mappedData, user.id);
      console.log('Import result:', result);

      if (result.duplicates > 0) {
        const duplicateMessage = isRTL
          ? `تم العثور على ${result.duplicates} عميل تم إضافته سابقاً`
          : `Found ${result.duplicates} duplicate clients`;
        
        const duplicateDetails = result.duplicateDetails
          .map(d => isRTL 
            ? `${d.name} (${d.phone})`
            : `${d.name} (${d.phone})`
          )
          .join('\n');

        await Swal.fire({
          icon: 'warning',
          title: duplicateMessage,
          text: duplicateDetails,
          confirmButtonText: isRTL ? 'حسناً' : 'OK'
        });
      }

      if (result.imported > 0) {
        const successMessage = isRTL
          ? `تم استيراد ${result.imported} عميل جديد بنجاح`
          : `Successfully imported ${result.imported} new clients`;
        
        await Swal.fire({
          icon: 'success',
          title: isRTL ? 'تم الاستيراد بنجاح' : 'Import Successful',
          text: successMessage,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }

      if (result.imported === 0) {
        if (result.duplicates > 0) {
          const allDuplicatesMessage = isRTL
            ? `جميع العملاء (${result.duplicates} عميل) تم إضافتهم سابقاً`
            : `All clients (${result.duplicates}) were duplicates`;
          
          await Swal.fire({
            icon: 'info',
            title: isRTL ? 'لم يتم إضافة عملاء جدد' : 'No New Clients Added',
            text: allDuplicatesMessage
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: isRTL ? 'خطأ' : 'Error',
            text: t('clients.importClients.noValidData')
          });
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      
      setOpen(false);
      setFile(null);

    } catch (error: any) {
      console.error('Error importing clients:', error);
      
      let errorMessage = error.message || t('errors.importFailed');
      if (error.message?.includes('Failed to fetch') && 
          error.stack?.includes('kaspersky-labs')) {
        errorMessage = isRTL ? 
          'يرجى تعطيل كاسبرسكي مؤقتاً أو إضافة النطاق إلى القائمة البيضاء' : 
          'Please temporarily disable Kaspersky or add the domain to whitelist';
      }

      await Swal.fire({
        icon: 'error',
        title: isRTL ? 'حدث خطأ' : 'Error',
        text: errorMessage
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200",
              isRTL ? "text-right" : "text-left"
            )}
          >
            <div className="flex items-center gap-3">
              <FileUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                {t("clients.importClients.title")}
              </span>
            </div>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{t("clients.importClients.title")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)] mt-6 pr-4">
          {!file ? (
            <FileDropZone onFileSelect={handleFileSelect} />
          ) : (
            <FieldMapping file={file} onDataMapped={handleDataMapped} />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}