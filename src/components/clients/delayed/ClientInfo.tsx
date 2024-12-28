import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ClientInfoProps {
  client: any;
  isRTL: boolean;
  userName: string;
}

export function ClientInfo({ client, isRTL, userName }: ClientInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-1">
      <p className={cn(
        "font-medium",
        isRTL && "font-cairo"
      )}>
        {client.name}
      </p>
      <div className="flex flex-col gap-1">
        <p className={cn(
          "text-gray-500 dark:text-gray-400",
          isRTL && "font-cairo"
        )}>
          {t(`status.${client.status}`)}
        </p>
        <p className={cn(
          "text-gray-500 dark:text-gray-400",
          isRTL && "font-cairo"
        )}>
          {isRTL ? "المسؤول:" : "Assigned to:"} {userName}
        </p>
        {client.next_action_type && (
          <p className={cn(
            "text-gray-500 dark:text-gray-400",
            isRTL && "font-cairo"
          )}>
            {isRTL ? "الإجراء:" : "Action:"} {t(`status.${client.next_action_type}`)}
          </p>
        )}
      </div>
    </div>
  );
}