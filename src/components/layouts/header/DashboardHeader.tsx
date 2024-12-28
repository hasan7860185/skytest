import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { DashboardSearch } from "./DashboardSearch";
import { DashboardActions } from "./DashboardActions";

interface DashboardHeaderProps {
  onSidebarToggle: () => void;
}

export function DashboardHeader({ onSidebarToggle }: DashboardHeaderProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-primary text-primary-foreground h-14 shadow-sm">
      <div className="h-full px-4 flex justify-between items-center">
        {/* Left side */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary-light/50 text-primary-foreground active:bg-primary-light/30 focus:bg-primary-light/30"
            onClick={onSidebarToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className={cn(
              "text-sm md:text-lg font-semibold text-primary-foreground transition-all duration-300 truncate max-w-[120px] md:max-w-none",
              isRTL ? "font-cairo" : "font-sans",
              "hover:text-white"
            )}>
              {t("dashboard.title")}
            </h1>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-1 md:gap-4">
          <DashboardSearch />
          <DashboardActions />
        </div>
      </div>
    </header>
  );
}