import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";

interface NotificationActionsProps {
  showMarkAsRead?: boolean;
  showDelete?: boolean;
  onMarkAsRead: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export function NotificationActions({ 
  showMarkAsRead, 
  showDelete, 
  onMarkAsRead, 
  onDelete 
}: NotificationActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {showMarkAsRead && (
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary"
          onClick={onMarkAsRead}
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
      {showDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}