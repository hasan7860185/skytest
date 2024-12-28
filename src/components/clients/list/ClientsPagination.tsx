import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ClientsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ClientsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ClientsPaginationProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.slice(
    Math.max(0, currentPage - 2),
    Math.min(totalPages, currentPage + 1)
  );

  return (
    <nav
      role="navigation"
      aria-label={t("table.pagination")}
      className={cn(
        "flex justify-center items-center gap-1",
        isRTL && "flex-row-reverse"
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "bg-[#191970] text-white",
          "hover:bg-[#191970]/90",
          "border-[#191970]/20 dark:border-gray-700/30"
        )}
      >
        {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        <span className="sr-only">{t("table.previous")}</span>
      </Button>

      {visiblePages[0] > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            className={cn(
              "bg-[#191970] text-white",
              "hover:bg-[#191970]/90",
              "border-[#191970]/20 dark:border-gray-700/30"
            )}
          >
            1
          </Button>
          {visiblePages[0] > 2 && (
            <span className="px-2 text-[#191970] dark:text-gray-400">...</span>
          )}
        </>
      )}

      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(page)}
          className={cn(
            currentPage === page
              ? "bg-[#191970] text-white hover:bg-[#191970]/90"
              : cn(
                  "bg-[#191970] text-white",
                  "hover:bg-[#191970]/90",
                  "border-[#191970]/20 dark:border-gray-700/30"
                )
          )}
        >
          {page}
        </Button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-[#191970] dark:text-gray-400">...</span>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            className={cn(
              "bg-[#191970] text-white",
              "hover:bg-[#191970]/90",
              "border-[#191970]/20 dark:border-gray-700/30"
            )}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "bg-[#191970] text-white",
          "hover:bg-[#191970]/90",
          "border-[#191970]/20 dark:border-gray-700/30"
        )}
      >
        {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span className="sr-only">{t("table.next")}</span>
      </Button>
    </nav>
  );
}