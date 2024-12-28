import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/integrations/supabase/types/chat";

interface MessageContentProps {
  message: ChatMessage;
  isRTL: boolean;
}

export function MessageContent({ message, isRTL }: MessageContentProps) {
  return (
    <div className={cn(
      "rounded-lg bg-muted p-4 w-full overflow-x-hidden break-words",
      isRTL ? "text-right" : ""
    )}>
      <p className="whitespace-pre-wrap">{message.content}</p>
      {message.image && (
        <img
          src={message.image}
          alt=""
          className="mt-2 rounded-lg max-h-96 object-cover w-full"
        />
      )}
      {message.video && (
        <video
          src={message.video}
          controls
          className="mt-2 rounded-lg max-h-96 w-full"
        />
      )}
    </div>
  );
}