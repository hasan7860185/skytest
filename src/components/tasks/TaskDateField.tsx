import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { taskSchema } from "./taskSchema";
import { z } from "zod";
import { DateTimeFields } from "@/components/clients/preview/DateTimeFields";

interface TaskDateFieldProps {
  form: UseFormReturn<z.infer<typeof taskSchema>>;
  name: "due_date" | "reminder_date";
  label: string;
}

export function TaskDateField({ form, name, label }: TaskDateFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DateTimeFields
              date={field.value}
              onDateChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}