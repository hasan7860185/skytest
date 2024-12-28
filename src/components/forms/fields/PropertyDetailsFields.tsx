import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { PropertyFormData } from "../propertyFormSchema";
import { cn } from "@/lib/utils";
import { useState } from "react";

const countryCodes = [
  { code: "20", country: "EG", name: "مصر" },
  { code: "966", country: "SA", name: "السعودية" },
  { code: "971", country: "AE", name: "الإمارات" },
  { code: "965", country: "KW", name: "الكويت" },
  { code: "974", country: "QA", name: "قطر" },
  { code: "973", country: "BH", name: "البحرين" },
  { code: "968", country: "OM", name: "عمان" },
  { code: "964", country: "IQ", name: "العراق" },
  { code: "962", country: "JO", name: "الأردن" },
  { code: "961", country: "LB", name: "لبنان" },
  { code: "970", country: "PS", name: "فلسطين" },
  { code: "967", country: "YE", name: "اليمن" },
  { code: "963", country: "SY", name: "سوريا" },
  { code: "249", country: "SD", name: "السودان" },
  { code: "218", country: "LY", name: "ليبيا" },
  { code: "216", country: "TN", name: "تونس" },
  { code: "213", country: "DZ", name: "الجزائر" },
  { code: "212", country: "MA", name: "المغرب" },
];

interface PropertyDetailsFieldsProps {
  form: UseFormReturn<PropertyFormData>;
}

export function PropertyDetailsFields({ form }: PropertyDetailsFieldsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedCountryCode, setSelectedCountryCode] = useState("20");

  const formatPhoneNumber = (phoneNumber: string, countryCode: string) => {
    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Remove country code if it exists at the start
    const numberWithoutCode = cleanNumber.replace(new RegExp(`^${countryCode}`), '');
    
    // Return the formatted number with country code
    return countryCode + numberWithoutCode;
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "الموقع" : "Location"}
            </FormLabel>
            <FormControl>
              <Input {...field} className={cn(isRTL && "text-right font-cairo")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "المساحة" : "Area"}
            </FormLabel>
            <FormControl>
              <Input {...field} type="number" className={cn(isRTL && "text-right font-cairo")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "السعر" : "Price"}
            </FormLabel>
            <FormControl>
              <Input {...field} type="number" className={cn(isRTL && "text-right font-cairo")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="owner_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "رقم هاتف المالك" : "Owner Phone"}
            </FormLabel>
            <div className="flex gap-2">
              <Select
                value={selectedCountryCode}
                onValueChange={(value) => {
                  setSelectedCountryCode(value);
                  if (typeof field.value === 'string') {
                    const formattedPhone = formatPhoneNumber(field.value, value);
                    field.onChange(formattedPhone);
                  }
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span>+{country.code}</span>
                        <span>{country.country}</span>
                        <span className="text-muted-foreground text-sm">
                          {country.name}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormControl>
                <Input 
                  type="tel"
                  className={cn(isRTL && "text-right font-cairo")}
                  value={typeof field.value === 'string' ? field.value.replace(selectedCountryCode, '') : ''}
                  onChange={(e) => {
                    const phoneNumber = e.target.value.replace(/\D/g, '');
                    const formattedPhone = formatPhoneNumber(phoneNumber, selectedCountryCode);
                    field.onChange(formattedPhone);
                  }}
                  maxLength={15}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}