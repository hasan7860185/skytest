import { useState } from "react";
import { UserAvatar } from "@/components/users/UserAvatar";
import { cn } from "@/lib/utils";
import { MessageHeader } from "./message/MessageHeader";
import { MessageContent } from "./message/MessageContent";
import { MessageActions } from "./message/MessageActions";
import { Comments } from "./Comments";
import { Reactions } from "./Reactions";
import type { ChatMessage } from "@/integrations/supabase/types/chat";

interface MessageProps {
  message: ChatMessage;
  isRTL: boolean;
}

export function Message({ message, isRTL }: MessageProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className={cn(
      "flex gap-2 md:gap-4 w-full px-2 md:px-0",
      isRTL ? "flex-row-reverse" : ""
    )}>
      <div className="flex-shrink-0">
        <UserAvatar
          user={{
            full_name: message.user?.full_name,
            avatar: message.user?.avatar
          }}
        />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <MessageHeader message={message} isRTL={isRTL} />
        <MessageContent message={message} isRTL={isRTL} />
        <MessageActions 
          message={message} 
          isRTL={isRTL}
          onToggleComments={() => setShowComments(!showComments)} 
        />
        <Reactions messageId={message.id} reactions={message.reactions || []} isRTL={isRTL} />
        {showComments && (
          <Comments
            messageId={message.id}
            comments={message.comments || []}
            isRTL={isRTL}
          />
        )}
      </div>
    </div>
  );
}