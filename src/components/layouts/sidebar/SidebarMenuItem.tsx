import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { staticClientStatuses } from "@/data/clientStatuses";
import { Users } from "lucide-react";

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  hasSubmenu?: boolean;
  submenu?: Array<{
    icon: any;
    label: string;
  }>;
}

interface SidebarMenuItemProps {
  item: MenuItem;
  buttonClasses: string;
  isRTL: boolean;
  onNavigate: (path: string) => void;
}

export function SidebarMenuItem({ item, buttonClasses, isRTL, onNavigate }: SidebarMenuItemProps) {
  const { t } = useTranslation();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  
  const handleItemClick = (path: string) => {
    if (item.hasSubmenu) {
      setIsSubmenuOpen(!isSubmenuOpen);
    } else {
      onNavigate(path);
    }
  };

  const handleStatusClick = (status: string) => {
    onNavigate(`/clients/${status}`);
    setIsSubmenuOpen(false);
  };

  // Function to get icon color based on path
  const getIconColor = (path: string) => {
    switch (path) {
      case '/':
        return 'text-[#4285F4]'; // Light blue for dashboard
      case '/clients':
        return 'text-[#34A853]'; // Green for clients
      case '/tasks':
        return 'text-[#FBBC05]'; // Yellow for tasks
      case '/chat':
        return 'text-[#A142F4]'; // Purple for chat
      case '/properties':
        return 'text-[#00BCD4]'; // Cyan for properties
      case '/companies':
        return 'text-[#E91E63]'; // Pink for companies
      case '/regions':
        return 'text-[#EA4335]'; // Red for regions
      case '/android-download':
        return 'text-[#9E9E9E]'; // Gray for download
      default:
        return 'text-[#4285F4]'; // Default light blue
    }
  };

  if (item.hasSubmenu) {
    return (
      <div className="space-y-1">
        <Button
          variant="ghost"
          className={cn(
            buttonClasses,
            "border-2 border-[#E5DEFF]/30 rounded-lg",
            "bg-[#f0f8ff] hover:bg-[#f0f8ff]/80",
            "hover:border-[#E5DEFF]/50 transition-all duration-300",
            "focus:border-[#E5DEFF]/70 focus:ring-2 focus:ring-[#E5DEFF]/20",
            isRTL ? "text-right" : "text-left"
          )}
          onClick={() => handleItemClick(item.path)}
        >
          <div className="flex items-center gap-3 w-full">
            <item.icon className={cn("h-5 w-5", getIconColor(item.path))} />
            <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
              {t(item.label)}
            </span>
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isSubmenuOpen ? "rotate-180" : ""
              )} 
            />
          </div>
        </Button>

        {isSubmenuOpen && (
          <div className={cn(
            "pl-4 space-y-1",
            isRTL ? "pr-4 pl-0" : "pl-4 pr-0"
          )}>
            {/* All Clients Option */}
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-sm text-gray-800",
                "bg-[#f0f8ff] hover:bg-[#f0f8ff]/80 transition-colors",
                isRTL ? "text-right" : "text-left"
              )}
              onClick={() => handleStatusClick('all')}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#4285F4]" />
                <span>{t('status.all')}</span>
              </div>
            </Button>

            {/* Status Options */}
            {staticClientStatuses.map((status) => (
              <Button
                key={status.key}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm text-gray-800",
                  "bg-[#f0f8ff] hover:bg-[#f0f8ff]/80 transition-colors",
                  isRTL ? "text-right" : "text-left"
                )}
                onClick={() => handleStatusClick(status.key)}
              >
                <div className="flex items-center gap-2">
                  <status.icon className="h-4 w-4 text-[#4285F4]" />
                  <span>{t(`status.${status.key}`)}</span>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        buttonClasses,
        "border-2 border-[#E5DEFF]/30 rounded-lg",
        "bg-[#f0f8ff] hover:bg-[#f0f8ff]/80",
        "hover:border-[#E5DEFF]/50 transition-all duration-300",
        "focus:border-[#E5DEFF]/70 focus:ring-2 focus:ring-[#E5DEFF]/20",
        isRTL ? "text-right" : "text-left"
      )}
      onClick={() => handleItemClick(item.path)}
    >
      <div className="flex items-center gap-3 w-full">
        <item.icon className={cn("h-5 w-5", getIconColor(item.path))} />
        <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
          {t(item.label)}
        </span>
      </div>
    </Button>
  );
}