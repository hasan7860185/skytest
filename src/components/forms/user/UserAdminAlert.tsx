import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAdminAlertProps {
  isRTL: boolean;
}

export function UserAdminAlert({ isRTL }: UserAdminAlertProps) {
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription className={cn(isRTL && "font-cairo")}>
        {isRTL ? 'فقط مدير النظام يمكنه تغيير الأدوار' : 'Only administrators can change roles'}
      </AlertDescription>
    </Alert>
  );
}