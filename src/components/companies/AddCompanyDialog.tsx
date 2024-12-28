import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CompanyForm } from "@/components/forms/CompanyForm";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export function AddCompanyDialog() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (data: { name: string; description?: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('companies')
        .insert([{
          name: data.name,
          description: data.description,
          user_id: user.id,
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success(isRTL ? 'تم إضافة الشركة بنجاح' : 'Company added successfully');
      setOpen(false);
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء إضافة الشركة' : 'Error adding company');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary/80">
          <Plus className="h-4 w-4" />
          {t("companies.addCompany")}
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "sm:max-w-[425px]",
        "bg-background dark:bg-gray-900",
        "border-gray-200 dark:border-gray-800"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            isRTL && "text-right font-cairo",
            "text-foreground dark:text-gray-100"
          )}>
            {t("companies.addCompany")}
          </DialogTitle>
        </DialogHeader>
        <CompanyForm 
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}