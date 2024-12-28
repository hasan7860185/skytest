import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialPermissions: string[];
}

export function PermissionsDialog({
  open,
  onOpenChange,
  userId,
  initialPermissions
}: PermissionsDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [permissions, setPermissions] = useState<string[]>(initialPermissions);

  const handleSave = async () => {
    // Implement permissions saving logic here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={cn(isRTL && "font-cairo text-right")}>
            {t('users.permissions.title')}
          </DialogTitle>
        </DialogHeader>

        <div className={cn(
          "flex justify-end gap-2 mt-6",
          isRTL && "flex-row-reverse"
        )}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={cn(isRTL && "font-cairo")}
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            onClick={handleSave}
            className={cn(isRTL && "font-cairo")}
          >
            {isRTL ? "حفظ" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}