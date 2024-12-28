import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/integrations/supabase/types/chat";

interface MessageActionsProps {
  message: ChatMessage;
  isRTL: boolean;
  onToggleComments: () => void;
}

export function MessageActions({ message, isRTL, onToggleComments }: MessageActionsProps) {
  return (
    <div className={cn(
      "flex items-center gap-4",
      isRTL ? "flex-row-reverse" : ""
    )}>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={onToggleComments}
      >
        <MessageSquare className="h-4 w-4" />
        {message.comments?.length || 0}
      </Button>
    </div>
  );
}