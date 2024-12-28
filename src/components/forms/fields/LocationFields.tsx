import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";
import { useTranslation } from "react-i18next";
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

type LocationFieldsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  countries: Array<{ code: string; name: string; flag: string; phoneCode: string }>;
};

export function LocationFields({ form, countries }: LocationFieldsProps) {
  const { t } = useTranslation();
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel>{t('clients.form.country')}</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                const selectedCountry = countries.find(c => c.code === value);
                if (selectedCountry) {
                  const currentPhone = form.getValues("phone") || "";
                  const phoneCode = selectedCountry.phoneCode.replace('+', '');
                  if (!currentPhone.startsWith(phoneCode)) {
                    form.setValue("phone", phoneCode);
                  }
                }
              }} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('clients.form.countryPlaceholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent position="popper" className="max-h-[300px] overflow-y-auto">
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
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
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clients.form.phone')}</FormLabel>
            <div className="flex gap-2">
              <Select
                value={selectedCountryCode}
                onValueChange={(value) => {
                  setSelectedCountryCode(value);
                  if (field.value) {
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
                  value={typeof field.value === 'string' ? field.value.replace(selectedCountryCode, '') : ''}
                  onChange={(e) => {
                    const phoneNumber = e.target.value.replace(/\D/g, '');
                    const formattedPhone = formatPhoneNumber(phoneNumber, selectedCountryCode);
                    field.onChange(formattedPhone);
                  }}
                  maxLength={15}
                  placeholder={t('clients.form.phonePlaceholder')}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('clients.form.city')}</FormLabel>
            <FormControl>
              <Input placeholder={t('clients.form.cityPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}