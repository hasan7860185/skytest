import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Property } from "@/components/forms/propertySchema";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { PropertyFormData } from "@/components/forms/propertyFormSchema";
import { cn } from "@/lib/utils";

export interface PropertyEditSheetProps {
  property: Property;
  onSubmit: (data: Property) => void;
}

export function PropertyEditSheet({ property, onSubmit }: PropertyEditSheetProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleSubmit = (data: PropertyFormData) => {
    onSubmit({
      ...property,
      ...data,
    });
  };

  const defaultValues: Partial<PropertyFormData> = {
    title: property.title,
    description: property.description || "",
    type: property.type || "",
    area: property.area || "",
    location: property.location || "",
    price: property.price || "",
    owner_phone: property.owner_phone || "",
    operating_company: property.operating_company || "",
    project_sections: property.project_sections || "",
    images: property.images || [],
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side={isRTL ? "right" : "left"} 
        className={cn(
          "w-full sm:max-w-2xl overflow-y-auto",
          "bg-background dark:bg-gray-900",
          "border-gray-200 dark:border-gray-800"
        )}
      >
        <SheetHeader>
          <SheetTitle className={cn(
            isRTL ? "text-right font-cairo" : "",
            "text-foreground dark:text-gray-100"
          )}>
            {isRTL ? "تعديل العقار" : "Edit Property"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <PropertyForm
            onSubmit={handleSubmit}
            onCancel={() => {
              const sheet = document.querySelector('[data-state="open"]');
              if (sheet) {
                const closeButton = sheet.querySelector('button[aria-label="Close"]');
                if (closeButton) {
                  (closeButton as HTMLButtonElement).click();
                }
              }
            }}
            defaultValues={defaultValues}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}