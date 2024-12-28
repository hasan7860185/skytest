import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ClientDateProps {
  date: string;
  isRTL: boolean;
}

export function ClientDate({ date, isRTL }: ClientDateProps) {
  return (
    <div className={cn(
      "text-right",
      "text-red-500",
      isRTL && "font-cairo"
    )}>
      {format(new Date(date), 'PPP', {
        locale: isRTL ? ar : undefined
      })}
    </div>
  );
}