import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function CalendarPopover() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:h-9 md:w-9 hover:bg-[#f0f8ff] text-primary-foreground"
        >
          <CalendarIcon className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 shadow-lg" 
        align={isRTL ? "end" : "start"}
        side="bottom"
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-2 border-b dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 px-2.5"
              onClick={() => setDate(new Date())}
            >
              {isRTL ? "اليوم" : "Today"}
            </Button>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs px-3 py-1 h-7 rounded-full transition-colors",
                  view === 'day' ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                onClick={() => setView('day')}
              >
                {isRTL ? "يوم" : "Day"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs px-3 py-1 h-7 rounded-full transition-colors",
                  view === 'week' ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                onClick={() => setView('week')}
              >
                {isRTL ? "أسبوع" : "Week"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs px-3 py-1 h-7 rounded-full transition-colors",
                  view === 'month' ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                onClick={() => setView('month')}
              >
                {isRTL ? "شهر" : "Month"}
              </Button>
            </div>
          </div>

          <div className="p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-0"
              dir={isRTL ? "rtl" : "ltr"}
              fromYear={2020}
              toYear={2030}
              captionLayout="dropdown-buttons"
              showOutsideDays
              fixedWeeks
              weekStartsOn={isRTL ? 6 : 0}
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "flex items-center gap-1",
                nav_button: cn(
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors",
                  "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: cn(
                  "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  "first:[&:not(:empty)]:font-medium first:[&:not(:empty)]:text-primary"
                ),
                row: "flex w-full mt-2",
                cell: cn(
                  "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                ),
                day: cn(
                  "h-9 w-9 p-0 font-normal rounded-full transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                ),
                day_selected: 
                  "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-semibold",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}