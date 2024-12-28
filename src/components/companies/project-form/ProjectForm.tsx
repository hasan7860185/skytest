import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectAttachmentsSection } from "./ProjectAttachmentsSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectFormFields } from "./ProjectFormFields";
import { ProjectFormProps, ProjectFormData } from "./types";

const projectSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يكون اسم المشروع أكثر من حرفين" }),
  engineering_consultant: z.string().min(2, { message: "يجب إدخال الاستشاري الهندسي" }),
  operating_company: z.string().min(2, { message: "يجب إدخال شركة الإدارة والتشغيل" }),
  project_sections: z.string().optional(),
  location: z.string().optional(),
  price_per_meter: z.string().optional(),
  available_units: z.string().optional(),
  unit_price: z.string().optional(),
  min_area: z.string().optional(),
  rental_system: z.string().optional(),
  description: z.string().optional(),
});

export function ProjectForm({ companyId, project, onSuccess, onCancel }: ProjectFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [images, setImages] = useState<string[]>(project?.images || []);
  const queryClient = useQueryClient();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      engineering_consultant: project?.engineering_consultant || "",
      operating_company: project?.operating_company || "",
      project_sections: project?.project_sections || "",
      location: project?.location || "",
      price_per_meter: project?.price_per_meter?.toString() || "",
      available_units: project?.available_units?.toString() || "",
      unit_price: project?.unit_price?.toString() || "",
      min_area: project?.min_area?.toString() || "",
      rental_system: project?.rental_system || "",
      description: project?.description || "",
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData = {
        name: data.name,
        engineering_consultant: data.engineering_consultant,
        operating_company: data.operating_company,
        project_sections: data.project_sections,
        location: data.location,
        company_id: companyId,
        images,
        price_per_meter: data.price_per_meter ? parseFloat(data.price_per_meter) : null,
        available_units: data.available_units ? parseInt(data.available_units) : null,
        unit_price: data.unit_price ? parseFloat(data.unit_price) : null,
        min_area: data.min_area ? parseFloat(data.min_area) : null,
        rental_system: data.rental_system,
        description: data.description,
      };

      if (project?.id) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);

        if (error) throw error;
        toast.success(isRTL ? 'تم تحديث المشروع بنجاح' : 'Project updated successfully');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert(projectData);

        if (error) throw error;
        toast.success(isRTL ? 'تم إضافة المشروع بنجاح' : 'Project added successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['projects', companyId] });
      onSuccess?.();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء حفظ المشروع' : 'Error saving project');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProjectFormFields form={form} isRTL={isRTL} />

        <ProjectAttachmentsSection
          onUploadComplete={({ images }) => setImages(images)}
          isRTL={isRTL}
        />

        <div className={cn(
          "flex gap-4",
          isRTL ? "flex-row-reverse" : ""
        )}>
          <Button 
            type="submit" 
            className={cn(isRTL && "font-cairo")}
            disabled={form.formState.isSubmitting}
          >
            {isRTL ? "حفظ" : "Save"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className={cn(isRTL && "font-cairo")}
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
        </div>
      </form>
    </Form>
  );
}