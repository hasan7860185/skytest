import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { SubscriptionHeader } from "@/components/subscriptions/SubscriptionHeader";
import { SubscriptionContent } from "@/components/subscriptions/SubscriptionContent";
import { UnauthorizedMessage } from "@/components/subscriptions/UnauthorizedMessage";
import { useSubscriptions } from "@/hooks/useSubscriptions";

export default function Subscriptions() {
  const { open } = useSidebar();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    userProfile,
    isProfileLoading,
    subscriptions,
    isSubscriptionsLoading,
    updateSubscription,
    updateCredentials,
    deleteSubscription,
    updateDays
  } = useSubscriptions(isRTL);

  // If not super admin, show unauthorized message
  if (!isProfileLoading && !userProfile?.is_super_admin) {
    return (
      <DashboardLayout>
        <DashboardSidebar open={open} />
        <DashboardContent>
          <UnauthorizedMessage isRTL={isRTL} />
        </DashboardContent>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardSidebar open={open} />
      <DashboardContent>
        <div className="max-w-4xl mx-auto p-6">
          <SubscriptionHeader
            title={t("nav.subscriptions")}
            isRTL={isRTL}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />

          <SubscriptionContent
            isRTL={isRTL}
            isLoading={isProfileLoading || isSubscriptionsLoading}
            subscriptions={subscriptions || []}
            onDelete={(id) => deleteSubscription.mutate(id)}
            onUpdate={(id, max_users) => updateSubscription.mutate({ id, max_users })}
            onCredentialsUpdate={(id, email, password) => 
              updateCredentials.mutate({ id, email, password })
            }
            onDaysUpdate={(id, days) => updateDays.mutate({ id, days })}
            isUpdating={updateSubscription.isPending || updateCredentials.isPending || updateDays.isPending}
          />
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}