import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../formSchema";
import { useTranslation } from "react-i18next";
import { staticClientStatuses } from "@/data/clientStatuses";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type StatusFieldProps = {
  form: UseFormReturn<FormData>;
};

export function StatusField({ form }: StatusFieldProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{isRTL ? "حالة العميل" : "Client Status"}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className={cn(
                "w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                "focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                isRTL ? "text-right" : "text-left"
              )}>
                <SelectValue placeholder={isRTL ? "اختر الحالة" : "Select Status"} />
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
  );
}