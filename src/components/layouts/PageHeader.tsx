import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, children, className }: PageHeaderProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={cn(
      "flex justify-between items-center",
      isRTL ? "flex-row-reverse" : "flex-row",
      className
    )}>
      <h1 className={cn(
        "text-2xl font-bold text-gray-900 dark:text-gray-100",
        isRTL && "font-cairo"
      )}>
        {title}
      </h1>
      {children && (
        <div className={cn(
          "flex gap-3",
          isRTL && "flex-row-reverse"
        )}>
          {children}
        </div>
      )}
    </div>
  );
}