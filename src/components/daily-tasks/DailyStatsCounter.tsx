import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface DailyStatsCounterProps {
  count: number;
  isRTL: boolean;
}

export function DailyStatsCounter({ count, isRTL }: DailyStatsCounterProps) {
  const { t } = useTranslation();
  
  return (
    <div className={cn(
      "mt-6 flex items-center justify-center gap-2",
      isRTL && "flex-row-reverse font-cairo"
    )}>
      <span className="text-2xl font-bold">{count}</span>
      <span className="text-sm text-gray-500">
        {t("dashboard.newClients")}
      </span>
    </div>
  );
}