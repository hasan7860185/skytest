import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Region } from "@/types/region";
import { useTranslation } from "react-i18next";

interface RegionEditDialogProps {
  region: Region | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (region: Region) => void;
}

export function RegionEditDialog({
  region,
  open,
  onOpenChange,
  onSubmit,
  onChange
}: RegionEditDialogProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={cn(isRTL && "text-right block")}>
              {isRTL ? "اسم المنطقة" : "Region Name"}
            </Label>
            <Input
              id="name"
              value={region?.name || ''}
              onChange={(e) => onChange({ ...region, name: e.target.value } as Region)}
              className={cn(isRTL && "text-right")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className={cn(isRTL && "text-right block")}>
              {isRTL ? "الوصف" : "Description"}
            </Label>
            <Textarea
              id="description"
              value={region?.description || ''}
              onChange={(e) => onChange({ ...region, description: e.target.value } as Region)}
              className={cn(isRTL && "text-right")}
            />
          </div>
          <div className={cn(
            "flex gap-2",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <Button type="submit">
              {isRTL ? "حفظ" : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}