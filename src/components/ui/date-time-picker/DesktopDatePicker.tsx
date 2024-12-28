import * as React from "react";
import DatePicker from "react-datepicker";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { arSA } from "date-fns/locale/ar-SA";
import { enUS } from "date-fns/locale/en-US";

interface DesktopDatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  isRTL: boolean;
  localeOverride?: string;
}

export function DesktopDatePicker({ 
  date, 
  setDate, 
  isRTL, 
  localeOverride 
}: DesktopDatePickerProps) {
  const locale = isRTL ? arSA : enUS;

  return (
    <DatePicker
      selected={date}
      onChange={setDate}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      dateFormat="PPP HH:mm"
      locale={localeOverride ? (isRTL ? arSA : enUS) : locale}
      placeholderText={isRTL ? "اختر التاريخ والوقت" : "Select date and time"}
      customInput={
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            "min-h-[48px] px-3 py-2",
            "text-[13px] md:text-base",
            !date && "text-muted-foreground",
            isRTL && "text-right flex-row-reverse"
          )}
        >
          <CalendarIcon className={cn(
            "h-4 w-4 shrink-0 opacity-70",
            isRTL ? "ml-2 md:ml-3" : "mr-2 md:mr-3"
          )} />
          <span className="truncate flex-1">
            {date ? date.toLocaleDateString(isRTL ? 'ar' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : (isRTL ? "اختر التاريخ والوقت" : "Select date and time")}
          </span>
        </Button>
      }
      className={cn(
        "react-datepicker",
        isRTL && "rtl"
      )}
      calendarClassName={cn(
        "!bg-white dark:!bg-gray-800 !border !border-gray-200 dark:!border-gray-700",
        "!rounded-lg !shadow-lg !p-3",
        "!font-sans !text-sm md:!text-base",
        isRTL && "!font-cairo"
      )}
      dayClassName={() => cn(
        "!rounded !transition-colors !text-sm md:!text-base",
        "hover:!bg-gray-100 dark:hover:!bg-gray-700"
      )}
      timeClassName={() => cn(
        "!text-primary cursor-pointer",
        "hover:!bg-gray-100 dark:hover:!bg-gray-700",
        "!rounded !px-2 !py-1",
        "!text-sm md:!text-base"
      )}
      wrapperClassName="!w-full"
      popperClassName="!z-50"
      onClickOutside={(e) => e.stopPropagation()}
      popperPlacement={isRTL ? "bottom-end" : "bottom-start"}
      fixedHeight
      showTimeInput
      timeInputLabel={isRTL ? "الوقت:" : "Time:"}
    />
  );
}