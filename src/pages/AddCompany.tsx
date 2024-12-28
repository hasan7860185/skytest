import { useTranslation } from "react-i18next";
import { CompanyForm } from "@/components/forms/CompanyForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AddCompany() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const handleSubmit = async (data: { name: string; description?: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error, data: company } = await supabase
        .from('companies')
        .insert([{
          name: data.name,
          description: data.description,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success(isRTL ? 'تم إضافة الشركة بنجاح' : 'Company added successfully');
      navigate(`/companies/${company.id}`);
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء إضافة الشركة' : 'Error adding company');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className={cn(
        "text-2xl font-bold mb-6",
        isRTL && "text-right font-cairo"
      )}>
        {t("companies.addCompany")}
      </h1>
      <CompanyForm 
        onSubmit={handleSubmit}
        onCancel={() => navigate('/companies')}
      />
    </div>
  );
}