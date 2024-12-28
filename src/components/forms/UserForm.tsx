import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserAvatarUpload } from "./UserAvatarUpload";
import { UserCredentialsForm } from "./UserCredentialsForm";
import { UserRoleStatus } from "./UserRoleStatus";
import { UserAlertInfo } from "./user/UserAlertInfo";
import { UserAdminAlert } from "./user/UserAdminAlert";
import { UserFormContainer } from "./user/UserFormContainer";
import { UserFormActions } from "./user/UserFormActions";
import { UserFormFields } from "./UserFormFields";

interface UserFormProps {
  user?: {
    id: string;
    full_name: string | null;
    role: string | null;
    status: string | null;
    avatar: string | null;
    email?: string | null;
  };
  onUpdate?: () => void;
  onCancel?: () => void;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function UserForm({ user, onUpdate, onCancel, onSuccess, onClose }: UserFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [role, setRole] = useState(user?.role || "employee");
  const [status, setStatus] = useState(user?.status || "active");
  const [avatar, setAvatar] = useState(user?.avatar);
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch current user's role
  const { data: currentUserRole } = useQuery({
    queryKey: ["currentUserRole"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      return profile?.role;
    }
  });

  const isAdmin = currentUserRole === 'admin';

  const handleUpdateUser = async () => {
    try {
      setIsUpdating(true);
      
      const updateData: any = {
        full_name: fullName,
        status,
        updated_at: new Date().toISOString(),
      };

      if (isAdmin) {
        updateData.role = role;
      }

      if (user?.id) {
        // Update existing user
        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", user.id);

        if (profileUpdateError) throw profileUpdateError;

        toast.success(isRTL ? "تم تحديث بيانات المستخدم بنجاح" : "User updated successfully");
        onUpdate?.();
        onClose?.();
      } else {
        // Create new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              ...updateData,
              id: authData.user.id,
            })
            .eq("id", authData.user.id);

          if (profileError) throw profileError;

          toast.success(isRTL ? "تم إنشاء المستخدم بنجاح" : "User created successfully");
          onSuccess?.();
          onClose?.();
        }
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث بيانات المستخدم" : "Error updating user");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <UserFormContainer>
      <UserAlertInfo role={role} isRTL={isRTL} />

      <UserAvatarUpload 
        user={{ ...user, avatar }} 
        onAvatarUpdate={setAvatar} 
      />

      <UserFormFields
        fullName={fullName}
        email={email}
        password={password}
        isUpdating={isUpdating}
        onFullNameChange={setFullName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
      />
      
      <UserRoleStatus
        role={role}
        status={status}
        onRoleChange={setRole}
        onStatusChange={setStatus}
        disabled={isUpdating || !isAdmin}
      />

      {!isAdmin && <UserAdminAlert isRTL={isRTL} />}

      <UserFormActions
        isRTL={isRTL}
        isUpdating={isUpdating}
        onCancel={onCancel || onClose}
        onSave={handleUpdateUser}
      />
    </UserFormContainer>
  );
}