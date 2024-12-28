import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ContactFieldsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  salesPersons: string[];
  contactMethods: string[];
};

export function ContactFields({ form, contactMethods }: ContactFieldsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Fetch active users
  const { data: activeUsers = [] } = useQuery({
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
    <>
      <FormField
        control={form.control}
        name="salesPerson"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clients.form.salesPerson')}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('clients.form.salesPersonPlaceholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {activeUsers.map((user) => (
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

      <FormField
        control={form.control}
        name="contactMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clients.form.contactMethod')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('clients.form.contactMethodPlaceholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {contactMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}