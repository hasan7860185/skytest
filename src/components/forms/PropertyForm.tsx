import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { propertyFormSchema, PropertyFormData } from "./propertyFormSchema";
import { cn } from "@/lib/utils";
import { PropertyBasicFields } from "./fields/PropertyBasicFields";
import { PropertyTypeFields } from "./fields/PropertyTypeFields";
import { PropertyDetailsFields } from "./fields/PropertyDetailsFields";
import { PropertyFileUpload } from "./fields/upload/PropertyFileUpload";

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<PropertyFormData>;
}

export function PropertyForm({ onSubmit, onCancel, defaultValues }: PropertyFormProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      type: defaultValues?.type || "",
      location: defaultValues?.location || "",
      area: defaultValues?.area || "",
      price: defaultValues?.price || "",
      description: defaultValues?.description || "",
      owner_phone: defaultValues?.owner_phone || "",
      images: defaultValues?.images || [],
      operating_company: defaultValues?.operating_company || "",
      project_sections: defaultValues?.project_sections || "",
    },
  });

  const handleFileUploadComplete = (urls: { images: string[] }) => {
    if (urls.images.length > 0) {
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, ...urls.images]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className={cn("space-y-6", isRTL && "text-right")}>
          <PropertyBasicFields form={form} />
          <PropertyTypeFields form={form} />
          <PropertyDetailsFields form={form} />
          
          <PropertyFileUpload 
            onUploadComplete={handleFileUploadComplete}
            isRTL={isRTL}
          />
        </div>

        <div className={cn(
          "flex gap-2 mt-6",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
          <Button type="submit" className={cn("flex-1", isRTL && "font-cairo")}>
            {isRTL ? "حفظ العقار" : "Save Property"}
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