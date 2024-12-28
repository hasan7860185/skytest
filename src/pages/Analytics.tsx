import { useTranslation } from "react-i18next";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { ClientDistributionChart } from "@/components/analytics/ClientDistributionChart";
import { SalesPerformanceChart } from "@/components/analytics/SalesPerformanceChart";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { AnalyticsStats } from "@/components/analytics/AnalyticsStats";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export default function Analytics() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Fetch clients data for charts with retry logic
  const { data: clientsData, isLoading, error } = useQuery({
    queryKey: ['analytics-clients'],
    queryFn: async () => {
      try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
          .from('clients')
          .select('id, created_at, status')
          .gte('created_at', startOfMonth.toISOString());

        if (error) throw error;
        
        return data || [];
      } catch (error: any) {
        console.error('Error fetching clients data:', error);
        
        // Check if error is from security software
        if (error.message?.includes('Failed to fetch') && 
            error.stack?.includes('kaspersky-labs')) {
          toast.error(
            isRTL ? 
            'يبدو أن برنامج الحماية يمنع الاتصال. الرجاء تعطيل برامج الحماية مؤقتاً أو إضافة النطاق إلى القائمة البيضاء' :
            'Security software is blocking the connection. Please temporarily disable security software or whitelist the domain'
          );
        }
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry if it's a security software block
      if (error.stack?.includes('kaspersky-labs')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000)
  });

  // Show security software warning if detected
  const isSecurityBlocking = error?.stack?.includes('kaspersky-labs');

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <DashboardContent>
        <div className="space-y-6 p-6 pt-20 w-full">
          {isSecurityBlocking && (
            <Alert variant="destructive" className="mb-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                {isRTL ? 
                  'يبدو أن برنامج الحماية (Kaspersky) يمنع الاتصال بالخادم. الرجاء تعطيل برامج الحماية مؤقتاً أو إضافة النطاق jrxxemchkytvqqsvloso.supabase.co إلى القائمة البيضاء' :
                  'Security software (Kaspersky) is blocking the server connection. Please temporarily disable security software or whitelist the domain jrxxemchkytvqqsvloso.supabase.co'
                }
              </AlertDescription>
            </Alert>
          )}

          <AnalyticsHeader isRTL={isRTL} />
          <AnalyticsStats isRTL={isRTL} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="bg-white p-6 rounded-lg shadow-sm w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className={cn(
                  "text-lg font-semibold text-gray-900",
                  isRTL && "font-cairo"
                )}>
                  {isRTL ? 'أداء المبيعات' : 'Sales Performance'}
                </h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select className="text-sm border-none focus:ring-0">
                    <option>{isRTL ? 'جميع العقارات' : 'All Properties'}</option>
                    <option>{isRTL ? 'سكني' : 'Residential'}</option>
                    <option>{isRTL ? 'تجاري' : 'Commercial'}</option>
                  </select>
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <SalesPerformanceChart data={clientsData || []} />
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm w-full">
              <h2 className={cn(
                "text-lg font-semibold text-gray-900 mb-6",
                isRTL && "font-cairo"
              )}>
                {isRTL ? 'توزيع حالات العملاء' : 'Client Status Distribution'}
              </h2>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ClientDistributionChart data={clientsData || []} />
              )}
            </div>
          </div>
        </div>
      </DashboardContent>
    </div>
  );
}