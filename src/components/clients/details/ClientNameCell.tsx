import { useState } from "react";
import { TableCell } from "@/components/ui/table";
import { Client } from "@/data/clientsData";
import { ClientAssignmentInfo } from "../ClientAssignmentInfo";
import { ClientPreviewDialog } from "../ClientPreviewDialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ClientNameCellProps {
  client: Client;
}

export function ClientNameCell({ client }: ClientNameCellProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <TableCell>
      <div className="space-y-1">
        <div className="group relative flex items-center gap-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className={cn(
              "font-medium hover:underline block",
              isRTL ? "text-right" : "text-left"
            )}
          >
            {client.name}
          </button>
        </div>
        
        <ClientAssignmentInfo
          assignedTo={client.assignedTo}
          userId={client.userId}
        />
      </div>
      
      <ClientPreviewDialog
        client={client}
        onOpenChange={setIsPreviewOpen}
        open={isPreviewOpen}
      />
    </TableCell>
  );
}