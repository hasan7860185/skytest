import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    full_name: string | null;
    avatar: string | null;
    email: string | null;
  } | null;
  onProfileUpdate: (profile: any) => void;
}

export function UserProfileDialog({ 
  open, 
  onOpenChange, 
  profile,
  onProfileUpdate 
}: UserProfileDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      setUploading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      onProfileUpdate({ ...profile, avatar: publicUrl });
      toast.success(t("settings.profile.uploadSuccess"));
    } catch (error: any) {
      toast.error(t("settings.notifications.saveError"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={cn(isRTL && "font-cairo text-right")}>
            {t("settings.profile.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar || ""} />
              <AvatarFallback>{profile?.full_name?.slice(0, 2) || "UN"}</AvatarFallback>
            </Avatar>
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Upload className="h-4 w-4" />
                {t("settings.profile.changeAvatar")}
              </div>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </Label>
          </div>
          <div className="space-y-4">
            <div>
              <Label className={cn(isRTL && "font-cairo text-right")}>
                {t("settings.profile.name")}
              </Label>
              <Input 
                value={profile?.full_name || ""} 
                readOnly 
                className={cn(isRTL && "text-right")}
              />
            </div>
            <div>
              <Label className={cn(isRTL && "font-cairo text-right")}>
                {t("settings.profile.email")}
              </Label>
              <Input 
                value={profile?.email || ""} 
                readOnly 
                className={cn(isRTL && "text-right")}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}