import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ProjectFormData } from "../types";

interface AdditionalFieldsProps {
  form: UseFormReturn<ProjectFormData>;
  isRTL: boolean;
}

export function AdditionalFields({ form, isRTL }: AdditionalFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="rental_system"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "نظام الإيجار" : "Rental System"}
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className={cn(
                  "bg-background text-foreground dark:bg-background-dark dark:text-foreground",
                  isRTL && "text-right font-cairo"
                )} 
              />
            </FormControl>
            <FormMessage className={cn(isRTL && "font-cairo")} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "تفاصيل المشروع" : "Project Description"}
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className={cn(
                  "min-h-[100px] resize-none bg-background text-foreground dark:bg-background-dark dark:text-foreground",
                  isRTL && "text-right font-cairo"
                )}
              />
            </FormControl>
            <FormMessage className={cn(isRTL && "font-cairo")} />
          </FormItem>
        )}
      />
    </>
  );
}