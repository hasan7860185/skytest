import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatusCard } from "./StatusCard";
import { useClientStatuses } from "@/data/clientStatuses";
import { useTranslation } from "react-i18next";
import { useClientStore } from "@/data/clientsData";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const StatusGrid = () => {
  const [showAll, setShowAll] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const clientStatuses = useClientStatuses();
  const clients = useClientStore((state) => state.clients);
  const displayedStatuses = showAll ? clientStatuses : clientStatuses.slice(0, 10);

  // Fetch user role when component mounts
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserRole(profile.role);
        }
      }
    };
    fetchUserRole();
  }, []);

  const getStatusCount = (status: string) => {
    return clients.filter(client => {
      if (status === "all") return true;
      const statusMatch = client.status === status;
      if (userRole === 'admin' || userRole === 'supervisor') {
        return statusMatch;
      }
      return statusMatch && client.assignedTo;
    }).length;
  };

  const getTotalCount = () => {
    if (userRole === 'admin' || userRole === 'supervisor') {
      return clients.length;
    }
    return clients.filter(client => client.assignedTo).length;
  };

  return (
    <div className={cn(
      "space-y-6",
      isRTL && "font-cairo"
    )}>
      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-5 gap-4 w-full",
        isRTL && "font-cairo"
      )}>
        {displayedStatuses.map((status) => (
          <StatusCard
            key={status.label}
            label={t(status.label)}
            count={getStatusCount(status.key)}
            total={getTotalCount()}
            Icon={status.icon}
            status={status.key}
          />
        ))}
      </div>

      {clientStatuses.length > 10 && (
        <div className={cn(
          "flex justify-center",
          isRTL && "font-cairo"
        )}>
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className={cn(
              "text-sm",
              "bg-white hover:bg-gray-50",
              "text-gray-600",
              "border border-gray-200",
              "hover:text-gray-900",
              "transition-all duration-300",
              "shadow-sm",
              isRTL && "font-cairo"
            )}
          >
            {showAll ? t("status.showLess") : t("status.showMore")}
          </Button>
        </div>
      )}
    </div>
  );
};