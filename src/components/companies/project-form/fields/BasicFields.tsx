import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ProjectFormData } from "../types";

interface BasicFieldsProps {
  form: UseFormReturn<ProjectFormData>;
  isRTL: boolean;
}

export function BasicFields({ form, isRTL }: BasicFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "اسم المشروع" : "Project Name"}
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
        name="engineering_consultant"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "الاستشاري الهندسي" : "Engineering Consultant"}
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
        name="operating_company"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "شركة الإدارة والتشغيل" : "Operating Company"}
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