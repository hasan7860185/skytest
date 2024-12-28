import { Facebook, MessageCircle, FileCode } from "lucide-react";
import { ShareButton } from "@/components/companies/project-form/share/buttons/ShareButton";

interface ShareButtonsGroupProps {
  onWhatsAppShare: () => void;
  onFacebookShare: () => void;
  onDownloadHTML: () => void;
  isRTL: boolean;
}

export function ShareButtonsGroup({
  onWhatsAppShare,
  onFacebookShare,
  onDownloadHTML,
  isRTL
}: ShareButtonsGroupProps) {
  return (
    <div className="flex gap-2 justify-center mt-4">
      <ShareButton
        onClick={onWhatsAppShare}
        icon={MessageCircle}
        title={isRTL ? "مشاركة عبر واتساب" : "Share via WhatsApp"}
        iconColor="text-green-600"
      />

      <ShareButton
        onClick={onFacebookShare}
        icon={Facebook}
        title={isRTL ? "مشاركة عبر فيسبوك" : "Share via Facebook"}
        iconColor="text-blue-600"
      />

      <ShareButton
        onClick={onDownloadHTML}
        icon={FileCode}
        title={isRTL ? "تحميل كصفحة ويب" : "Download as webpage"}
        iconColor="text-yellow-600"
      />
    </div>
  );
}