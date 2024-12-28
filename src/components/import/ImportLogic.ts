import { supabase } from "@/integrations/supabase/client";
import { validatePhoneNumber } from "@/lib/utils";

interface ImportResult {
  imported: number;
  duplicates: number;
  duplicateDetails: Array<{ name: string; phone: string }>;
}

interface ImportLogicProps {
  onComplete: (result: ImportResult) => void;
  onError: (error: string) => void;
}

export function useImportLogic({ onComplete, onError }: ImportLogicProps) {
  const BATCH_SIZE = 100;

  // Cache for phone numbers
  let phoneNumbersCache = new Set<string>();
  let lastCacheUpdate = 0;
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
      throw new Error("Failed to update phone numbers list");
    }
  };

  const processClients = async (clients: any[]) => {
    try {
      await refreshPhoneNumbersCache();

      let newClients: any[] = [];
      let duplicates: any[] = [];
      let duplicateDetails: Array<{ name: string; phone: string }> = [];
      let processedCount = 0;

      // Process clients
      for (const client of clients) {
        processedCount++;

        // Clean and validate phone number
        const validatedPhone = validatePhoneNumber(client.phone);
        if (!validatedPhone) continue;

        const phone = client.phone;

        // Check for duplicates
        if (phoneNumbersCache.has(phone)) {
          duplicates.push(client);
          duplicateDetails.push({
            name: client.name || '',
            phone: phone
          });
          continue;
        }

        // Add new client
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

        // Update cache
        phoneNumbersCache.add(phone);

        // Insert in batches
        if (newClients.length >= BATCH_SIZE) {
          await insertBatch(newClients);
          newClients = [];
        }
      }

      // Insert final batch
      if (newClients.length > 0) {
        await insertBatch(newClients);
      }

      const result: ImportResult = {
        imported: processedCount - duplicates.length,
        duplicates: duplicates.length,
        duplicateDetails
      };

      onComplete(result);

    } catch (error) {
      console.error("Error processing clients:", error);
      const message = error instanceof Error ? error.message : "Unexpected error occurred";
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
      throw new Error("Failed to save data");
    }
  };

  return {
    processClients,
  };
}