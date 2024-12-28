import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAlertInfoProps {
  role: string;
  isRTL: boolean;
}

export function UserAlertInfo({ role, isRTL }: UserAlertInfoProps) {
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription className={cn(isRTL && "font-cairo")}>
        {isRTL ? 'دورك الحالي:' : 'Your current role:'} {role}
      </AlertDescription>
    </Alert>
  );
}