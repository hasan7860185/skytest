import { useTranslation } from "react-i18next";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Suggestions() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!suggestion.trim()) {
      toast.error(isRTL ? "الرجاء إدخال اقتراحك" : "Please enter your suggestion");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('suggestions')
        .insert({
          content: suggestion,
          user_id: session.user.id
        });

      if (error) throw error;

      toast.success(isRTL ? "تم إرسال اقتراحك بنجاح" : "Your suggestion has been submitted successfully");
      setSuggestion("");
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      toast.error(isRTL ? "حدث خطأ أثناء إرسال اقتراحك" : "Error submitting your suggestion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <DashboardContent>
        <div className="container mx-auto p-4 pt-20">
          <Card className={cn(
            "w-[130%] lg:w-[350%] p-6",
            "max-w-2xl mx-auto"
          )}>
            <h1 className={cn(
              "text-2xl font-bold mb-4",
              isRTL && "font-cairo text-right"
            )}>
              {isRTL ? "الاقتراحات" : "Suggestions"}
            </h1>
            <div className="space-y-4">
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={isRTL ? "اكتب اقتراحك هنا..." : "Write your suggestion here..."}
                className={cn("min-h-[200px]", isRTL && "text-right")}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isRTL ? "إرسال الاقتراح" : "Submit Suggestion"}
              </Button>
            </div>
          </Card>
        </div>
      </DashboardContent>
    </div>
  );
}