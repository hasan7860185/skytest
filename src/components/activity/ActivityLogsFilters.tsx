import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface ActivityLogsFiltersProps {
  onFilterChange: (filters: {
    entity_type?: string;
    action_type?: string;
    from_date?: Date;
    to_date?: Date;
  }) => void;
}

export function ActivityLogsFilters({ onFilterChange }: ActivityLogsFiltersProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [entityType, setEntityType] = useState<string>();
  const [actionType, setActionType] = useState<string>();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const handleFilterChange = () => {
    onFilterChange({
      entity_type: entityType,
      action_type: actionType,
      from_date: fromDate,
      to_date: toDate
    });
  };

  const handleReset = () => {
    setEntityType(undefined);
    setActionType(undefined);
    setFromDate(undefined);
    setToDate(undefined);
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select
          value={entityType}
          onValueChange={(value) => {
            setEntityType(value);
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={isRTL ? "نوع العنصر" : "Entity Type"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">{isRTL ? "مستخدم" : "User"}</SelectItem>
            <SelectItem value="client">{isRTL ? "عميل" : "Client"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={actionType}
          onValueChange={(value) => {
            setActionType(value);
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={isRTL ? "نوع الإجراء" : "Action Type"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="create">{isRTL ? "إنشاء" : "Create"}</SelectItem>
            <SelectItem value="update">{isRTL ? "تحديث" : "Update"}</SelectItem>
            <SelectItem value="delete">{isRTL ? "حذف" : "Delete"}</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "PPP") : (isRTL ? "من تاريخ" : "From Date")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => {
                setFromDate(date);
                handleFilterChange();
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !toDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "PPP") : (isRTL ? "إلى تاريخ" : "To Date")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) => {
                setToDate(date);
                handleFilterChange();
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={handleReset}>
          {isRTL ? "إعادة تعيين" : "Reset"}
        </Button>
      </div>
    </div>
  );
}