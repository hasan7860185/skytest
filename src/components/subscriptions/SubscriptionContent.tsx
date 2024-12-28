import { Card } from "@/components/ui/card";
import { SubscriptionsList } from "./SubscriptionsList";
import { cn } from "@/lib/utils";

interface SubscriptionContentProps {
  isRTL: boolean;
  isLoading: boolean;
  subscriptions: any[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, max_users: number) => void;
  onCredentialsUpdate: (id: string, email: string, password: string) => void;
  onDaysUpdate: (id: string, days: number) => void;
  isUpdating?: boolean;
}

export function SubscriptionContent({
  isRTL,
  isLoading,
  subscriptions,
  onDelete,
  onUpdate,
  onCredentialsUpdate,
  onDaysUpdate,
  isUpdating
}: SubscriptionContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SubscriptionsList
      subscriptions={subscriptions}
      onDelete={onDelete}
      onUpdate={onUpdate}
      onCredentialsUpdate={onCredentialsUpdate}
      onDaysUpdate={onDaysUpdate}
      isRTL={isRTL}
      isUpdating={isUpdating}
    />
  );
}