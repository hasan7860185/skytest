import { Card } from "@/components/ui/card";
import { SubscriptionCard } from "./SubscriptionCard";

interface SubscriptionsListProps {
  subscriptions: any[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, max_users: number) => void;
  onCredentialsUpdate: (id: string, email: string, password: string) => void;
  onDaysUpdate: (id: string, days: number) => void;
  isRTL: boolean;
  isUpdating?: boolean;
}

export function SubscriptionsList({
  subscriptions,
  onDelete,
  onUpdate,
  onCredentialsUpdate,
  onDaysUpdate,
  isRTL,
  isUpdating
}: SubscriptionsListProps) {
  if (!subscriptions?.length) {
    return (
      <Card className="p-6 text-center text-gray-500">
        {isRTL ? "لا توجد اشتراكات حالياً" : "No subscriptions found"}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onCredentialsUpdate={onCredentialsUpdate}
          onDaysUpdate={onDaysUpdate}
          isRTL={isRTL}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
}