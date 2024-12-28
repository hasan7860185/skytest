import { useTranslation } from "react-i18next";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { ActionFormData } from "./actionFormTypes";
import { staticClientStatuses } from "@/data/clientStatuses";
import { toast } from "sonner";
import { DateTimeFields } from "./DateTimeFields";

interface ActionFormFieldsProps {
  form: UseFormReturn<ActionFormData>;
}

export function ActionFormFields({ form }: ActionFormFieldsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Watch form values to preserve them
  const comment = form.watch('comment');
  const nextAction = form.watch('nextAction');
  const nextActionDate = form.watch('nextActionDate');

  const handleDateChange = (date: Date) => {
    if (date) {
      // Ensure the date is in the future
      if (date < new Date()) {
        toast.error(isRTL ? "لا يمكن تحديد تاريخ في الماضي" : "Cannot set a date in the past");
        return;
      }
      
      form.setValue('nextActionDate', date, { shouldValidate: true });
      
      if (nextAction) {
        form.setValue('nextAction', nextAction, { shouldValidate: true });
      }
      
      if (comment) {
        form.setValue('comment', comment, { shouldValidate: true });
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="space-y-6 px-2"
      onScroll={handleScroll}
    >
      <FormField
        control={form.control}
        name="nextAction"
        render={({ field }) => (
          <FormItem>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                if (nextActionDate) {
                  form.setValue('nextActionDate', nextActionDate, { shouldValidate: true });
                }
                if (comment) {
                  form.setValue('comment', comment, { shouldValidate: true });
                }
              }} 
              value={field.value}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className={cn(
                  "w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                  "focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                  isRTL ? "text-right" : "text-left"
                )}>
                  <SelectValue placeholder={isRTL ? "اختر الإجراء" : "Select Action"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {staticClientStatuses.map((status) => (
                    <SelectItem 
                      key={status.key} 
                      value={status.key}
                      className={cn(
                        "flex items-center gap-2 py-2.5 px-3 cursor-pointer transition-colors duration-150",
                        "hover:bg-gray-100 dark:hover:bg-gray-800",
                        "focus:bg-gray-100 dark:focus:bg-gray-800",
                        "data-[selected]:bg-primary/10 data-[selected]:text-primary",
                        isRTL ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <status.icon className={cn(
                        "h-4 w-4",
                        isRTL ? "ml-2" : "mr-2"
                      )} />
                      <span>{t(`status.${status.key}`)}</span>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nextActionDate"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-base font-medium">
              {isRTL ? "تاريخ الإجراء التالي" : "Next Action Date"}
            </FormLabel>
            <FormControl>
              <DateTimeFields 
                date={field.value}
                onDateChange={handleDateChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="comment"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder={isRTL ? "أضف تعليقاً" : "Add a comment"}
                {...field}
                className={cn(
                  "min-h-[120px] resize-none bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                  "focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                  "text-base",
                  isRTL ? "text-right" : "text-left"
                )}
                dir={isRTL ? "rtl" : "ltr"}
                value={comment}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}