import * as React from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface MobileTimePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function MobileTimePicker({ date, onDateChange }: MobileTimePickerProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const updateDate = (type: 'year' | 'month' | 'day' | 'hour' | 'minute', value: number) => {
    const newDate = new Date(date);
    
    switch(type) {
      case 'year':
        newDate.setFullYear(value);
        break;
      case 'month':
        newDate.setMonth(value);
        break;
      case 'day':
        newDate.setDate(value);
        break;
      case 'hour':
        newDate.setHours(value);
        break;
      case 'minute':
        newDate.setMinutes(value);
        break;
    }

    onDateChange(newDate);
  };

  const currentYear = date.getFullYear();
  const daysInMonth = new Date(currentYear, date.getMonth() + 1, 0).getDate();

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
        <Slider
          value={[currentYear]}
          min={new Date().getFullYear()}
          max={new Date().getFullYear() + 10}
          step={1}
          onValueChange={(value) => updateDate('year', value[0])}
          className="touch-none"
        />
        <div className="text-center text-sm">{currentYear}</div>
      </div>

      <div className="space-y-2">
        <label className={cn(
          "text-sm font-medium",
          isRTL && "text-right block"
        )}>
          {isRTL ? "الشهر" : "Month"}
        </label>
        <Slider
          value={[date.getMonth()]}
          min={0}
          max={11}
          step={1}
          onValueChange={(value) => updateDate('month', value[0])}
          className="touch-none"
        />
        <div className="text-center text-sm">
          {date.toLocaleString(isRTL ? 'ar' : 'en', { month: 'long' })}
        </div>
      </div>

      <div className="space-y-2">
        <label className={cn(
          "text-sm font-medium",
          isRTL && "text-right block"
        )}>
          {isRTL ? "اليوم" : "Day"}
        </label>
        <Slider
          value={[date.getDate()]}
          min={1}
          max={daysInMonth}
          step={1}
          onValueChange={(value) => updateDate('day', value[0])}
          className="touch-none"
        />
        <div className="text-center text-sm">{date.getDate()}</div>
      </div>

      <div className="space-y-2">
        <label className={cn(
          "text-sm font-medium",
          isRTL && "text-right block"
        )}>
          {isRTL ? "الساعة" : "Hour"}
        </label>
        <Slider
          value={[date.getHours()]}
          min={0}
          max={23}
          step={1}
          onValueChange={(value) => updateDate('hour', value[0])}
          className="touch-none"
        />
        <div className="text-center text-sm">
          {date.getHours().toString().padStart(2, '0')}
        </div>
      </div>

      <div className="space-y-2">
        <label className={cn(
          "text-sm font-medium",
          isRTL && "text-right block"
        )}>
          {isRTL ? "الدقيقة" : "Minute"}
        </label>
        <Slider
          value={[date.getMinutes()]}
          min={0}
          max={59}
          step={1}
          onValueChange={(value) => updateDate('minute', value[0])}
          className="touch-none"
        />
        <div className="text-center text-sm">
          {date.getMinutes().toString().padStart(2, '0')}
        </div>
      </div>
    </Card>
  );
}