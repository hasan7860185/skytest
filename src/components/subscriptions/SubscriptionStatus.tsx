import { cn } from "@/lib/utils";

interface SubscriptionStatusProps {
  isActive: boolean;
  isRTL: boolean;
}

export function SubscriptionStatus({ isActive, isRTL }: SubscriptionStatusProps) {
  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      isActive 
        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
    )}>
      {isActive 
        ? (isRTL ? "نشط" : "Active")
        : (isRTL ? "منتهي" : "Expired")}
    </div>
  );
}