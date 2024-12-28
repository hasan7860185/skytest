import { supabase } from "@/integrations/supabase/client";
import { validatePhoneNumber } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ImportResult {
  success: number;
  duplicates: number;
  duplicateDetails: Array<{ name: string; phone: string }>;
}

interface ImportLogicProps {
  onComplete: (result: ImportResult) => void;
  onError: (error: string) => void;
}

export function useImportLogic({ onComplete, onError }: ImportLogicProps) {
  const { toast } = useToast();
  const BATCH_SIZE = 100;

  // كاش لتخزين أرقام الهواتف الموجودة
  let phoneNumbersCache = new Set<string>();
  let lastCacheUpdate = 0;
  const CACHE_TTL = 5 * 60 * 1000; // 5 دقائق

  const refreshPhoneNumbersCache = async () => {
    const now = Date.now();
    if (now - lastCacheUpdate < CACHE_TTL && phoneNumbersCache.size > 0) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("clients")
        .select("phone")
        .not("phone", "is", null);

      if (error) throw error;

      phoneNumbersCache = new Set(data.map(client => client.phone));
      lastCacheUpdate = now;
    } catch (error) {
      console.error("Error refreshing phone numbers cache:", error);
      throw new Error("فشل في تحديث قائمة أرقام الهواتف");
    }
  };

  const processClients = async (clients: any[]) => {
    try {
      await refreshPhoneNumbersCache();

      let newClients: any[] = [];
      let duplicates: any[] = [];
      let duplicateDetails: Array<{ name: string; phone: string }> = [];
      let processedCount = 0;
      const totalClients = clients.length;

      // معالجة العملاء
      for (const client of clients) {
        processedCount++;

        // تنظيف وتحقق من رقم الهاتف
        const phone = validatePhoneNumber(client.phone);
        if (!phone) continue;

        // التحقق من التكرار
        if (phoneNumbersCache.has(phone)) {
          duplicates.push(client);
          duplicateDetails.push({
            name: client.name || '',
            phone: phone
          });
          continue;
        }

        // إضافة العميل الجديد
        const timestamp = new Date().toISOString();
        newClients.push({
          ...client,
          phone,
          created_at: timestamp,
          updated_at: timestamp,
          status: "new",
          country: "Egypt",
          contact_method: "phone"
        });

        // تحديث الكاش
        phoneNumbersCache.add(phone);

        // إدخال البيانات على دفعات
        if (newClients.length >= BATCH_SIZE) {
          await insertBatch(newClients);
          newClients = [];
        }
      }

      // إدخال الدفعة الأخيرة
      if (newClients.length > 0) {
        await insertBatch(newClients);
      }

      const result: ImportResult = {
        success: processedCount - duplicates.length,
        duplicates: duplicates.length,
        duplicateDetails
      };

      // عرض نتيجة الاستيراد
      toast({
        title: "تم الاستيراد بنجاح",
        description: `تم استيراد ${result.success} عميل، ${result.duplicates} مكرر`,
        duration: 5000,
      });

      onComplete(result);

    } catch (error) {
      console.error("Error processing clients:", error);
      const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      toast({
        title: "خطأ",
        description: message,
        variant: "destructive",
        duration: 5000,
      });
      onError(message);
    }
  };

  const insertBatch = async (batch: any[]) => {
    try {
      const { error } = await supabase
        .from("clients")
        .insert(batch)
        .throwOnError();

      if (error) throw error;
    } catch (error) {
      console.error("Error inserting batch:", error);
      throw new Error("فشل في حفظ البيانات");
    }
  };

  return {
    processClients,
  };
}