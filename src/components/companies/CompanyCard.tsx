import { Company } from "@/types/company";
import { CompanyCardActions } from "./CompanyCardActions";
import { CompanyCardContent } from "./CompanyCardContent";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
}

export function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={cn(
      "relative group",
      "bg-white dark:bg-gray-800/50",
      "rounded-lg shadow-sm hover:shadow-md transition-shadow",
      "p-6 border border-gray-200/20 dark:border-gray-700/30",
      "backdrop-blur-sm"
    )}>
      <CompanyCardActions
        companyId={company.id}
        companyName={company.name}
        companyDescription={company.description}
        isRTL={isRTL}
      />
      <CompanyCardContent
        name={company.name}
        description={company.description}
        isRTL={isRTL}
      />
    </div>
  );
}