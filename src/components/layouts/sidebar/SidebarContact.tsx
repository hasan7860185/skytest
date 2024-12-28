import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface SidebarContactProps {
  buttonClasses: string;
  isRTL: boolean;
  onNavigate: (path: string) => void;
}

export function SidebarContact({ buttonClasses, isRTL, onNavigate }: SidebarContactProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4 border-t border-[#0A0F2C]/50">
      <Button 
        variant="ghost"
        className={cn(
          buttonClasses,
          "border-2 border-[#E5DEFF]/30 rounded-lg",
          "bg-[#f0f8ff] hover:bg-[#f0f8ff]/80",
          "hover:border-[#E5DEFF]/50 transition-all duration-300",
          "focus:border-[#E5DEFF]/70 focus:ring-2 focus:ring-[#E5DEFF]/20",
          isRTL ? "flex-row-reverse" : ""
        )}
        onClick={() => onNavigate('/contact')}
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>{t("contact.title")}</span>
        </div>
      </Button>
    </div>
  );
}