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
  const BATCH_SIZE = 50; // تقليل حجم الدفعة لتحسين الأداء
  const PARALLEL_BATCHES = 3; // عدد الدفعات المتوازية

  // كاش لتخزين أرقام الهواتف الموجودة
  let phoneNumbersCache = new Set<string>();
  let lastCacheUpdate = 0;
  const CACHE_TTL = 10 * 60 * 1000; // 10 دقائق

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

  const insertBatch = async (clients: any[]) => {
    if (clients.length === 0) return;

    try {
      const { error } = await supabase.from("clients").insert(clients);
      if (error) throw error;
    } catch (error) {
      console.error("Error inserting batch:", error);
      throw new Error("فشل في إدخال مجموعة من العملاء");
    }
  };

  const processBatchParallel = async (batches: any[][]) => {
    try {
      await Promise.all(batches.map(batch => insertBatch(batch)));
    } catch (error) {
      throw error;
    }
  };

  const processClients = async (clients: any[]) => {
    try {
      await refreshPhoneNumbersCache();

      let newClients: any[] = [];
      let currentBatch: any[] = [];
      let batches: any[][] = [];
      let duplicates: any[] = [];
      let duplicateDetails: Array<{ name: string; phone: string }> = [];
      let processedCount = 0;

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
        const newClient = {
          ...client,
          phone,
          created_at: timestamp,
          updated_at: timestamp,
          status: "new",
          country: "Egypt",
          contact_method: "phone"
        };

        currentBatch.push(newClient);
        phoneNumbersCache.add(phone);
        newClients.push(newClient);

        // إدارة الدفعات
        if (currentBatch.length >= BATCH_SIZE) {
          batches.push([...currentBatch]);
          currentBatch = [];

          // معالجة الدفعات المتوازية
          if (batches.length >= PARALLEL_BATCHES) {
            await processBatchParallel(batches);
            batches = [];
          }
        }
      }

      // معالجة الدفعات المتبقية
      if (currentBatch.length > 0) {
        batches.push(currentBatch);
      }
      if (batches.length > 0) {
        await processBatchParallel(batches);
      }

      // إرسال نتائج الاستيراد
      onComplete({
        success: newClients.length,
        duplicates: duplicates.length,
        duplicateDetails
      });

      // عرض رسالة نجاح
      toast({
        title: "تم الاستيراد بنجاح",
        description: `تم استيراد ${newClients.length} عميل، وتم تجاهل ${duplicates.length} عميل مكرر`,
        duration: 5000,
      });

    } catch (error) {
      console.error("Error processing clients:", error);
      onError(error instanceof Error ? error.message : "حدث خطأ غير معروف");
    }
  };

  return {
    processClients
  };
}