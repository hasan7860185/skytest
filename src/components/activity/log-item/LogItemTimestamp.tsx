import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Clock } from "lucide-react";

interface LogItemTimestampProps {
  timestamp: string;
}

export function LogItemTimestamp({ timestamp }: LogItemTimestampProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <time dateTime={timestamp}>
        {format(new Date(timestamp), 'PPpp', {
          locale: isRTL ? ar : undefined
        })}
      </time>
    </div>
  );
}