import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileUp } from "lucide-react";
import { useState, useCallback } from "react";
import { FileDropZone } from "./FileDropZone";
import { FieldMapping } from "./FieldMapping";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface ImportClientsSheetProps {
  children?: React.ReactNode;
}

export function ImportClientsSheet({ children }: ImportClientsSheetProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const queryClient = useQueryClient();

  const handleFileSelect = useCallback((selectedFile: File) => {
    console.log('File selected:', selectedFile.name);
    setFile(selectedFile);
    toast({
      title: isRTL ? 'تم اختيار الملف' : 'File Selected',
      description: selectedFile.name,
      duration: 3000,
    });
  }, [isRTL, toast]);

  const handleImportComplete = useCallback(async (results: any) => {
    try {
      setIsImporting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: t('errors.unauthorized'),
          description: isRTL ? 'يرجى تسجيل الدخول أولاً' : 'Please login first',
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      // تحديث البيانات
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      
      // إغلاق النافذة وإعادة تعيين الحالة
      setOpen(false);
      setFile(null);

      toast({
        title: isRTL ? 'تم الاستيراد بنجاح' : 'Import Successful',
        description: isRTL 
          ? `تم استيراد ${results.success} عميل، ${results.duplicates} مكرر`
          : `Imported ${results.success} clients, ${results.duplicates} duplicates`,
        duration: 5000,
      });

    } catch (error) {
      console.error('Error handling import:', error);
      toast({
        title: t('errors.title'),
        description: error instanceof Error ? error.message : t('errors.unknown'),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsImporting(false);
    }
  }, [isRTL, queryClient, t, toast]);

  const handleError = useCallback((error: string) => {
    toast({
      title: t('errors.title'),
      description: error,
      variant: "destructive",
      duration: 5000,
    });
  }, [t, toast]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
            disabled={isImporting}
            className={cn(
              "flex items-center gap-2",
              isRTL ? "font-cairo" : ""
            )}
          >
            <FileUp className="h-4 w-4" />
            {isImporting 
              ? t('clients.importClients.importing')
              : t('clients.importClients.button')
            }
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side={isRTL ? "right" : "left"}
        className="w-full sm:max-w-xl"
      >
        <SheetHeader>
          <SheetTitle className={cn(
            "text-lg font-semibold",
            isRTL ? "text-right font-cairo" : ""
          )}>
            {t('clients.importClients.title')}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-full mt-4">
          {!file ? (
            <FileDropZone onFileSelect={handleFileSelect} />
          ) : (
            <FieldMapping
              file={file}
              onComplete={handleImportComplete}
              onError={handleError}
              isImporting={isImporting}
            />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}