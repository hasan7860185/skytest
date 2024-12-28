import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardContent({ children, className }: ContentWrapperProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <div
      className={cn(
        "w-full min-h-screen bg-background", // Reset width to 100%
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
}