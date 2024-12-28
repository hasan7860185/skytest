import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { RegionCard } from "./RegionCard";
import { Region } from "@/types/region";

interface RegionsContentProps {
  regions: Region[] | null;
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (region: Region) => void;
  onDelete: (id: string) => void;
  onView: (region: Region) => void;
}

export function RegionsContent({
  regions,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  onView
}: RegionsContentProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-4 p-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className={cn(
          "text-2xl font-semibold",
          isRTL && "font-cairo"
        )}>
          {t("nav.regions")}
        </h1>
        <Button 
          onClick={onAdd}
          className={cn(
            "gap-2",
            isRTL && "flex-row-reverse font-cairo"
          )}
        >
          <Plus className="h-4 w-4" />
          {isRTL ? "إضافة منطقة" : "Add Region"}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {regions?.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              isRTL={isRTL}
              onEdit={() => onEdit(region)}
              onDelete={onDelete}
              onView={() => onView(region)}
            />
          ))}
        </div>
      )}
    </div>
  );
}