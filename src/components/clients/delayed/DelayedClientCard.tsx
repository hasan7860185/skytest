import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ClientPreviewDialog } from "../ClientPreviewDialog";
import { ClientInfo } from "./ClientInfo";
import { ClientDate } from "./ClientDate";
import { useDelayedClientActions } from "./hooks/useDelayedClientActions";
import { useUserDetails } from "./hooks/useUserDetails";
import { Client } from "@/types/client";

interface DelayedClientCardProps {
  client: Client;
  isRTL: boolean;
  onAction: () => void;
}

export function DelayedClientCard({ 
  client, 
  isRTL, 
  onAction 
}: DelayedClientCardProps) {
  const { t } = useTranslation();
  const { isPreviewOpen, setIsPreviewOpen, handleDialogClose } = useDelayedClientActions(client.id, onAction);
  const { userName, shouldShowClient } = useUserDetails(client.userId, client.assignedTo);

  if (!shouldShowClient) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPreviewOpen(true);
  };

  return (
    <>
      <Link
        to={`/clients/${client.status}`}
        onClick={handleClick}
        className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors"
      >
        <div className={cn(
          "flex items-center justify-between",
          "text-sm"
        )}>
          <ClientInfo 
            client={client}
            isRTL={isRTL}
            userName={userName}
          />
          {client.nextActionDate && (
            <ClientDate 
              date={client.nextActionDate.toISOString()}
              isRTL={isRTL}
            />
          )}
        </div>
      </Link>

      {isPreviewOpen && (
        <ClientPreviewDialog
          client={client}
          open={isPreviewOpen}
          onOpenChange={handleDialogClose}
        />
      )}
    </>
  );
}