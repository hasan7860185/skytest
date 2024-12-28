import { Facebook, MessageCircle, FileCode, FileText } from "lucide-react";
import { ShareButton } from "@/components/companies/project-form/share/buttons/ShareButton";
import { usePropertyShare } from "./hooks/usePropertyShare";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyShareButtonsProps {
  property: any;
  selectedFields: string[];
  isRTL: boolean;
}

export function PropertyShareButtons({ property, selectedFields, isRTL }: PropertyShareButtonsProps) {
  const isMobile = useIsMobile();
  const { 
    isLoading,
    handleWhatsAppShare,
    handleFacebookShare,
    handleDownloadHTML,
    handleDownloadPDF
  } = usePropertyShare({ property, selectedFields, isRTL });

  return (
    <div className={`flex ${isMobile ? 'flex-col' : ''} gap-2 justify-center mt-4`}>
      <ShareButton
        onClick={handleWhatsAppShare}
        icon={MessageCircle}
        title={isRTL ? "مشاركة عبر واتساب" : "Share via WhatsApp"}
        iconColor="text-green-600"
        className={isMobile ? "w-full" : ""}
        disabled={isLoading}
      />

      <ShareButton
        onClick={handleFacebookShare}
        icon={Facebook}
        title={isRTL ? "مشاركة عبر ماسنجر" : "Share via Messenger"}
        iconColor="text-blue-600"
        className={isMobile ? "w-full" : ""}
        disabled={isLoading}
      />

      <ShareButton
        onClick={handleDownloadHTML}
        icon={FileCode}
        title={isRTL ? "تحميل كصفحة ويب" : "Download as webpage"}
        iconColor="text-yellow-600"
        className={isMobile ? "w-full" : ""}
        disabled={isLoading}
      />

      <ShareButton
        onClick={handleDownloadPDF}
        icon={FileText}
        title={isRTL ? "تنزيل PDF" : "Download PDF"}
        iconColor="text-red-600"
        className={isMobile ? "w-full" : ""}
        disabled={isLoading}
      />
    </div>
  );
}