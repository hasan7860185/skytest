import * as React from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { MobileTimePicker } from "./date-time-picker/MobileTimePicker";
import { DesktopDatePicker } from "./date-time-picker/DesktopDatePicker";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  className?: string;
  locale?: string;
  showTimezone?: boolean;
}

export function DateTimePicker({ 
  date, 
  setDate, 
  className,
  locale: localeOverride,
  showTimezone = true 
}: DateTimePickerProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isMobile = useIsMobile();

  const [internalDate, setInternalDate] = React.useState<Date>(date || new Date());

  React.useEffect(() => {
    if (date) {
      setInternalDate(date);
    }
  }, [date]);

  const handleDateChange = (newDate: Date) => {
    if (newDate < new Date()) {
      return;
    }
    setInternalDate(newDate);
    setDate(newDate);
  };

  const handleScroll = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      className={cn("relative w-full", className)}
      onTouchMove={handleScroll}
      onWheel={handleScroll}
    >
      {isMobile ? (
        <MobileTimePicker 
          date={internalDate} 
          onDateChange={handleDateChange}
        />
      ) : (
        <DesktopDatePicker
          date={date}
          setDate={setDate}
          isRTL={isRTL}
          localeOverride={localeOverride}
        />
      )}
    </div>
  );
}