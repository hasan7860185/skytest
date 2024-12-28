import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "./Message";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ChatMessagesProps {
  isRTL: boolean;
}

export function ChatMessages({ isRTL }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['chat-messages'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No authenticated session');
        }

        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            *,
            user:profiles(
              id,
              full_name,
              avatar
            ),
            reactions:chat_reactions(*),
            comments:chat_comments(
              *,
              user:profiles(
                id,
                full_name,
                avatar
              )
            )
          `)
          .order('created_at', { ascending: true });

        if (error) {
          if (error.message?.includes('Invalid Refresh Token') || 
              error.message?.includes('refresh_token_not_found')) {
            await supabase.auth.signOut();
            localStorage.removeItem('supabase.auth.token');
            sessionStorage.clear();
            
            toast.error(isRTL ? "انتهت صلاحية الجلسة" : "Session expired");
            navigate('/login');
            return null;
          }
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Error fetching messages:', error);
        
        if (error instanceof Error && 
            (error.message?.includes('Invalid Refresh Token') || 
             error.message?.includes('refresh_token_not_found'))) {
          await supabase.auth.signOut();
          localStorage.removeItem('supabase.auth.token');
          sessionStorage.clear();
          
          toast.error(isRTL ? "انتهت صلاحية الجلسة" : "Session expired");
          navigate('/login');
          return null;
        }
        
        throw error;
      }
    },
    refetchInterval: 5000
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full text-red-500">
        {isRTL ? "حدث خطأ أثناء تحميل الرسائل" : "Error loading messages"}
      </div>
    );
  }

  return (
    <ScrollArea 
      className={cn(
        "h-full md:w-[180%] w-full", // Updated width to 180% for desktop only
        "bg-white dark:bg-gray-900",
        "text-gray-900 dark:text-gray-100"
      )} 
      ref={scrollRef}
    >
      <div className={cn(
        "space-y-4 px-6 w-full",
        isRTL ? "space-x-reverse" : "",
      )}>
        {messages?.map((message) => (
          <Message 
            key={message.id}
            message={message}
            isRTL={isRTL}
          />
        ))}
      </div>
    </ScrollArea>
  );
}