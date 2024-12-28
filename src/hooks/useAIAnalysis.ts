import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BaseAnalyzeParams {
  type: 'company' | 'search';
}

interface CompanyAnalyzeParams extends BaseAnalyzeParams {
  type: 'company';
  id: string;
  name: string;
  description?: string | null;
}

interface SearchAnalyzeParams extends BaseAnalyzeParams {
  type: 'search';
  query: string;
  data?: any; // Making data optional for search requests
}

type AnalyzeEntityParams = CompanyAnalyzeParams | SearchAnalyzeParams;

export function useAIAnalysis() {
  const getEntityAnalysis = useCallback(async (entityId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_company_insights')
        .select('analysis_data')
        .eq('company_id', entityId)
        .maybeSingle();

      if (error) throw error;
      return data?.analysis_data;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      return null;
    }
  }, []);

  const analyzeEntity = useCallback(async (entity: AnalyzeEntityParams) => {
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('analyze-entity', {
        body: { entity }
      });

      if (functionError) throw functionError;

      return functionData.analysis;
    } catch (error) {
      console.error('Error analyzing entity:', error);
      toast.error('حدث خطأ أثناء تحليل البيانات');
      return null;
    }
  }, []);

  return {
    analyzeEntity,
    getEntityAnalysis
  };
}