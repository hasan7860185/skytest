import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useState } from "react";
import { ProjectShareButtons } from "../../project-form/share/ProjectShareButtons";
import { ShareFields } from "@/components/projects/share/ShareFields";
import { useIsMobile } from "@/hooks/use-mobile";

interface ViewProjectDialogProps {
  project: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isRTL: boolean;
}

export function ViewProjectDialog({ project, isOpen, onOpenChange, isRTL }: ViewProjectDialogProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'name',
    'description',
    'engineering_consultant',
    'operating_company',
    'location',
    'price_per_meter',
    'available_units',
    'delivery_date',
    'images'
  ]);
  const isMobile = useIsMobile();

  if (!project) return null;

  const fields = [
    { id: 'name', label: isRTL ? 'اسم المشروع' : 'Project Name' },
    { id: 'description', label: isRTL ? 'الوصف' : 'Description' },
    { id: 'engineering_consultant', label: isRTL ? 'الاستشاري الهندسي' : 'Engineering Consultant' },
    { id: 'operating_company', label: isRTL ? 'شركة الإدارة' : 'Operating Company' },
    { id: 'location', label: isRTL ? 'الموقع' : 'Location' },
    { id: 'price_per_meter', label: isRTL ? 'السعر/متر' : 'Price/m²' },
    { id: 'available_units', label: isRTL ? 'الوحدات المتاحة' : 'Available Units' },
    { id: 'delivery_date', label: isRTL ? 'تاريخ التسليم' : 'Delivery Date' },
    { id: 'images', label: isRTL ? 'الصور' : 'Images' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-2xl max-h-[90vh] overflow-y-auto",
        "dark:bg-gray-800 dark:text-gray-100",
        isMobile && "w-[95%] p-4",
        isRTL && "font-cairo"
      )}>
        <DialogTitle className={cn(
          "text-xl font-semibold",
          isRTL && "text-right"
        )}>
          {project.name}
        </DialogTitle>
        
        <div className="space-y-4">
          {project.description && (
            <p className={cn(
              "text-muted-foreground dark:text-gray-400",
              isRTL && "text-right"
            )}>
              {project.description}
            </p>
          )}
          
          <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-1" : "grid-cols-2"
          )}>
            {project.engineering_consultant && (
              <div className={cn(isRTL && "text-right")}>
                <span className="text-muted-foreground dark:text-gray-400">
                  {isRTL ? "الاستشاري الهندسي:" : "Engineering Consultant:"}
                </span>
                <p className="dark:text-gray-200">{project.engineering_consultant}</p>
              </div>
            )}
            
            {project.operating_company && (
              <div className={cn(isRTL && "text-right")}>
                <span className="text-muted-foreground dark:text-gray-400">
                  {isRTL ? "شركة الإدارة:" : "Operating Company:"}
                </span>
                <p className="dark:text-gray-200">{project.operating_company}</p>
              </div>
            )}
            
            {project.location && (
              <div className={cn(isRTL && "text-right")}>
                <span className="text-muted-foreground dark:text-gray-400">
                  {isRTL ? "الموقع:" : "Location:"}
                </span>
                <p className="dark:text-gray-200">{project.location}</p>
              </div>
            )}
            
            {project.price_per_meter && (
              <div className={cn(isRTL && "text-right")}>
                <span className="text-muted-foreground dark:text-gray-400">
                  {isRTL ? "السعر/متر:" : "Price/m²:"}
                </span>
                <p className="dark:text-gray-200">{project.price_per_meter}</p>
              </div>
            )}
            
            {project.available_units && (
              <div className={cn(isRTL && "text-right")}>
                <span className="text-muted-foreground dark:text-gray-400">
                  {isRTL ? "الوحدات المتاحة:" : "Available Units:"}
                </span>
                <p className="dark:text-gray-200">{project.available_units}</p>
              </div>
            )}
            
            {project.delivery_date && (
              <div className={cn(isRTL && "text-right")}>
                <span className="text-muted-foreground dark:text-gray-400">
                  {isRTL ? "تاريخ التسليم:" : "Delivery Date:"}
                </span>
                <p className="dark:text-gray-200">
                  {format(new Date(project.delivery_date), 'PPP', {
                    locale: isRTL ? ar : undefined
                  })}
                </p>
              </div>
            )}
          </div>

          {project.images && project.images.length > 0 && (
            <div className="space-y-2">
              <h3 className={cn(
                "font-semibold",
                isRTL && "text-right"
              )}>
                {isRTL ? "صور المشروع" : "Project Images"}
              </h3>
              <div className={cn(
                "grid gap-4",
                isMobile ? "grid-cols-1" : "grid-cols-2"
              )}>
                {project.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${project.name} - ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t">
            <h4 className={cn(
              "font-medium",
              isRTL && "text-right"
            )}>
              {isRTL ? "اختر الحقول المراد تحميلها" : "Select fields to export"}
            </h4>
            
            <ShareFields
              fields={fields}
              selectedFields={selectedFields}
              setSelectedFields={setSelectedFields}
            />

            <ProjectShareButtons
              project={project}
              selectedFields={selectedFields}
              isRTL={isRTL}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}