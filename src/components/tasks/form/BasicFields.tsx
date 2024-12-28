import { useTranslation } from "react-i18next";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { taskSchema } from "../taskSchema";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface BasicFieldsProps {
  form: UseFormReturn<z.infer<typeof taskSchema>>;
  isRTL: boolean;
}

export function BasicFields({ form, isRTL }: BasicFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("tasks.form.title")}</FormLabel>
            <FormControl>
              <Input {...field} className={cn(isRTL ? "text-right font-cairo" : "text-left")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("tasks.form.description")}</FormLabel>
            <FormControl>
              <Textarea {...field} className={cn(isRTL ? "text-right font-cairo" : "text-left")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}