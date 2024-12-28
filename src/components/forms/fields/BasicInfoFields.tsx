import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";
import { useTranslation } from "react-i18next";

type BasicInfoFieldsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  const { t } = useTranslation();
  
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clients.form.name')}</FormLabel>
            <FormControl>
              <Input placeholder={t('clients.form.namePlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clients.form.email')}</FormLabel>
            <FormControl>
              <Input type="email" placeholder={t('clients.form.emailPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="facebook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clients.form.facebook')}</FormLabel>
            <FormControl>
              <Input placeholder={t('clients.form.facebookPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="postUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clients.form.postUrl')}</FormLabel>
            <FormControl>
              <Input placeholder={t('clients.form.postUrlPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="comment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clients.form.comment')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('clients.form.commentPlaceholder')} 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}