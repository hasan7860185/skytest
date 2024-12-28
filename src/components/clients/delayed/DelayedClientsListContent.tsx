import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DelayedClientCard } from "./DelayedClientCard";
import { Client } from "@/types/client";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DelayedClientsListContentProps {
  clients: Client[];
  isRTL: boolean;
}

export function DelayedClientsListContent({ 
  clients,
  isRTL 
}: DelayedClientsListContentProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false); // Changed default to false
  const [handledClients, setHandledClients] = useState<string[]>([]);

  const handleClientAction = (clientId: string) => {
    setHandledClients(prev => [...prev, clientId]);
  };

  const unhandledClients = clients.filter(client => !handledClients.includes(client.id));

  if (!unhandledClients.length) {
    return null;
  }

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <h2 className={cn("text-lg font-semibold", isRTL && "font-cairo")}>
          {t("clients.delayedList")} ({unhandledClients.length})
        </h2>
        <ChevronDown 
          className={cn(
            "h-5 w-4 transition-transform duration-200",
            isExpanded ? "transform rotate-180" : ""
          )} 
        />
      </button>
      
      {isExpanded && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {unhandledClients.map((client) => (
            <DelayedClientCard 
              key={client.id} 
              client={client}
              isRTL={isRTL}
              onAction={() => handleClientAction(client.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}