import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Client } from "@/types/client";
import { ClientForm } from "@/components/forms/ClientForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface EditClientDialogProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditClientDialog({ client, open, onOpenChange }: EditClientDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          facebook: data.facebook || null,
          country: data.country || "Egypt",
          city: data.city || null,
          project: data.project || null,
          status: data.status,
          post_url: data.postUrl || null,
          comment: data.comment || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', client.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(t('clients.updateSuccess'));
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error(t('clients.updateError'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right font-cairo" : ""}>
            {t("clients.edit")}
          </DialogTitle>
        </DialogHeader>
        <ClientForm 
          onSubmit={handleSubmit}
          defaultValues={{
            name: client.name,
            phone: client.phone,
            email: client.email,
            facebook: client.facebook,
            country: client.country,
            city: client.city,
            project: client.project,
            status: client.status,
            postUrl: client.post_url,
            comment: client.comment
          }}
        />
      </DialogContent>
    </Dialog>
  );
}