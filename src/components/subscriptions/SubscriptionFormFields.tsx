import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { SubscriptionFormData } from "./types";

interface SubscriptionFormFieldsProps {
  form: UseFormReturn<SubscriptionFormData>;
  isRTL: boolean;
}

export function SubscriptionFormFields({ form, isRTL }: SubscriptionFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "اسم الشركة" : "Company Name"}
            </FormLabel>
            <FormControl>
              <Input {...field} className={cn(isRTL && "text-right")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="max_users"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "عدد المستخدمين" : "Number of Users"}
            </FormLabel>
            <FormControl>
              <Input {...field} type="number" min="1" className={cn(isRTL && "text-right")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="days"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "مدة الاشتراك (بالأيام)" : "Subscription Duration (days)"}
            </FormLabel>
            <FormControl>
              <Input {...field} type="number" min="1" className={cn(isRTL && "text-right")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="admin_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "البريد الإلكتروني للمسؤول" : "Admin Email"}
            </FormLabel>
            <FormControl>
              <Input {...field} type="email" className={cn(isRTL && "text-right")} dir="ltr" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="admin_password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(isRTL && "font-cairo")}>
              {isRTL ? "كلمة مرور المسؤول" : "Admin Password"}
            </FormLabel>
            <FormControl>
              <Input {...field} type="password" className={cn(isRTL && "text-right")} dir="ltr" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}