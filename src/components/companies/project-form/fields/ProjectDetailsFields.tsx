import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ProjectFormData } from "../types";

interface ProjectDetailsFieldsProps {
  form: UseFormReturn<ProjectFormData>;
  isRTL: boolean;
}

export function ProjectDetailsFields({ form, isRTL }: ProjectDetailsFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="project_sections"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "تقسيم المشروع" : "Project Sections"}
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
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "موقع المشروع" : "Project Location"}
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
        name="price_per_meter"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "السعر لكل متر" : "Price per Meter"}
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