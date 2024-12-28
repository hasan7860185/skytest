import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { PropertyFormData } from "../propertyFormSchema";
import { cn } from "@/lib/utils";

interface BasicPropertyFieldsProps {
  form: UseFormReturn<PropertyFormData>;
}

export function BasicPropertyFields({ form }: BasicPropertyFieldsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const propertyTypes = [
    { value: 'apartment', label: { ar: 'شقة', en: 'Apartment' } },
    { value: 'villa', label: { ar: 'فيلا', en: 'Villa' } },
    { value: 'land', label: { ar: 'أرض', en: 'Land' } },
    { value: 'building', label: { ar: 'مبنى', en: 'Building' } },
    { value: 'office', label: { ar: 'مكتب', en: 'Office' } },
    { value: 'shop', label: { ar: 'محل تجاري', en: 'Shop' } },
  ];

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("projects.form.title")}</FormLabel>
            <FormControl>
              <Input {...field} className={isRTL ? "text-right" : "text-left"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isRTL ? "نوع العقار" : "Property Type"}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? "اختر نوع العقار" : "Select property type"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {isRTL ? type.label.ar : type.label.en}
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
        name="owner_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isRTL ? "رقم هاتف المالك" : "Owner Phone"}</FormLabel>
            <FormControl>
              <Input {...field} type="tel" className={isRTL ? "text-right" : "text-left"} />
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
            <FormLabel>{t("projects.form.description")}</FormLabel>
            <FormControl>
              <Textarea {...field} className={cn(
                "min-h-[100px] resize-none",
                isRTL ? "text-right" : "text-left"
              )} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}