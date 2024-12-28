import { cn } from "@/lib/utils";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentWrapper({ children, className }: ContentWrapperProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6",
      "border border-gray-200 dark:border-gray-700",
      className
    )}>
      {children}
    </div>
  );
}