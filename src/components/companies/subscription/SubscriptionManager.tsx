import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface SubscriptionManagerProps {
  companyId: string;
  companyName: string;
  isRTL: boolean;
}

export function SubscriptionManager({ companyId, companyName, isRTL }: SubscriptionManagerProps) {
  const { t } = useTranslation();
  const [subdomain, setSubdomain] = useState("");
  const [pathSegment, setPathSegment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate end date as 30 days from now and convert to ISO string
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      // First, create or update the subscription
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          company_id: companyId,
          company_name: companyName,
          path_segment: pathSegment,
          end_date: endDate,
          is_active: true
        });

      if (subscriptionError) throw subscriptionError;

      // Then, create or update the domain
      const { error: domainError } = await supabase
        .from('domains')
        .upsert({
          company_id: companyId,
          subdomain,
          path_segment: pathSegment,
          is_active: true
        });

      if (domainError) throw domainError;

      toast.success(isRTL ? 'تم تحديث الاشتراك بنجاح' : 'Subscription updated successfully');
      queryClient.invalidateQueries({ queryKey: ['subscriptions', companyId] });
      queryClient.invalidateQueries({ queryKey: ['domains', companyId] });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث الاشتراك' : 'Error updating subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subdomain" className={cn(isRTL && "font-cairo text-right")}>
          {isRTL ? "النطاق الفرعي" : "Subdomain"}
        </Label>
        <Input
          id="subdomain"
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value)}
          placeholder={isRTL ? "أدخل النطاق الفرعي" : "Enter subdomain"}
          className={cn(isRTL && "text-right")}
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pathSegment" className={cn(isRTL && "font-cairo text-right")}>
          {isRTL ? "مسار URL" : "URL Path"}
        </Label>
        <Input
          id="pathSegment"
          value={pathSegment}
          onChange={(e) => setPathSegment(e.target.value)}
          placeholder={isRTL ? "أدخل مسار URL" : "Enter URL path"}
          className={cn(isRTL && "text-right")}
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className={cn(
          "w-full",
          isRTL && "font-cairo"
        )}
      >
        {isSubmitting 
          ? (isRTL ? "جاري الحفظ..." : "Saving...") 
          : (isRTL ? "حفظ" : "Save")}
      </Button>
    </form>
  );
}