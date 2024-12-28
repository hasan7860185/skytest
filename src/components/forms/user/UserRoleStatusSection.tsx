import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRoleStatus } from "@/components/forms/UserRoleStatus";

interface UserRoleStatusSectionProps {
  role: string;
  status: string;
  isRTL: boolean;
  isAdmin: boolean;
  isUpdating: boolean;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function UserRoleStatusSection({
  role,
  status,
  isRTL,
  isAdmin,
  isUpdating,
  onRoleChange,
  onStatusChange
}: UserRoleStatusSectionProps) {
  return (
    <>
      <UserRoleStatus
        role={role}
        status={status}
        onRoleChange={onRoleChange}
        onStatusChange={onStatusChange}
        disabled={isUpdating || !isAdmin}
      />

      {!isAdmin && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription className={cn(isRTL && "font-cairo")}>
            {isRTL ? 'فقط مدير النظام يمكنه تغيير الأدوار' : 'Only administrators can change roles'}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}