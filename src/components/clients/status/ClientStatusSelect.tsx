import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ClientStatusSelectProps {
  status: string;
  onStatusChange: (value: string) => void;
}

export function ClientStatusSelect({ status, onStatusChange }: ClientStatusSelectProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger 
        className={cn(
          "w-[180px]",
          "bg-white/5 dark:bg-gray-800/50",
          "border-gray-200/20 dark:border-gray-700/30",
          "text-gray-700 dark:text-gray-100",
          "hover:bg-gray-50/90 dark:hover:bg-gray-700/50",
          isRTL && "font-cairo"
        )}
      >
        <SelectValue>
          {t(`clients.status.${status}`)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
        <SelectItem value="new" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.new")}</SelectItem>
        <SelectItem value="potential" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.potential")}</SelectItem>
        <SelectItem value="interested" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.interested")}</SelectItem>
        <SelectItem value="responded" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.responded")}</SelectItem>
        <SelectItem value="noResponse" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.noResponse")}</SelectItem>
        <SelectItem value="scheduled" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.scheduled")}</SelectItem>
        <SelectItem value="postMeeting" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.postMeeting")}</SelectItem>
        <SelectItem value="whatsappContact" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.whatsappContact")}</SelectItem>
        <SelectItem value="facebookContact" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.facebookContact")}</SelectItem>
        <SelectItem value="booked" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.booked")}</SelectItem>
        <SelectItem value="cancelled" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.cancelled")}</SelectItem>
        <SelectItem value="sold" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.sold")}</SelectItem>
        <SelectItem value="postponed" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.postponed")}</SelectItem>
        <SelectItem value="resale" className="dark:text-gray-100 dark:hover:bg-gray-700/50">{t("clients.status.resale")}</SelectItem>
      </SelectContent>
    </Select>
  );
}