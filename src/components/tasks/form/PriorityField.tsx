import { useTranslation } from "react-i18next";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { taskSchema } from "../taskSchema";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface PriorityFieldProps {
  form: UseFormReturn<z.infer<typeof taskSchema>>;
  isRTL: boolean;
}

export function PriorityField({ form, isRTL }: PriorityFieldProps) {
  const { t } = useTranslation();

  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("tasks.form.priority")}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={cn(isRTL ? "text-right font-cairo" : "text-left")}>
                <SelectValue placeholder={t("tasks.form.selectPriority")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="low">{t("tasks.priority.low")}</SelectItem>
              <SelectItem value="medium">{t("tasks.priority.medium")}</SelectItem>
              <SelectItem value="high">{t("tasks.priority.high")}</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}