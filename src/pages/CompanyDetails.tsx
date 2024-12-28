import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { useSidebar } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { CompanyHeader } from "@/components/companies/details/CompanyHeader";
import { CompanyProjects } from "@/components/companies/details/CompanyProjects";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function CompanyDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { open } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const queryClient = useQueryClient();

  const { data: company, isLoading, error, refetch } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      console.log("Fetching company details for ID:", id);
      
      if (!id) {
        console.error("No company ID provided");
        throw new Error("No company ID provided");
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .single();
        
        if (supabaseError) {
          console.error("Supabase error:", supabaseError);
          throw supabaseError;
        }
        
        if (!data) {
          console.error("No company found");
          throw new Error("Company not found");
        }
        
        console.log("Fetched company data:", data);
        return data;
      } catch (error) {
        console.error("Error in query function:", error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const handleRetry = () => {
    toast.promise(refetch(), {
      loading: isRTL ? 'جاري إعادة المحاولة...' : 'Retrying...',
      success: isRTL ? 'تم تحديث البيانات بنجاح' : 'Data refreshed successfully',
      error: isRTL ? 'فشلت إعادة المحاولة' : 'Retry failed'
    });
  };

  if (error) {
    return (
      <DashboardLayout>
        <DashboardSidebar open={open} />
        <DashboardContent>
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="text-center mb-4 text-red-500">
              {isRTL ? "حدث خطأ أثناء جلب بيانات الشركة" : "Error loading company details"}
            </div>
            <Button 
              onClick={handleRetry}
              variant="outline"
              className={cn(
                "flex items-center gap-2",
                isRTL ? "flex-row-reverse font-cairo" : ""
              )}
            >
              <RefreshCw className="h-4 w-4" />
              {isRTL ? "إعادة المحاولة" : "Retry"}
            </Button>
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSidebar open={open} />
        <DashboardContent>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <DashboardSidebar open={open} />
        <DashboardContent>
          <div className="text-center py-8">
            {t("companies.notFound")}
          </div>
        </DashboardContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardSidebar open={open} />
      <DashboardContent>
        <div className={cn(
          "max-w-4xl mx-auto px-4 pt-6",
          isRTL ? "font-cairo" : ""
        )}>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full">
            <CompanyHeader 
              name={company.name}
              description={company.description}
              isRTL={isRTL}
              companyId={id!}
            />
            {id && <CompanyProjects companyId={id} isRTL={isRTL} />}
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}