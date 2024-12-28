import { StatusGrid } from "@/components/StatusGrid";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardStatusGrid() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Card className="bg-white dark:bg-gray-800 mt-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          <CardTitle className={cn(
            "text-lg font-medium",
            isRTL && "font-cairo"
          )}>
            {isRTL ? "حالة العملاء" : "Client Status"}
          </CardTitle>
        </div>
      </CardHeader>
      <div className="p-6">
        <StatusGrid />
      </div>
    </Card>
  );
}