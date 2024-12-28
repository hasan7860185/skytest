import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const rowsPerPageOptions = [10, 25, 50, 100, 250, 500] as const;
export type RowsPerPage = (typeof rowsPerPageOptions)[number];

interface ClientsRowsPerPageProps {
  value: RowsPerPage;
  onChange: (value: RowsPerPage) => void;
}

export function ClientsRowsPerPage({ value, onChange }: ClientsRowsPerPageProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "w-[180px] justify-between",
            "bg-white/5 dark:bg-gray-800/50 hover:bg-gray-50/90 dark:hover:bg-gray-700/50",
            "text-gray-700 dark:text-gray-100 border-gray-200/20 dark:border-gray-700/30",
            isRTL && "font-cairo"
          )}
        >
          {t("table.showRows", { count: value })}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className={cn(
          "w-[180px]",
          "bg-white dark:bg-gray-800/90",
          "border-gray-200/20 dark:border-gray-700/30"
        )}
      >
        {rowsPerPageOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              "text-gray-700 dark:text-gray-100",
              "hover:bg-gray-50/90 dark:hover:bg-gray-700/50",
              isRTL && "font-cairo"
            )}
          >
            {t("table.showRows", { count: option })}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}