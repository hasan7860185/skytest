import { ClientPreviewDialog } from "../clients/ClientPreviewDialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function NotificationPreview({ notification, onClose }: { 
  notification: any;
  onClose: () => void;
}) {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const handleNotificationClick = async () => {
    try {
      if (notification.type === 'client_action') {
        const clientNameMatch = notification.message.match(isRTL ? /للعميل:\s*([^-]+)/ : /for client:\s*([^-]+)/);
        if (!clientNameMatch) {
          console.error('Could not extract client name from message:', notification.message);
          toast.error(t('notifications.clientNotFound'));
          return;
        }

        const clientName = clientNameMatch[1].trim();
        const { data: clients, error } = await supabase
          .from('clients')
          .select('*')
          .eq('name', clientName)
          .limit(1);

        if (error) {
          console.error('Error finding client:', error);
          toast.error(t('notifications.errorFindingClient'));
          return;
        }

        if (clients && clients.length > 0) {
          const client = clients[0];
          setSelectedClient(client);
          setIsPreviewOpen(true);
          navigate('/clients/new');
          toast.success(t('notifications.clientPageOpened'));
        } else {
          console.error('No client found with name:', clientName);
          toast.error(t('notifications.clientNotFound'));
        }
      }
      onClose();
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error(t('notifications.errorHandlingNotification'));
    }
  };

  return (
    <>
      {selectedClient && (
        <ClientPreviewDialog
          client={selectedClient}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      )}
    </>
  );
}