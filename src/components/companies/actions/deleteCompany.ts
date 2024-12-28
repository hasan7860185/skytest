import { supabase } from "@/integrations/supabase/client";

export const deleteRelatedRecords = async (companyId: string) => {
  console.log('Starting to delete related records for company:', companyId);

  try {
    // 1. Delete AI insights first since it's causing the constraint error
    const { error: aiInsightsError } = await supabase
      .from('ai_company_insights')
      .delete()
      .eq('company_id', companyId);
    
    if (aiInsightsError) {
      console.error('Error deleting AI insights:', aiInsightsError);
      throw aiInsightsError;
    }
    console.log('Successfully deleted AI insights');

    // 2. Delete AI analysis
    const { error: aiAnalysisError } = await supabase
      .from('company_ai_analysis')
      .delete()
      .eq('company_id', companyId);
    
    if (aiAnalysisError) {
      console.error('Error deleting AI analysis:', aiAnalysisError);
      throw aiAnalysisError;
    }
    console.log('Successfully deleted AI analysis');

    // 3. Delete domains
    const { error: domainsError } = await supabase
      .from('domains')
      .delete()
      .eq('company_id', companyId);
    
    if (domainsError) {
      console.error('Error deleting domains:', domainsError);
      throw domainsError;
    }
    console.log('Successfully deleted domains');

    // 4. Update profiles to remove company_id reference
    const { error: profilesError } = await supabase
      .from('profiles')
      .update({ company_id: null })
      .eq('company_id', companyId);
    
    if (profilesError) {
      console.error('Error updating profiles:', profilesError);
      throw profilesError;
    }
    console.log('Successfully updated profiles');

    // 5. Update subscriptions to remove company_id reference
    const { error: subscriptionsError } = await supabase
      .from('subscriptions')
      .update({ company_id: null })
      .eq('company_id', companyId);
    
    if (subscriptionsError) {
      console.error('Error updating subscriptions:', subscriptionsError);
      throw subscriptionsError;
    }
    console.log('Successfully updated subscriptions');

    // 6. Delete all related projects
    const { error: projectsError } = await supabase
      .from('projects')
      .delete()
      .eq('company_id', companyId);
    
    if (projectsError) {
      console.error('Error deleting projects:', projectsError);
      throw projectsError;
    }
    console.log('Successfully deleted projects');

    console.log('Successfully deleted all related records for company:', companyId);
  } catch (error) {
    console.error('Error in deleteRelatedRecords:', error);
    throw error;
  }
};

export const deleteCompany = async (companyId: string) => {
  try {
    console.log('Starting company deletion process for company:', companyId);
    
    // First delete all related records
    await deleteRelatedRecords(companyId);
    
    // Then delete the company itself
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId);

    if (error) {
      console.error('Error in final company deletion:', error);
      throw error;
    }

    console.log('Successfully deleted company:', companyId);
  } catch (error) {
    console.error('Error in deleteCompany:', error);
    throw error;
  }
};