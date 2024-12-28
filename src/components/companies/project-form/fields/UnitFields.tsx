import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ProjectFormData } from "../types";

interface UnitFieldsProps {
  form: UseFormReturn<ProjectFormData>;
  isRTL: boolean;
}

export function UnitFields({ form, isRTL }: UnitFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="available_units"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "الوحدات المتاحة" : "Available Units"}
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
        name="unit_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "سعر الوحدة" : "Unit Price"}
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
        name="min_area"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "بداية المساحات" : "Minimum Area"}
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
    </>
  );
}