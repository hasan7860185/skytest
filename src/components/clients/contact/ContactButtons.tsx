import { MessageCircle, Phone, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContactButtonsProps {
  phone: string;
  facebookId?: string;
  showInNormalView?: boolean;
}

export function ContactButtons({ 
  phone, 
  facebookId,
  showInNormalView = false 
}: ContactButtonsProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const openWhatsApp = (phone: string) => {
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  const openMessenger = (facebookId: string) => {
    if (facebookId) {
      window.open(`https://m.me/${facebookId}`, '_blank');
    } else {
      toast.error(t('clients.errors.noFacebookId'));
    }
  };

  const openTruecaller = (phone: string) => {
    const formattedPhone = phone.replace(/\D/g, '');
    // Check if it's a mobile device
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = `tel:${formattedPhone}`;
    } else {
      // Fallback to web version for desktop
      window.open(`https://www.truecaller.com/search/${formattedPhone}`, '_blank');
    }
  };

  // Hide buttons in normal view on desktop unless explicitly requested
  if (!showInNormalView && !isMobile) {
    return null;
  }

  return (
    <div className="flex gap-4 bg-transparent">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => openWhatsApp(phone)}
              className="hover:opacity-70 transition-opacity bg-transparent"
            >
              <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-transparent border-0">
            <p>WhatsApp</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => openMessenger(facebookId || '')}
              className="hover:opacity-70 transition-opacity bg-transparent"
            >
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-transparent border-0">
            <p>Messenger</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => openTruecaller(phone)}
              className="hover:opacity-70 transition-opacity bg-transparent"
            >
              <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-transparent border-0">
            <p>Truecaller</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}