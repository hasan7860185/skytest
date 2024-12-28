import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface UserBasicInfoProps {
  fullName: string;
  email: string;
  isUpdating: boolean;
  isRTL: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export function UserBasicInfo({
  fullName,
  email,
  isUpdating,
  isRTL,
  onFullNameChange,
  onEmailChange
}: UserBasicInfoProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name" className={cn(isRTL && "font-cairo text-right")}>
          {isRTL ? "الاسم الكامل" : "Full Name"}
        </Label>
        <Input
          id="name"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          disabled={isUpdating}
          className={cn(isRTL && "font-cairo text-right")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email" className={cn(isRTL && "font-cairo text-right")}>
          {isRTL ? "البريد الإلكتروني" : "Email"}
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isUpdating}
          className={cn(isRTL && "text-left")}
          dir="ltr"
        />
      </div>
    </>
  );
}