import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UnitFormProps {
  companyName: string;
  onSuccess: () => void;
  onCancel: () => void;
  defaultValues?: {
    project_name: string;
    details: string;
  };
}

export function UnitForm({ companyName, onSuccess, onCancel, defaultValues }: UnitFormProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [projectName, setProjectName] = useState(defaultValues?.project_name || "");
  const [details, setDetails] = useState(defaultValues?.details || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultValues) {
      setProjectName(defaultValues.project_name);
      setDetails(defaultValues.details);
    }
  }, [defaultValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error(isRTL ? "يرجى إدخال اسم المشروع" : "Please enter a project name");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('project_units')
        .insert([{
          company_name: companyName,
          project_name: projectName,
          details: details.trim() || null
        }]);

      if (error) throw error;

      toast.success(isRTL ? "تمت إضافة الوحدة بنجاح" : "Unit added successfully");
      onSuccess();
    } catch (error) {
      console.error('Error adding unit:', error);
      toast.error(isRTL ? "حدث خطأ أثناء إضافة الوحدة" : "Error adding unit");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className={cn(
          "text-lg font-semibold",
          isRTL && "text-right font-cairo"
        )}>
          {isRTL ? "إضافة وحدة جديدة" : "Add New Unit"}
        </h2>

        <div className="space-y-2">
          <label className={cn(
            "block text-sm font-medium",
            isRTL && "text-right font-cairo"
          )}>
            {isRTL ? "اسم المشروع" : "Project Name"}
          </label>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={cn(isRTL && "text-right font-cairo")}
            placeholder={isRTL ? "ادخل اسم المشروع" : "Enter project name"}
          />
        </div>

        <div className="space-y-2">
          <label className={cn(
            "block text-sm font-medium",
            isRTL && "text-right font-cairo"
          )}>
            {isRTL ? "تفاصيل الوحدة" : "Unit Details"}
          </label>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className={cn(isRTL && "text-right font-cairo")}
            placeholder={isRTL ? "ادخل تفاصيل الوحدة" : "Enter unit details"}
            rows={4}
          />
        </div>
      </div>

      <div className={cn(
        "flex justify-end gap-4",
        isRTL && "flex-row-reverse"
      )}>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {isRTL ? "إلغاء" : "Cancel"}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isRTL ? "إضافة" : "Add"}
        </Button>
      </div>
    </form>
  );
}