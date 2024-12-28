import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function NotificationSoundUpload() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isUploading, setIsUploading] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    });

    // Check if file is MP3
    if (!file.type.includes('audio/mpeg')) {
      console.error('Invalid file type:', file.type);
      toast.error(isRTL ? 'يجب أن يكون الملف بصيغة MP3' : 'File must be MP3 format');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      console.error('File too large:', file.size);
      toast.error(isRTL ? 'حجم الملف يجب أن يكون أقل من 2 ميجابايت' : 'File size must be less than 2MB');
      return;
    }

    try {
      setIsUploading(true);
      console.log('Starting file upload process...');

      // Get authenticated user
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Authentication error');
      }
      if (!session?.user) {
        console.error('No authenticated user found');
        throw new Error('No user found');
      }

      // Upload to Supabase Storage
      const fileName = `notification-sound-${Date.now()}.mp3`;
      console.log('Attempting to upload file:', fileName);

      const { error: uploadError, data } = await supabase.storage
        .from('notifications')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      if (!data) {
        console.error('No data received from upload');
        throw new Error('No upload data received');
      }

      console.log('File uploaded successfully:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('notifications')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);
      setCurrentSound(publicUrl);

      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          notification_settings: {
            sound_url: publicUrl,
            enabled: true,
            sound: true
          }
        })
        .eq('id', session.user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      console.log('Profile updated successfully');
      toast.success(isRTL ? 'تم تحميل الملف الصوتي بنجاح' : 'Sound file uploaded successfully');
    } catch (error: any) {
      console.error('Error in upload process:', error);
      toast.error(isRTL ? `حدث خطأ أثناء تحميل الملف: ${error.message}` : `Error uploading file: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const playCurrentSound = () => {
    if (currentSound) {
      console.log('Attempting to play sound:', currentSound);
      const audio = new Audio(currentSound);
      audio.play().catch(error => {
        console.error('Error playing sound:', error);
        toast.error(isRTL ? 'حدث خطأ أثناء تشغيل الصوت' : 'Error playing sound');
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isRTL ? "font-cairo" : ""}>
          {isRTL ? "صوت الإشعارات" : "Notification Sound"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className={isRTL ? "font-cairo" : ""}>
            {isRTL ? "تحميل ملف صوتي (MP3)" : "Upload Sound File (MP3)"}
          </Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className={`relative ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isUploading}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="audio/mpeg"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <Upload className="w-4 h-4 mr-2" />
              {isRTL ? "اختيار ملف" : "Choose File"}
            </Button>
            {currentSound && (
              <Button
                variant="outline"
                size="icon"
                onClick={playCurrentSound}
                title={isRTL ? "تشغيل الصوت" : "Play Sound"}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {isRTL 
            ? "يجب أن يكون الملف بصيغة MP3 وحجم أقل من 2 ميجابايت" 
            : "File must be MP3 format and less than 2MB"}
        </p>
      </CardContent>
    </Card>
  );
}