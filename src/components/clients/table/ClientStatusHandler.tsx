import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { staticClientStatuses } from "@/data/clientStatuses";

interface ClientStatusHandlerProps {
  status: string;
  clientId: string;
  userId: string;
  assignedTo?: string;
  clientName: string;
}

export function ClientStatusHandler({ status }: ClientStatusHandlerProps) {
  const { t } = useTranslation();

  // Find the status icon
  const statusConfig = staticClientStatuses.find(s => s.key === status);
  const StatusIcon = statusConfig?.icon;

  return (
    <Badge 
      variant="outline" 
      className="gap-2 py-1.5 px-3 bg-[#191970] text-white hover:bg-[#191970]/90"
    >
      {StatusIcon && <StatusIcon className="h-4 w-4" />}
      <span>{t(`status.${status}`)}</span>
    </Badge>
  );
}