import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface UserFormFieldsProps {
  fullName: string;
  email: string;
  password: string;
  isUpdating: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export function UserFormFields({
  fullName,
  email,
  password,
  isUpdating,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
}: UserFormFieldsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name" className={cn(isRTL && "font-cairo text-right")}>
          {t('users.name')}
        </Label>
        <Input
          id="name"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          disabled={isUpdating}
          className={cn(isRTL && "font-cairo text-right")}
          placeholder={t('users.form.namePlaceholder')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email" className={cn(isRTL && "font-cairo text-right")}>
          {t('users.email')}
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isUpdating}
          className={cn(isRTL && "text-left")}
          dir="ltr"
          placeholder={t('users.form.emailPlaceholder')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password" className={cn(isRTL && "font-cairo text-right")}>
          {t('users.password')}
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={isUpdating}
          className={cn(isRTL && "text-left")}
          dir="ltr"
          placeholder={t('users.form.passwordPlaceholder')}
        />
      </div>
    </>
  );
}