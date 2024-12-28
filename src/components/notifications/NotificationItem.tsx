import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { ClientPreviewDialog } from "../clients/ClientPreviewDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { NotificationContent } from "./NotificationContent";
import { NotificationActions } from "./NotificationActions";
import { getClientFromNotification } from "./utils/clientNotificationHandler";
import { usePermissions } from "@/hooks/usePermissions";
import { X } from "lucide-react";

type NotificationItemProps = {
  notification: {
    id: string;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
    type: string;
    client_id?: string;
  };
  onClick: (notification: any) => void;
  onSelect?: (id: string, checked: boolean) => void;
  isSelected?: boolean;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
  isRTL?: boolean;
  showMarkAsRead?: boolean;
};

export function NotificationItem({ 
  notification, 
  onClick, 
  onSelect,
  isSelected,
  showDelete,
  onDelete,
  isRTL,
  showMarkAsRead
}: NotificationItemProps) {
  const { t } = useTranslation();
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const isAdmin = hasPermission('admin') || hasPermission('supervisor');

  const handleClick = async () => {
    try {
      setIsLoading(true);
      console.log('Handling notification click:', notification);

      if (notification.client_id) {
        const { data: client, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', notification.client_id)
          .maybeSingle();

        if (error) throw error;
        
        if (client) {
          setSelectedClient({
            ...client,
            createdAt: new Date(client.created_at),
            updatedAt: new Date(client.updated_at),
            nextActionDate: client.next_action_date ? new Date(client.next_action_date) : undefined
          });
          setIsPreviewOpen(true);
        }
      } else {
        const client = await getClientFromNotification(notification);
        if (client) {
          setSelectedClient({
            ...client,
            createdAt: new Date(client.created_at),
            updatedAt: new Date(client.updated_at),
            nextActionDate: client.next_action_date ? new Date(client.next_action_date) : undefined
          });
          setIsPreviewOpen(true);
        }
      }

      onClick(notification);
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error(t('notifications.errorHandlingNotification'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id);

      if (error) throw error;
      
      onClick(notification);
      toast.success(t('notifications.markedAsRead'));
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error(t('notifications.errorMarkingRead'));
    }
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
    if (selectedClient) {
      navigate(`/clients/${selectedClient.status}`);
    }
  };

  return (
    <>
      <div
        key={notification.id}
        className={cn(
          "p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800",
          !notification.is_read ? "bg-blue-50/50 dark:bg-blue-900/10" : "",
          "flex items-start gap-4",
          isLoading && "opacity-50 pointer-events-none"
        )}
        onClick={handleClick}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex-1">
          <div className="flex justify-between items-start gap-2">
            <NotificationContent 
              notification={notification}
              selectedClient={selectedClient}
              isRTL={!!isRTL}
            />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(notification.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {selectedClient && (
        <ClientPreviewDialog
          client={selectedClient}
          open={isPreviewOpen}
          onOpenChange={handlePreviewClose}
        />
      )}
    </>
  );
}
