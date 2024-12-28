import { useTranslation } from "react-i18next";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { cn } from "@/lib/utils";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";

export default function Chat() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <DashboardContent>
        <div className={cn(
          "w-full pt-20",
          isRTL && "font-cairo"
        )}>
          <div className="flex flex-col h-[calc(100vh-theme(spacing.32))] w-full">
            <div className="flex-1 w-full">
              <ChatMessages isRTL={isRTL} />
            </div>
            <ChatInput isRTL={isRTL} />
          </div>
        </div>
      </DashboardContent>
    </div>
  );
}