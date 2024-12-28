import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompaniesSearch } from "./search/CompaniesSearch";
import { useNavigate } from "react-router-dom";

interface CompaniesHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CompaniesHeader({ searchQuery, onSearchChange }: CompaniesHeaderProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={cn(
      "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
      "p-6",
      isRTL ? "md:flex-row-reverse" : ""
    )}>
      <h1 className={cn(
        "text-2xl font-semibold",
        isRTL ? "font-cairo" : ""
      )}>
        {t("companies.title")}
      </h1>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <CompaniesSearch
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          isRTL={isRTL}
        />
        <Button 
          className={cn(
            "gap-2",
            "bg-primary hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70",
            isRTL ? "flex-row-reverse" : ""
          )}
          onClick={() => navigate("/companies/add")}
        >
          <Plus className="w-4 h-4" />
          {t("companies.addCompany")}
        </Button>
      </div>
    </div>
  );
}