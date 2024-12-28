import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatInputProps {
  isRTL: boolean;
}

export function ChatInput({ isRTL }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { error } = await supabase.from('chat_messages').insert({
        content: message,
        user_id: session.user.id
      });

      if (error) throw error;
      
      setMessage("");
      toast.success(isRTL ? "تم إرسال الرسالة" : "Message sent");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(isRTL ? "حدث خطأ أثناء إرسال الرسالة" : "Error sending message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:w-[180%] w-full p-4 border-t dark:border-gray-700 dark:bg-gray-900"> {/* Updated width to 180% for desktop only */}
      <div className={cn(
        "flex items-end gap-2 w-full",
        isRTL ? "flex-row-reverse" : ""
      )}>
        <form onSubmit={handleSubmit} className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isRTL ? "اكتب رسالتك هنا..." : "Type your message here..."}
            className="min-h-[80px] resize-none"
            dir={isRTL ? "rtl" : "ltr"}
          />
        </form>
        <Button 
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}