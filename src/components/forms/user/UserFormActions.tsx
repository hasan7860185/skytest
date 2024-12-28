import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserFormActionsProps {
  isRTL: boolean;
  isUpdating: boolean;
  onCancel?: () => void;
  onSave: () => void;
}

export function UserFormActions({
  isRTL,
  isUpdating,
  onCancel,
  onSave
}: UserFormActionsProps) {
  return (
    <div className={cn(
      "flex justify-end gap-2",
      isRTL && "flex-row-reverse"
    )}>
      {onCancel && (
        <Button 
          variant="outline"
          onClick={onCancel}
          className={cn(isRTL && "font-cairo")}
        >
          {isRTL ? "إلغاء" : "Cancel"}
        </Button>
      )}
      <Button 
        onClick={onSave}
        disabled={isUpdating}
        className={cn(isRTL && "font-cairo")}
      >
        {isRTL ? "حفظ" : "Save"}
      </Button>
    </div>
  );
}