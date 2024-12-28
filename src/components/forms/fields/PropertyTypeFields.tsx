import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { PropertyFormData } from "../propertyFormSchema";
import { cn } from "@/lib/utils";

interface PropertyTypeFieldsProps {
  form: UseFormReturn<PropertyFormData>;
}

const propertyTypes = [
  { value: 'apartment', label: { ar: 'شقة', en: 'Apartment' } },
  { value: 'villa', label: { ar: 'فيلا', en: 'Villa' } },
  { value: 'duplex', label: { ar: 'دوبلكس', en: 'Duplex' } },
  { value: 'roof', label: { ar: 'رووف', en: 'Roof' } },
  { value: 'land', label: { ar: 'أرض', en: 'Land' } },
  { value: 'building', label: { ar: 'مبنى', en: 'Building' } },
  { value: 'office', label: { ar: 'مكتب', en: 'Office' } },
  { value: 'shop', label: { ar: 'محل تجاري', en: 'Shop' } },
  { value: 'other', label: { ar: 'أخرى', en: 'Other' } },
] as const;

export function PropertyTypeFields({ form }: PropertyTypeFieldsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(isRTL && "font-cairo")}>
            {isRTL ? "نوع العقار" : "Property Type"}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={cn(isRTL && "text-right font-cairo")}>
                <SelectValue placeholder={isRTL ? "اختر نوع العقار" : "Select property type"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem 
                  key={type.value} 
                  value={type.value}
                  className={cn(isRTL && "text-right font-cairo")}
                >
                  {isRTL ? type.label.ar : type.label.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}