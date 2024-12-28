import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubscriptionCredentialsProps {
  adminEmail: string | null;
  adminPassword: string | null;
  onUpdate: (email: string, password: string) => void;
  isRTL: boolean;
  isUpdating?: boolean;
}

export function SubscriptionCredentials({
  adminEmail,
  adminPassword,
  onUpdate,
  isRTL,
  isUpdating
}: SubscriptionCredentialsProps) {
  const [email, setEmail] = useState(adminEmail || "");
  const [password, setPassword] = useState(adminPassword || "");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      );

      if (error) throw error;
      
      toast.success(isRTL ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" : "Password reset link has been sent to your email");
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(isRTL ? "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور" : "Error sending password reset link");
    }
  };

  const handleSave = () => {
    onUpdate(email, password);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className={cn(isRTL && "font-cairo text-right block")}>
            {isRTL ? "البريد الإلكتروني للمسؤول" : "Admin Email"}
          </Label>
          <div className="flex items-center justify-between gap-2">
            <Input 
              value={adminEmail || ""} 
              readOnly 
              className={cn("bg-gray-50", isRTL && "text-right")}
              dir="ltr"
            />
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className={cn(isRTL && "font-cairo")}
            >
              {isRTL ? "تعديل" : "Edit"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className={cn(isRTL && "font-cairo text-right block")}>
            {isRTL ? "كلمة المرور" : "Password"}
          </Label>
          <div className="flex items-center justify-between gap-2">
            <Input 
              type="password"
              value={adminPassword || ""} 
              readOnly 
              className={cn("bg-gray-50", isRTL && "text-right")}
              dir="ltr"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className={cn(isRTL && "font-cairo text-right block")}>
          {isRTL ? "البريد الإلكتروني للمسؤول" : "Admin Email"}
        </Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(isRTL && "text-right")}
          placeholder={isRTL ? "أدخل البريد الإلكتروني" : "Enter email"}
          disabled={isUpdating}
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <Label className={cn(isRTL && "font-cairo text-right block")}>
          {isRTL ? "كلمة المرور" : "Password"}
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(isRTL && "text-right", "pr-10")}
            placeholder={isRTL ? "أدخل كلمة المرور" : "Enter password"}
            disabled={isUpdating}
            dir="ltr"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className={cn(isRTL && "font-cairo")}
        >
          {isRTL ? "حفظ" : "Save"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsEditing(false)}
          disabled={isUpdating}
          className={cn(isRTL && "font-cairo")}
        >
          {isRTL ? "إلغاء" : "Cancel"}
        </Button>
      </div>

      <Button 
        variant="outline" 
        size="sm"
        onClick={handlePasswordReset}
        className={cn(isRTL && "font-cairo")}
      >
        <KeyRound className="h-4 w-4 mr-2" />
        {isRTL ? "إعادة تعيين كلمة المرور" : "Reset Password"}
      </Button>
    </div>
  );
}