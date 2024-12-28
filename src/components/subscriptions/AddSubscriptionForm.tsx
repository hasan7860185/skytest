import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { SubscriptionFormFields } from "./SubscriptionFormFields";
import { subscriptionSchema, type SubscriptionFormData } from "./types";
import { generatePathSegment, generateSubdomain } from "./utils";
import { useSubscriptionCreation } from "./useSubscriptionCreation";

interface AddSubscriptionFormProps {
  onSuccess: () => void;
  isRTL: boolean;
}

export function AddSubscriptionForm({ onSuccess, isRTL }: AddSubscriptionFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      company_name: "",
      max_users: 5,
      days: 30,
      admin_email: "",
      admin_password: "",
    },
  });

  const { createSubscription, isLoading } = useSubscriptionCreation(isRTL, onSuccess);

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      await createSubscription(data);
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast.error(isRTL 
        ? "حدث خطأ أثناء إنشاء الاشتراك. يرجى المحاولة مرة أخرى" 
        : "Error creating subscription. Please try again");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SubscriptionFormFields form={form} isRTL={isRTL} />
        
        <Button 
          type="submit" 
          className={cn(
            "w-full",
            isRTL && "font-cairo"
          )}
          disabled={isLoading}
        >
          {isLoading 
            ? (isRTL ? "جاري الإنشاء..." : "Creating...") 
            : (isRTL ? "إضافة اشتراك" : "Add Subscription")}
        </Button>
      </form>
    </Form>
  );
}