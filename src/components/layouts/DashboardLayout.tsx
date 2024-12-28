import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardHeader } from "./header/DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { ScrollToTop } from "./ScrollToTop";
import { useEffect } from "react";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { open, setOpen } = useSidebar();

  const handleSidebarToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const handleCloseSidebar = () => {
      setOpen(false);
    };

    window.addEventListener('closeSidebar', handleCloseSidebar);
    return () => {
      window.removeEventListener('closeSidebar', handleCloseSidebar);
    };
  }, [setOpen]);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col">
      <DashboardHeader onSidebarToggle={handleSidebarToggle} />

      <div className="flex min-h-[calc(100vh-3.5rem)] flex-grow">
        {/* Overlay for mobile */}
        {open && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        
        <DashboardSidebar open={open} />
        
        <main className={cn(
          "flex-1 transition-all duration-300",
          open ? (isRTL ? "mr-64" : "ml-64") : "m-0",
          "w-full"
        )}>
          {children}
        </main>
      </div>
      
      <ScrollToTop />
    </div>
  );
}