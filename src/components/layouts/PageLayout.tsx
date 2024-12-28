import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div 
      className={cn(
        "p-6 pt-20", // Added pt-20 for top padding to account for the header
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
}