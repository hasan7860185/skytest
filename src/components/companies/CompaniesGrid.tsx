import { Company } from "@/types/company";
import { CompanyCard } from "./CompanyCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CompaniesGridProps {
  companies: Company[];
  isLoading: boolean;
}

export function CompaniesGrid({ companies, isLoading }: CompaniesGridProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleEditCompany = (company: Company) => {
    navigate(`/companies/${company.id}`);
  };

  const handleDeleteCompany = async (companyId: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    } catch (err) {
      console.error('Error deleting company:', err);
      toast.error('Error deleting company');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-[300px] rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onEdit={handleEditCompany}
            onDelete={handleDeleteCompany}
          />
        ))}
      </div>
    </ScrollArea>
  );
}