import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useClientDeletion } from "@/hooks/useClientDeletion";
import { useState } from "react";

interface ClientTableActionsProps {
  isSelected: boolean;
  onSelect: (id: string) => void;
  clientId: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => Promise<void>;
}

export function ClientTableActions({
  isSelected,
  onSelect,
  clientId,
  isFavorite = false,
  onToggleFavorite
}: ClientTableActionsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { deleteClients, isDeleting } = useClientDeletion();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      await deleteClients([clientId]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onSelect(clientId)}
      />
      {onToggleFavorite && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(clientId);
          }}
          className={cn(
            "p-0 h-8 w-8",
            isFavorite && "text-yellow-500"
          )}
        >
          <Star className="h-4 w-4" />
        </Button>
      )}
      <Button 
        variant="ghost" 
        size="sm"
        className="p-0 h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30"
        onClick={handleDelete}
        disabled={isDeleting || isProcessing}
      >
        <Trash2 className="h-4 w-4 text-[#cf1020]" />
      </Button>
    </div>
  );
}