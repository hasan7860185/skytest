import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { ExternalLink, MessageSquare } from "lucide-react";

export function ClientsTableHeader() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <TableHeader>
      <TableRow className="whitespace-nowrap bg-[#191970] text-[#f0f8ff]">
        <TableHead className="w-[100px] bg-[#191970] text-[#f0f8ff]">
          {/* Actions column */}
        </TableHead>
        <TableHead className={`w-[200px] ${isRTL ? "text-right" : "text-left"} bg-[#191970] text-[#f0f8ff]`}>
          {t("clients.form.name")}
        </TableHead>
        <TableHead className={`w-[150px] ${isRTL ? "text-right" : "text-left"} bg-[#191970] text-[#f0f8ff]`}>
          {t("clients.form.phone")}
        </TableHead>
        <TableHead className={`w-[200px] ${isRTL ? "text-right" : "text-left"} bg-[#191970] text-[#f0f8ff]`}>
          {t("clients.form.email")}
        </TableHead>
        <TableHead className={`w-[150px] ${isRTL ? "text-right" : "text-left"} bg-[#191970] text-[#f0f8ff]`}>
          {t("clients.form.country")}
        </TableHead>
        <TableHead className={`w-[150px] ${isRTL ? "text-right" : "text-left"} bg-[#191970] text-[#f0f8ff]`}>
          {t("clients.form.city")}
        </TableHead>
        <TableHead className={`w-[150px] ${isRTL ? "text-right" : "text-left"} bg-[#191970] text-[#f0f8ff]`}>
          {t("clients.form.project")}
        </TableHead>
        <TableHead className={`w-[150px] ${isRTL ? "text-right" : "text-left"} bg-[#191970] text-[#f0f8ff]`}>
          {t("table.status")}
        </TableHead>
        <TableHead className={`w-[150px] ${isRTL ? "text-right" : "text-left"} bg-[#191970] text-[#f0f8ff]`}>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            {isRTL ? "رابط المنشور" : "Post URL"}
          </div>
        </TableHead>
        <TableHead className={`w-[150px] ${isRTL ? "text-right" : "text-left"} bg-[#191970] text-[#f0f8ff]`}>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {isRTL ? "التعليق" : "Comment"}
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}