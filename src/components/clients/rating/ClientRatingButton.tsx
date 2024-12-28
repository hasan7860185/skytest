import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import { ClientRatingDialog } from "./ClientRatingDialog";

interface ClientRatingButtonProps {
  clientId: string;
  clientName: string;
  currentRating?: number;
  onRatingUpdate?: () => void;
}

export function ClientRatingButton({
  clientId,
  clientName,
  currentRating,
  onRatingUpdate
}: ClientRatingButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${currentRating ? 'text-yellow-400' : 'text-gray-300'}`}
        onClick={() => setIsDialogOpen(true)}
      >
        <Star 
          className="h-5 w-5" 
          fill={currentRating ? 'currentColor' : 'none'} 
        />
      </Button>

      <ClientRatingDialog
        clientId={clientId}
        clientName={clientName}
        currentRating={currentRating}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onRatingUpdate={onRatingUpdate}
      />
    </>
  );
}