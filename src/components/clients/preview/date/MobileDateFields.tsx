import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileDateFieldsProps {
  currentDate: Date;
  years: number[];
  months: number[];
  days: number[];
  hours: number[];
  minutes: number[];
  updateDate: (type: 'year' | 'month' | 'day' | 'hour' | 'minute', value: number) => void;
  isRTL: boolean;
}

export function MobileDateFields({ 
  currentDate,
  years,
  months,
  days,
  hours,
  minutes,
  updateDate,
  isRTL
}: MobileDateFieldsProps) {
  const { t } = useTranslation();

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className="p-4 space-y-4 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="space-y-2">
        <label className={cn(
          "text-sm font-medium",
          isRTL && "text-right block"
        )}>
          {isRTL ? "السنة" : "Year"}
        </label>
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
          <SelectContent 
            className="max-h-[200px] touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ScrollArea className="h-[200px] touch-pan-y">
              {years.map((year) => (
                <SelectItem 
                  key={year} 
                  value={year.toString()}
                  className={cn(
                    "cursor-pointer hover:bg-accent py-3",
                    isRTL && "text-right"
                  )}
                >
                  {year}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className={cn(
          "text-sm font-medium",
          isRTL && "text-right block"
        )}>
          {isRTL ? "الشهر" : "Month"}
        </label>
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
          <SelectContent 
            className="max-h-[200px] touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ScrollArea className="h-[200px] touch-pan-y">
              {months.map((month) => (
                <SelectItem 
                  key={month} 
                  value={month.toString()}
                  className={cn(
                    "cursor-pointer hover:bg-accent py-3",
                    isRTL && "text-right"
                  )}
                >
                  {new Date(2024, month).toLocaleString(isRTL ? 'ar' : 'en', { month: 'long' })}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className={cn(
          "text-sm font-medium",
          isRTL && "text-right block"
        )}>
          {isRTL ? "اليوم" : "Day"}
        </label>
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
          <SelectContent 
            className="max-h-[200px] touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ScrollArea className="h-[200px] touch-pan-y">
              {days.map((day) => (
                <SelectItem 
                  key={day} 
                  value={day.toString()}
                  className={cn(
                    "cursor-pointer hover:bg-accent py-3",
                    isRTL && "text-right"
                  )}
                >
                  {day}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className={cn(
          "text-sm font-medium",
          isRTL && "text-right block"
        )}>
          {isRTL ? "الساعة" : "Hour"}
        </label>
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
          <SelectContent 
            className="max-h-[200px] touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ScrollArea className="h-[200px] touch-pan-y">
              {hours.map((hour) => (
                <SelectItem 
                  key={hour} 
                  value={hour.toString()}
                  className={cn(
                    "cursor-pointer hover:bg-accent py-3",
                    isRTL && "text-right"
                  )}
                >
                  {hour.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className={cn(
          "text-sm font-medium",
          isRTL && "text-right block"
        )}>
          {isRTL ? "الدقيقة" : "Minute"}
        </label>
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
          <SelectContent 
            className="max-h-[200px] touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ScrollArea className="h-[200px] touch-pan-y">
              {minutes.map((minute) => (
                <SelectItem 
                  key={minute} 
                  value={minute.toString()}
                  className={cn(
                    "cursor-pointer hover:bg-accent py-3",
                    isRTL && "text-right"
                  )}
                >
                  {minute.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}