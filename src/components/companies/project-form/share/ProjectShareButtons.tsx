import { Facebook, MessageCircle, FileCode, FileText } from "lucide-react";
import { ShareButton } from "./buttons/ShareButton";
import { useProjectShare } from "./hooks/useProjectShare";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectShareButtonsProps {
  project: any;
  selectedFields: string[];
  isRTL: boolean;
}

export function ProjectShareButtons({ project, selectedFields, isRTL }: ProjectShareButtonsProps) {
  const isMobile = useIsMobile();
  const { 
    isLoading,
    handleWhatsAppShare,
    handleFacebookShare,
    handleDownloadHTML,
    handleDownloadPDF
  } = useProjectShare({ project, selectedFields, isRTL });

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