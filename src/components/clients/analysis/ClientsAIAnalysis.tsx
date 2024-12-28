import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useGeminiAI } from "@/hooks/useGeminiAI";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Client } from "@/types/client";

interface ClientsAIAnalysisProps {
  clientId?: string;
}

interface AnalysisResult {
  urgentActions: Array<{
    clientName: string;
    action: string;
    reason: string;
  }>;
  insights: string[];
  recommendations: string[];
}

export function ClientsAIAnalysis({ clientId }: ClientsAIAnalysisProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { generateText, isLoading } = useGeminiAI();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const analyzeClients = async () => {
      try {
        // Fetch all clients or specific client
        const query = supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });

        if (clientId) {
          query.eq('id', clientId);
        }

        const { data: clients, error } = await query;

        if (error) throw error;

        if (!clients || clients.length === 0) {
          toast.error(isRTL ? 'لا يوجد عملاء للتحليل' : 'No clients to analyze');
          return;
        }

        // Prepare client data for analysis
        const clientsData = clients.map(client => ({
          name: client.name,
          status: client.status,
          comments: client.comments || [],
          nextActionDate: client.next_action_date,
          nextActionType: client.next_action_type,
          createdAt: client.created_at
        }));

        // Generate analysis prompt
        const prompt = `
          تحليل بيانات العملاء التالية وتقديم تحليل مفصل:
          
          بيانات العملاء:
          ${JSON.stringify(clientsData, null, 2)}
          
          المطلوب:
          1. تحديد العملاء الذين يحتاجون إجراءات عاجلة مع ذكر السبب
          2. تقديم رؤى عامة عن حالة العملاء
          3. توصيات محددة للتعامل مع كل حالة
          
          قم بتنسيق الإجابة بالشكل التالي (JSON فقط):
          {
            "urgentActions": [
              {
                "clientName": "اسم العميل",
                "action": "الإجراء المطلوب",
                "reason": "سبب الإجراء"
              }
            ],
            "insights": [
              "رؤية 1",
              "رؤية 2"
            ],
            "recommendations": [
              "توصية 1",
              "توصية 2"
            ]
          }
        `;

        const response = await generateText(prompt);
        if (!response) throw new Error('Failed to generate analysis');

        const analysisData = JSON.parse(response);
        setAnalysis(analysisData);

      } catch (err) {
        console.error('Error analyzing clients:', err);
        toast.error(isRTL ? 'حدث خطأ أثناء تحليل العملاء' : 'Error analyzing clients');
      }
    };

    analyzeClients();
  }, [clientId, generateText, isRTL, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        {isRTL ? 'لا يوجد تحليل متاح' : 'No analysis available'}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Urgent Actions */}
      {analysis.urgentActions.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4 text-red-700 dark:text-red-400">
              {isRTL ? 'إجراءات عاجلة مطلوبة' : 'Urgent Actions Required'}
            </h3>
            <ul className="space-y-4">
              {analysis.urgentActions.map((action, index) => (
                <li key={index} className="border-b border-red-100 dark:border-red-800 pb-4">
                  <div className="font-medium text-red-600 dark:text-red-400">
                    {action.clientName}
                  </div>
                  <div className="text-sm mt-1">{action.action}</div>
                  <div className="text-sm text-muted-foreground mt-1">{action.reason}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">
            {isRTL ? 'التحليلات والرؤى' : 'Insights'}
          </h3>
          <ul className="space-y-2">
            {analysis.insights.map((insight, index) => (
              <li key={index} className="text-sm">• {insight}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">
            {isRTL ? 'التوصيات' : 'Recommendations'}
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm">• {recommendation}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}