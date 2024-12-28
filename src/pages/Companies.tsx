import { useTranslation } from "react-i18next";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CompaniesAIAnalysis } from "@/components/companies/analysis/CompaniesAIAnalysis";
import { CompaniesHeader } from "@/components/companies/CompaniesHeader";
import { CompaniesGrid } from "@/components/companies/CompaniesGrid";
import { useState, useMemo, useEffect } from "react";
import { Company } from "@/types/company";

export default function Companies() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState("");
  const [authError, setAuthError] = useState(false);

  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) {
        console.error('Authentication error:', authError);
        setAuthError(true);
        toast.error(t('errors.authentication'));
        return;
      }
    };
    checkAuth();
  }, [t]);

  const { 
    data: companies = [], 
    isLoading, 
    error,
    refetch,
    isError 
  } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      try {
        console.log('Fetching companies...');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No active session');
        }

        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select(`
            *,
            projects(id, name, description),
            subscriptions(id)
          `)
          .eq('is_subscription_company', false)
          .is('subscriptions.id', null)
          .order('created_at', { ascending: false });
        
        if (companiesError) {
          console.error('Supabase error:', companiesError);
          throw companiesError;
        }

        const filteredCompanies = companiesData?.map(({ subscriptions, ...company }) => company) || [];
        console.log('Companies fetched:', filteredCompanies);
        return filteredCompanies;
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        if (error.message?.includes('JWT')) {
          toast.error(t('errors.sessionExpired'));
        } else {
          toast.error(t('companies.fetchError'));
        }
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !authError,
    meta: {
      errorMessage: t('companies.fetchError')
    }
  });

  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies;

    const query = searchQuery.toLowerCase();
    return companies.filter((company: Company) => {
      const matchesCompany = company.name.toLowerCase().includes(query) ||
        company.description?.toLowerCase().includes(query);

      const matchesProject = company.projects?.some(project => 
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );

      return matchesCompany || matchesProject;
    });
  }, [companies, searchQuery]);

  if (authError) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark">
        <DashboardContent>
          <Alert variant="destructive">
            <AlertDescription>
              {t('errors.authentication')}
            </AlertDescription>
          </Alert>
        </DashboardContent>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <DashboardContent>
        <div className="w-full pt-20">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200/20 dark:border-gray-700/30 backdrop-blur-sm shadow-sm">
            <div className="space-y-6">
              <CompaniesHeader 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              
              {isError && (
                <Alert variant="destructive" className="mx-6">
                  <AlertDescription className="flex items-center justify-between">
                    <span>{t('companies.fetchError')}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        refetch();
                        toast(t('companies.retrying'));
                      }}
                      className="ml-4"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('common.retry')}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {companies && companies.length > 0 && (
                <div className="px-6">
                  <CompaniesAIAnalysis 
                    companies={filteredCompanies}
                    isRTL={isRTL}
                  />
                </div>
              )}

              <div className="px-6 pb-6">
                <CompaniesGrid 
                  companies={filteredCompanies}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </DashboardContent>
    </div>
  );
}
