import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessengerStatsChart } from "./MessengerStatsChart";
import { useMessengerStats } from "./useMessengerStats";

export function MessengerStatsCard() {
  const { t, i18n } = useTranslation();
  const { stats, isLoading } = useMessengerStats();
  const isRTL = i18n.language === 'ar';

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className={cn(
          "text-lg font-medium flex items-center gap-2",
          isRTL ? "flex-row-reverse font-cairo" : "flex-row"
        )}>
          <MessageCircle className="w-5 h-5 text-purple-500" />
          {t("dashboard.messenger")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        ) : (
          <MessengerStatsChart stats={stats} />
        )}
      </CardContent>
    </Card>
  );
}