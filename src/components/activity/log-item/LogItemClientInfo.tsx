import { useTranslation } from "react-i18next";

interface LogItemClientInfoProps {
  details: {
    new_data?: any;
    old_data?: any;
  } | null;
}

export function LogItemClientInfo({ details }: LogItemClientInfoProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!details) return null;
  
  const clientData = details.new_data || details.old_data;
  if (!clientData) return null;

  return (
    <div className="text-sm text-muted-foreground">
      <span className="font-medium">
        {isRTL ? "العميل: " : "Client: "}
      </span>
      <span>{clientData.name}</span>
      {clientData.phone && (
        <>
          <span className="mx-1">-</span>
          <span>{clientData.phone}</span>
        </>
      )}
    </div>
  );
}