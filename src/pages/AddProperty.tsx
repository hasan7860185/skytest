import { useTranslation } from "react-i18next";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Property } from "@/types/property";
import { DashboardContent } from "@/components/layouts/DashboardContent";

const AddProperty = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const handleSubmit = async (data: Property) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error(t("auth.errors.notAuthenticated"));
        navigate("/login");
        return;
      }

      let uploadedImageUrls: string[] = [];
      if (data.images && data.images.length > 0) {
        for (const imageUrl of data.images) {
          if (typeof imageUrl === 'string' && imageUrl.startsWith('blob:')) {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
            
            const fileName = `${Math.random()}.jpg`;
            const { error: uploadError, data: uploadData } = await supabase.storage
              .from('projects')
              .upload(fileName, file);

            if (uploadError) {
              console.error('Error uploading image:', uploadError);
              continue;
            }

            if (uploadData) {
              const { data: { publicUrl } } = supabase.storage
                .from('projects')
                .getPublicUrl(uploadData.path);
              uploadedImageUrls.push(publicUrl);
            }
          } else {
            uploadedImageUrls.push(imageUrl);
          }
        }
      }

      const { error } = await supabase.from('properties').insert({
        title: data.title,
        description: data.description,
        type: data.type,
        area: data.area,
        location: data.location,
        price: data.price,
        owner_phone: data.owner_phone,
        operating_company: data.operating_company,
        project_sections: data.project_sections,
        images: uploadedImageUrls,
        user_id: session.user.id
      });

      if (error) throw error;

      toast.success(isRTL ? 'تم إضافة العقار بنجاح' : 'Property added successfully');
      navigate("/properties");
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء إضافة العقار' : 'Error adding property');
    }
  };

  return (
    <DashboardContent>
      <div className="p-6 pt-20">
        <div className={cn(
          "max-w-6xl mx-auto",
          isRTL ? "font-cairo" : ""
        )}>
          <h1 className="text-2xl font-semibold mb-6">
            {t("properties.addProperty")}
          </h1>
          
          <PropertyForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/properties")}
          />
        </div>
      </div>
    </DashboardContent>
  );
};

export default AddProperty;