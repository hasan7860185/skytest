import { useTranslation } from "react-i18next";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { taskSchema } from "../taskSchema";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AssigneeFieldProps {
  form: UseFormReturn<z.infer<typeof taskSchema>>;
  isRTL: boolean;
}

export function AssigneeField({ form, isRTL }: AssigneeFieldProps) {
  const { t } = useTranslation();

  const { data: users = [] } = useQuery({
    queryKey: ['activeUsers'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('status', 'active')
        .order('full_name');

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return profiles;
    }
  });

  return (
    <FormField
      control={form.control}
      name="assigned_to"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("tasks.form.assignTo")}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || undefined}>
            <FormControl>
              <SelectTrigger className={cn(isRTL ? "text-right font-cairo" : "text-left")}>
                <SelectValue placeholder={t("tasks.form.selectUser")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}