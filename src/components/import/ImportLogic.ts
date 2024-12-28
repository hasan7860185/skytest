import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ImportResult {
  imported: number;
  duplicates: number;
  duplicateDetails: Array<{ name: string; phone: string }>;
  data?: any[]; // Add this to store the actual data
}

interface UseImportLogicProps {
  onComplete: (result: ImportResult) => Promise<void>;
  onError: (error: any) => Promise<void>;
}

export const useImportLogic = ({ onComplete, onError }: UseImportLogicProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processClients = async (mappedData: any[]) => {
    try {
      setIsProcessing(true);
      const result: ImportResult = {
        imported: 0,
        duplicates: 0,
        duplicateDetails: [],
        data: mappedData
      };

      for (const client of mappedData) {
        const { data: existingClients } = await supabase
          .from('clients')
          .select('id, name, phone')
          .eq('phone', client.phone);

        if (existingClients && existingClients.length > 0) {
          result.duplicates++;
          result.duplicateDetails.push({
            name: existingClients[0].name,
            phone: existingClients[0].phone
          });
          continue;
        }

        const { error: insertError } = await supabase
          .from('clients')
          .insert([client]);

        if (insertError) throw insertError;
        result.imported++;
      }

      await onComplete(result);
    } catch (error) {
      console.error('Error processing clients:', error);
      await onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processClients,
    isProcessing
  };
};