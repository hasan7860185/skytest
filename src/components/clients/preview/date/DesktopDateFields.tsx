import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DesktopDateFieldsProps {
  currentDate: Date;
  years: number[];
  months: number[];
  days: number[];
  hours: number[];
  minutes: number[];
  updateDate: (type: 'year' | 'month' | 'day' | 'hour' | 'minute', value: number) => void;
  isRTL: boolean;
}

export function DesktopDateFields({ 
  currentDate,
  years,
  months,
  days,
  hours,
  minutes,
  updateDate,
  isRTL
}: DesktopDateFieldsProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{isRTL ? "السنة" : "Year"}</label>
        <Select
          value={currentDate.getFullYear().toString()}
          onValueChange={(value) => updateDate('year', parseInt(value))}
        >
          <SelectTrigger className={cn(
            "w-full",
            isRTL && "text-right"
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{isRTL ? "الشهر" : "Month"}</label>
        <Select
          value={currentDate.getMonth().toString()}
          onValueChange={(value) => updateDate('month', parseInt(value))}
        >
          <SelectTrigger className={cn(
            "w-full",
            isRTL && "text-right"
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month.toString()}>
                {new Date(2024, month).toLocaleString(isRTL ? 'ar' : 'en', { month: 'long' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{isRTL ? "اليوم" : "Day"}</label>
        <Select
          value={currentDate.getDate().toString()}
          onValueChange={(value) => updateDate('day', parseInt(value))}
        >
          <SelectTrigger className={cn(
            "w-full",
            isRTL && "text-right"
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{isRTL ? "الساعة" : "Hour"}</label>
        <Select
          value={currentDate.getHours().toString()}
          onValueChange={(value) => updateDate('hour', parseInt(value))}
        >
          <SelectTrigger className={cn(
            "w-full",
            isRTL && "text-right"
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour.toString()}>
                {hour.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{isRTL ? "الدقيقة" : "Minute"}</label>
        <Select
          value={currentDate.getMinutes().toString()}
          onValueChange={(value) => updateDate('minute', parseInt(value))}
        >
          <SelectTrigger className={cn(
            "w-full",
            isRTL && "text-right"
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((minute) => (
              <SelectItem key={minute} value={minute.toString()}>
                {minute.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}