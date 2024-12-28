import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareFields } from "@/components/projects/share/ShareFields";
import { ProjectShareButtons } from "./ProjectShareButtons";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectShareDialogProps {
  project: any;
}

export function ProjectShareDialog({ project }: ProjectShareDialogProps) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="dark:bg-gray-700/30 dark:border-gray-600 dark:hover:bg-gray-700/50 dark:text-white"
        >
          <Share className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "max-w-2xl",
        isMobile ? "w-[95vw] p-4 h-[90vh] overflow-y-auto" : "w-full p-6",
        "dark:bg-gray-800 dark:text-gray-100"
      )}>
        <DialogTitle className="text-xl font-semibold mb-4">
          مشاركة المشروع
        </DialogTitle>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">
              اختر الحقول المراد مشاركتها
            </h4>
            
            <ShareFields
              fields={[
                { id: 'name', label: 'اسم المشروع' },
                { id: 'description', label: 'الوصف' },
                { id: 'engineering_consultant', label: 'الاستشاري الهندسي' },
                { id: 'operating_company', label: 'شركة الإدارة' },
                { id: 'location', label: 'الموقع' },
                { id: 'price_per_meter', label: 'السعر/متر' },
                { id: 'available_units', label: 'الوحدات المتاحة' },
                { id: 'delivery_date', label: 'تاريخ التسليم' },
                { id: 'images', label: 'الصور' }
              ]}
              selectedFields={selectedFields}
              setSelectedFields={setSelectedFields}
            />
          </div>

          <ProjectShareButtons
            project={project}
            selectedFields={selectedFields}
            isRTL={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}