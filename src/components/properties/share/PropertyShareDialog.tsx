import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Property } from "@/components/forms/propertySchema";
import { PropertyShareButtons } from "./PropertyShareButtons";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyShareDialogProps {
  property: Property;
}

const shareableFields = [
  { id: "title", label: { ar: "العنوان", en: "Title" } },
  { id: "description", label: { ar: "الوصف", en: "Description" } },
  { id: "location", label: { ar: "الموقع", en: "Location" } },
  { id: "price", label: { ar: "السعر", en: "Price" } },
  { id: "area", label: { ar: "المساحة", en: "Area" } },
  { id: "owner_phone", label: { ar: "رقم هاتف المالك", en: "Owner Phone" } },
  { id: "operatingCompany", label: { ar: "شركة الإدارة والتشغيل", en: "Operating Company" } },
  { id: "images", label: { ar: "الصور", en: "Images" } },
];

export function PropertyShareDialog({ property }: PropertyShareDialogProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isMobile = useIsMobile();
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "title", "description", "location", "price", "area", "owner_phone", "images"
  ]);

  const toggleField = (field: string) => {
    setSelectedFields(current =>
      current.includes(field)
        ? current.filter(f => f !== field)
        : [...current, field]
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "bg-background dark:bg-gray-900 dark:border-gray-800",
        isMobile ? (
          "w-[95vw] h-[90vh] overflow-y-auto p-4 rounded-lg"
        ) : (
          "max-w-2xl p-6" // Changed from max-w-md to max-w-2xl for wider desktop dialog
        )
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            "text-xl font-semibold mb-4",
            "text-foreground dark:text-gray-100",
            isRTL ? "text-right font-cairo" : ""
          )}>
            {isRTL ? "مشاركة تفاصيل العقار" : "Share Property Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className={cn(
              "font-medium",
              "text-foreground dark:text-gray-200",
              isRTL ? "text-right" : ""
            )}>
              {isRTL ? "اختر الحقول المراد مشاركتها" : "Select fields to share"}
            </h4>
            
            <div className={cn(
              "grid gap-3",
              isMobile ? "grid-cols-1" : "grid-cols-2"
            )}>
              {shareableFields.map((field) => (
                <div key={field.id} className={cn(
                  "flex items-center space-x-2",
                  "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                  "rounded-md p-3 transition-colors",
                  isRTL && "flex-row-reverse space-x-reverse"
                )}>
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                    className={cn(
                      "dark:border-gray-600",
                      isRTL ? "ml-3" : "mr-3"
                    )}
                  />
                  <label 
                    htmlFor={field.id} 
                    className="text-sm text-foreground dark:text-gray-300"
                  >
                    {isRTL ? field.label.ar : field.label.en}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <PropertyShareButtons 
            property={property}
            selectedFields={selectedFields}
            isRTL={isRTL}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}