import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getSidebarItems } from "@/data/sidebarItems";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarClientActions } from "./sidebar/SidebarClientActions";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarContact } from "./sidebar/SidebarContact";

type DashboardSidebarProps = {
  open: boolean;
};

export function DashboardSidebar({ open }: DashboardSidebarProps) {
  const { t, i18n } = useTranslation();
  const [sidebarItems, setSidebarItems] = useState([]);
  const isRTL = i18n.language === 'ar';
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSidebarItems = async () => {
      const items = await getSidebarItems();
      const filteredItems = isMobile 
        ? items.filter(item => item.path !== '/android-download')
        : items;
      setSidebarItems(filteredItems);
    };
    loadSidebarItems();
  }, [isMobile]);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      const event = new CustomEvent('closeSidebar');
      window.dispatchEvent(event);
    }
  };

  const buttonClasses = cn(
    "w-full justify-between gap-3 bg-white",
    "transition-all duration-300 transform",
    "hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98]",
    "active:bg-gray-100 hover:shadow-md dark:text-gray-800"
  );

  return (
    <aside
      className={cn(
        "fixed top-14 bottom-0 z-30 flex flex-col bg-primary border-[#f8f8ff] shadow-lg",
        "transition-transform duration-300 ease-in-out transform",
        open ? "translate-x-0 w-64" : isRTL ? "translate-x-full -mr-64" : "-translate-x-full -ml-64",
        isRTL ? "right-0 border-l" : "left-0 border-r"
      )}
    >
      <ScrollArea className="flex-1" data-sidebar="sidebar">
        <nav className="flex-1 space-y-2 p-4">
          {/* Client Actions */}
          <SidebarClientActions 
            buttonClasses={buttonClasses}
            isRTL={isRTL}
            onMobileClose={() => isMobile && window.dispatchEvent(new CustomEvent('closeSidebar'))}
          />

          {/* Regular Menu Items */}
          {sidebarItems.map((item, index) => (
            <div 
              key={item.label} 
              className={cn(
                "py-1",
                index === 0 ? "" : 
                index === 5 ? "mt-6" : 
                index === 7 ? "mt-6" : 
                "mt-1"
              )}
            >
              <SidebarMenuItem
                item={item}
                buttonClasses={buttonClasses}
                isRTL={isRTL}
                onNavigate={handleNavigation}
              />
            </div>
          ))}
        </nav>
      </ScrollArea>

      <SidebarContact 
        buttonClasses={buttonClasses}
        isRTL={isRTL}
        onNavigate={handleNavigation}
      />
    </aside>
  );
}