import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { TimeRange } from "@/types/userTypes";

interface TopUsersHeaderProps {
  timeRange: TimeRange;
  setTimeRange: (value: TimeRange) => void;
  showAIInsights: boolean;
  setShowAIInsights: (value: boolean) => void;
  isRTL: boolean;
}

export function TopUsersHeader({
  timeRange,
  setTimeRange,
  showAIInsights,
  setShowAIInsights,
  isRTL,
}: TopUsersHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
      <h2 className={cn(
        "text-lg font-medium text-gray-900 dark:text-gray-100",
        isRTL && "font-cairo"
      )}>
        {isRTL ? "المستخدمون" : "Users"}
      </h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="ai-insights"
            checked={showAIInsights}
            onCheckedChange={setShowAIInsights}
          />
          <Label htmlFor="ai-insights" className={cn(
            "text-sm text-gray-600 dark:text-gray-300",
            isRTL && "font-cairo"
          )}>
            {isRTL ? "تحليل ذكي" : "AI Insights"}
          </Label>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
        >
          <SelectTrigger className={cn(
            "w-full sm:w-[180px] bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600",
            isRTL && "font-cairo text-right"
          )}>
            <SelectValue placeholder={t("dashboard.selectPeriod")} />
          </SelectTrigger>
          <SelectContent align={isRTL ? "end" : "start"} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectItem 
              value="all"
              className={cn(
                "text-gray-900 dark:text-gray-100",
                isRTL && "font-cairo text-right"
              )}
            >
              {t("dashboard.all")}
            </SelectItem>
            <SelectItem 
              value="daily"
              className={cn(
                "text-gray-900 dark:text-gray-100",
                isRTL && "font-cairo text-right"
              )}
            >
              {t("dashboard.daily")}
            </SelectItem>
            <SelectItem 
              value="weekly"
              className={cn(
                "text-gray-900 dark:text-gray-100",
                isRTL && "font-cairo text-right"
              )}
            >
              {t("dashboard.weekly")}
            </SelectItem>
            <SelectItem 
              value="monthly"
              className={cn(
                "text-gray-900 dark:text-gray-100",
                isRTL && "font-cairo text-right"
              )}
            >
              {t("dashboard.monthly")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}