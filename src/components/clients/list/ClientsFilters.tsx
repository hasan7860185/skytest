import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedUser: string | null;
  onUserChange: (userId: string | null) => void;
  showFavorites: boolean;
  onFavoritesChange: (show: boolean) => void;
}

export function ClientsFilters({
  searchQuery,
  onSearchChange,
  selectedUser,
  onUserChange,
  showFavorites,
  onFavoritesChange,
}: ClientsFiltersProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="flex flex-wrap gap-4 bg-[#f0f8ff] dark:bg-[#f0f8ff] p-2 sm:p-4 rounded-lg shadow-sm">
      <Input
        type="search"
        placeholder={isRTL ? "بحث" : "Search"}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={cn(
          "w-[calc(100%-1rem)] sm:w-auto flex-1",
          "bg-white dark:bg-gray-800/50",
          "border-gray-200/20 dark:border-gray-700/30",
          "text-gray-700 dark:text-gray-100",
          "placeholder:text-gray-500 dark:placeholder:text-gray-400",
          isRTL && "font-cairo"
        )}
      />
      <Button
        variant="outline"
        onClick={() => onUserChange(null)}
        className={cn(
          "gap-2",
          "bg-white dark:bg-gray-800/50",
          "hover:bg-gray-50/90 dark:hover:bg-gray-700/50",
          "text-gray-700 dark:text-gray-100",
          "border-gray-200/20 dark:border-gray-700/30",
          isRTL && "font-cairo"
        )}
      >
        <Users className="h-4 w-4" />
        {isRTL ? "جميع المستخدمين" : "All Users"}
      </Button>
    </div>
  );
}