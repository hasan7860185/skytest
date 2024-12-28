import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityLogsList } from "./ActivityLogsList";
import { ActivityLogsFilters } from "./ActivityLogsFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ActivityLogsView() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [filters, setFilters] = useState<{
    entity_type?: string;
    action_type?: string;
    from_date?: Date;
    to_date?: Date;
  }>({});

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(isRTL && "font-cairo text-right")}>
          {isRTL ? "سجل النشاطات" : "Activity Log"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ActivityLogsFilters onFilterChange={setFilters} />
        <ActivityLogsList filters={filters} />
      </CardContent>
    </Card>
  );
}