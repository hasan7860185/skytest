import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDateFields } from "./date/MobileDateFields";
import { DesktopDateFields } from "./date/DesktopDateFields";

interface DateTimeFieldsProps {
  date: Date | undefined;
  onDateChange: (date: Date) => void;
}

export function DateTimeFields({ date, onDateChange }: DateTimeFieldsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isMobile = useIsMobile();
  
  const currentDate = date || new Date();
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const updateDate = (type: 'year' | 'month' | 'day' | 'hour' | 'minute', value: number) => {
    const newDate = new Date(currentDate);
    
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

    if (newDate >= new Date()) {
      onDateChange(newDate);
    }
  };

  const commonProps = {
    currentDate,
    years,
    months,
    days,
    hours,
    minutes,
    updateDate,
    isRTL
  };

  return isMobile ? (
    <MobileDateFields {...commonProps} />
  ) : (
    <DesktopDateFields {...commonProps} />
  );
}