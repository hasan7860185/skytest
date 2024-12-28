import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AddRegionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRegionDialog({ open, onOpenChange }: AddRegionDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('regions')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          user_id: session.user.id
        });

      if (error) throw error;

      toast.success(isRTL ? "تم إضافة المنطقة بنجاح" : "Region added successfully");
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      onOpenChange(false);
      setName("");
      setDescription("");
    } catch (error) {
      console.error('Error adding region:', error);
      toast.error(isRTL ? "حدث خطأ أثناء إضافة المنطقة" : "Error adding region");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[425px]",
        isRTL && "font-cairo"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(isRTL && "text-right")}>
            {isRTL ? "إضافة منطقة جديدة" : "Add New Region"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={cn(isRTL && "text-right block")}>
              {isRTL ? "اسم المنطقة" : "Region Name"}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(isRTL && "text-right")}
              placeholder={isRTL ? "أدخل اسم المنطقة" : "Enter region name"}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className={cn(isRTL && "text-right block")}>
              {isRTL ? "الوصف" : "Description"}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(isRTL && "text-right")}
              placeholder={isRTL ? "أدخل وصف المنطقة" : "Enter region description"}
              disabled={isSubmitting}
            />
          </div>
          <div className={cn(
            "flex gap-2",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
            >
              {isRTL ? "إضافة" : "Add"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}