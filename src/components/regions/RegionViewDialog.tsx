import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Region } from "@/types/region";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";

interface RegionViewDialogProps {
  region: Region | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegionViewDialog({
  region,
  open,
  onOpenChange
}: RegionViewDialogProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-lg",
        isMobile && "w-[90%] p-4"
      )}>
        <div className="space-y-4">
          <h2 className={cn(
            "text-xl font-semibold",
            isMobile && "text-lg",
            isRTL && "font-cairo text-right"
          )}>
            {region?.name}
          </h2>
          <p className={cn(
            "text-gray-600",
            isMobile && "text-sm",
            isRTL && "font-cairo text-right"
          )}>
            {region?.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}