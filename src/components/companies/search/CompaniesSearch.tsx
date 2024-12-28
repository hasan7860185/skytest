import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompaniesSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isRTL: boolean;
}

export function CompaniesSearch({ searchQuery, onSearchChange, isRTL }: CompaniesSearchProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Search className={cn(
        "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400",
        isRTL ? "left-3" : "right-3"
      )} />
      <Input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={isRTL ? "ابحث عن شركة أو مشروع..." : "Search for company or project..."}
        className={cn(
          "w-full pl-10",
          "bg-white/5 dark:bg-gray-800/50",
          "border-gray-200/20 dark:border-gray-700/30",
          "text-gray-700 dark:text-gray-100",
          "placeholder:text-gray-500 dark:placeholder:text-gray-400",
          isRTL && "font-cairo text-right"
        )}
      />
    </div>
  );
}