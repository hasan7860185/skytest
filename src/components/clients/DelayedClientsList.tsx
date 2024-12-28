import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DelayedClientsListContent } from "./delayed/DelayedClientsListContent";
import { useDelayedClientsNotifications } from "@/hooks/useDelayedClientsNotifications";
import { useDelayedClients } from "@/hooks/useDelayedClients";
import { Client, ClientStatus } from "@/types/client";
import { useEffect } from "react";
import { toast } from "sonner";

export function DelayedClientsList() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { createNotificationIfNeeded } = useDelayedClientsNotifications();
  
  const { data: delayedClients = [], error, isError } = useDelayedClients(createNotificationIfNeeded);

  // Add notification sound effect
  useEffect(() => {
    const audio = new Audio("/notification-sound.mp3");
    
    const playNotificationSound = () => {
      audio.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    };

    if (delayedClients.length > 0) {
      playNotificationSound();
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [delayedClients]);

  console.log('Delayed clients data:', delayedClients);

  const isValidStatus = (status: string): status is ClientStatus => {
    return [
      'new',
      'potential',
      'interested',
      'responded',
      'noResponse',
      'scheduled',
      'postMeeting',
      'whatsappContact',
      'facebookContact',
      'booked',
      'cancelled',
      'sold',
      'postponed',
      'resale'
    ].includes(status);
  };

  // Map the data to match Client type
  const mappedClients = delayedClients
    .map(client => {
      if (!isValidStatus(client.status)) {
        console.error(`Invalid status: ${client.status} for client ${client.id}`);
        return null;
      }

      return {
        id: client.id,
        name: client.name,
        status: client.status,
        phone: client.phone,
        country: client.country,
        contactMethod: client.contact_method,
        userId: client.user_id,
        createdAt: new Date(client.created_at),
        updatedAt: new Date(client.updated_at),
        email: client.email || undefined,
        city: client.city || undefined,
        project: client.project || undefined,
        budget: client.budget || undefined,
        salesPerson: client.sales_person || undefined,
        facebook: client.facebook || undefined,
        campaign: client.campaign || undefined,
        assignedTo: client.assigned_to || undefined,
        nextActionDate: client.next_action_date ? new Date(client.next_action_date) : undefined,
        nextActionType: client.next_action_type || undefined,
        comments: client.comments || []
      } as Client;
    })
    .filter((client): client is Client => client !== null);

  if (isError) {
    console.error('Error loading delayed clients:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle className={cn(isRTL && "font-cairo")}>
            {t("errors.loadingClients")}
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <DelayedClientsListContent 
      clients={mappedClients}
      isRTL={isRTL}
    />
  );
}