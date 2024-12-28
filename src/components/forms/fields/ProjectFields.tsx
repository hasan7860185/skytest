import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";
import { useTranslation } from "react-i18next";

type ProjectFieldsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  projects: string[];
};

export function ProjectFields({ form, projects }: ProjectFieldsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clients.form.status')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('clients.form.statusPlaceholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="new">{t('clients.status.new')}</SelectItem>
                <SelectItem value="potential">{t('clients.status.potential')}</SelectItem>
                <SelectItem value="interested">{t('clients.status.interested')}</SelectItem>
                <SelectItem value="responded">{t('clients.status.responded')}</SelectItem>
                <SelectItem value="noResponse">{t('clients.status.noResponse')}</SelectItem>
                <SelectItem value="scheduled">{t('clients.status.scheduled')}</SelectItem>
                <SelectItem value="postMeeting">{t('clients.status.postMeeting')}</SelectItem>
                <SelectItem value="booked">{t('clients.status.booked')}</SelectItem>
                <SelectItem value="cancelled">{t('clients.status.cancelled')}</SelectItem>
                <SelectItem value="sold">{t('clients.status.sold')}</SelectItem>
                <SelectItem value="postponed">{t('clients.status.postponed')}</SelectItem>
                <SelectItem value="resale">{t('clients.status.resale')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('clients.form.project')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('clients.form.projectPlaceholder')} 
                  {...field} 
                  className={isRTL ? "text-right" : "text-left"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('clients.form.budget')}</FormLabel>
              <FormControl>
                <Input type="number" placeholder={t('clients.form.budgetPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="campaign"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clients.form.campaign')}</FormLabel>
            <FormControl>
              <Input placeholder={t('clients.form.campaignPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}