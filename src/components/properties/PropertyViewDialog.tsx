import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Property } from "@/components/forms/propertySchema";
import { PropertyShareButtons } from "./share/PropertyShareButtons";
import { useTranslation } from "react-i18next";

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
      <DialogContent className="max-w-3xl bg-background dark:bg-gray-900 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className={cn(
            "text-right font-cairo text-foreground dark:text-gray-100",
            isRTL ? "font-cairo" : ""
          )}>
            مشاركة تفاصيل العقار
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className={cn(
              "font-medium text-right mb-2",
              "text-foreground dark:text-gray-200"
            )}>
              اختر الحقول المراد مشاركتها
            </h4>
            <div className="grid grid-cols-2 gap-2 text-right">
              {shareableFields.map((field) => (
                <div key={field.id} className={cn(
                  "flex items-center space-x-2",
                  "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                  "rounded-md p-1.5 transition-colors"
                )}>
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                    className="dark:border-gray-600"
                  />
                  <label 
                    htmlFor={field.id} 
                    className={cn(
                      "mr-2 text-sm",
                      "text-foreground dark:text-gray-300"
                    )}
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