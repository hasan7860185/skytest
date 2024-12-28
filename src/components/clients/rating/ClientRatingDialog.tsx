import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientRatingDialogProps {
  clientId: string;
  clientName: string;
  currentRating?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRatingUpdate?: () => void;
}

export function ClientRatingDialog({
  clientId,
  clientName,
  currentRating = 0,
  open,
  onOpenChange,
  onRatingUpdate
}: ClientRatingDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [rating, setRating] = useState(currentRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('clients')
        .update({ rating })
        .eq('id', clientId);

      if (error) throw error;

      toast.success(
        isRTL 
          ? `تم تحديث تقييم العميل ${clientName} بنجاح`
          : `Successfully updated rating for ${clientName}`
      );
      
      if (onRatingUpdate) {
        onRatingUpdate();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating client rating:', error);
      toast.error(
        isRTL 
          ? 'حدث خطأ أثناء تحديث التقييم'
          : 'Error updating rating'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isRTL ? 'تقييم العميل' : 'Rate Client'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isRTL ? `تقييم العميل: ${clientName}` : `Rating for: ${clientName}`}
            </p>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <Button
                key={value}
                variant="ghost"
                size="sm"
                className={`p-2 ${rating >= value ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => setRating(value)}
              >
                <Star className="h-8 w-8" fill={rating >= value ? 'currentColor' : 'none'} />
              </Button>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              onClick={handleRatingSubmit}
              disabled={isSubmitting}
            >
              {isRTL ? 'حفظ' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}