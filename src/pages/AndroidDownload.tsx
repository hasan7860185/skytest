import { useTranslation } from "react-i18next";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

export default function AndroidDownload() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const isAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email === 'samy1432008815@gmail.com';
  };

  const { data: qrCode, refetch, isLoading, error } = useQuery({
    queryKey: ['android-qr'],
    queryFn: async () => {
      console.log('Fetching QR code data...');
      const { data, error } = await supabase
        .from('android_app_qr')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching QR code:', error);
        throw error;
      }
      
      console.log('QR code data:', data);

      if (data?.qr_code_url) {
        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(data.qr_code_url.replace(/^\//, ''));
        
        return { ...data, qr_code_url: publicUrl };
      }
      
      return data;
    }
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      toast.error(isRTL ? 'غير مصرح لك بتحديث رمز QR' : 'You are not authorized to update the QR code');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(filePath);

      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: updateError } = await supabase
        .from('android_app_qr')
        .upsert({ 
          qr_code_url: filePath,
          updated_by: user?.id,
          id: qrCode?.id
        });

      if (updateError) throw updateError;

      toast.success(isRTL ? 'تم تحديث رمز QR بنجاح' : 'QR code updated successfully');
      refetch();
    } catch (error) {
      console.error('Error uploading QR code:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث رمز QR' : 'Error updating QR code');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  if (error) {
    console.error('Error loading QR code:', error);
    toast.error(isRTL ? 'حدث خطأ أثناء تحميل رمز QR' : 'Error loading QR code');
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <DashboardContent>
        <div className="container mx-auto p-4 pt-20 space-y-6">
          <h1 className={cn(
            "text-2xl font-bold mb-6",
            isRTL && "font-cairo text-right"
          )}>
            {isRTL ? 'تحميل تطبيق الأندرويد' : 'Download Android App'}
          </h1>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center space-y-4">
                <p className={cn(
                  "text-lg",
                  isRTL && "font-cairo"
                )}>
                  {isRTL ? 'امسح رمز الباركود لتنزيل تطبيق الاندرويد' : 'Scan the QR code to download the Android app'}
                </p>
                
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-lg"></div>
                  </div>
                ) : qrCode?.qr_code_url ? (
                  <div className="flex justify-center">
                    <img 
                      src={qrCode.qr_code_url} 
                      alt="Android App QR Code" 
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">
                        {isRTL ? 'لا يوجد رمز QR' : 'No QR code available'}
                      </p>
                    </div>
                  </div>
                )}

                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    {isRTL ? 'تحديث رمز QR' : 'Update QR Code'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardContent>
    </div>
  );
}