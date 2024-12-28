import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { AddClientForm } from "@/components/AddClientForm";
import { ImportClientsSheet } from "@/components/ImportClientsSheet";
import { cn } from "@/lib/utils";

interface SidebarClientActionsProps {
  buttonClasses: string;
  isRTL: boolean;
  onMobileClose: () => void;
}

export function SidebarClientActions({ buttonClasses, isRTL, onMobileClose }: SidebarClientActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 mb-6">
      <AddClientForm defaultStatus="new">
        <Button 
          variant="ghost"
          className={cn(
            buttonClasses,
            "border-2 border-[#E5DEFF]/30 rounded-lg",
            "bg-[#f0f8ff] hover:bg-[#f0f8ff]/80",
            "hover:border-[#E5DEFF]/50 transition-all duration-300",
            "focus:border-[#E5DEFF]/70 focus:ring-2 focus:ring-[#E5DEFF]/20",
            isRTL ? "text-right" : "text-left"
          )}
          onClick={onMobileClose}
        >
          {t("nav.addClient")}
        </Button>
      </AddClientForm>

      <ImportClientsSheet>
        <Button 
          variant="ghost" 
          className={cn(
            buttonClasses,
            "border-2 border-[#E5DEFF]/30 rounded-lg",
            "bg-[#f0f8ff] hover:bg-[#f0f8ff]/80",
            "hover:border-[#E5DEFF]/50 transition-all duration-300",
            "focus:border-[#E5DEFF]/70 focus:ring-2 focus:ring-[#E5DEFF]/20",
            isRTL ? "text-right" : "text-left"
          )}
          onClick={onMobileClose}
        >
          {t("nav.importClients")}
        </Button>
      </ImportClientsSheet>
    </div>
  );
}