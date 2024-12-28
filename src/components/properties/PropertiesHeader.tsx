import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface PropertiesHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PropertiesHeader({ searchQuery, onSearchChange }: PropertiesHeaderProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={cn(
      "flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full lg:w-[180%] mx-auto",
      "bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200/20 dark:border-gray-700/30 p-4",
      "backdrop-blur-sm shadow-sm",
      isRTL ? "md:flex-row-reverse" : ""
    )}>
      <h1 className={cn(
        "text-2xl font-semibold text-gray-900 dark:text-gray-100",
        isRTL ? "font-cairo" : ""
      )}>
        {t("properties.title")}
      </h1>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400",
            isRTL ? "right-3" : "left-3"
          )} />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isRTL ? "ابحث عن عقار..." : "Search properties..."}
            className={cn(
              isRTL ? "pr-10 text-right font-cairo" : "pl-10",
              "w-full bg-gray-50 dark:bg-gray-900/50"
            )}
          />
        </div>
        <Button 
          className={cn(
            "gap-2 bg-primary hover:bg-primary-dark",
            isRTL ? "flex-row-reverse" : ""
          )}
          onClick={() => navigate("/properties/add")}
        >
          <Plus className="w-4 h-4" />
          {t("properties.addProperty")}
        </Button>
      </div>
    </div>
  );
}