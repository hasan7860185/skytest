import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Plus } from "lucide-react";
import { ProjectForm } from "../project-form/ProjectForm";
import { useState } from "react";
import { UnitForm } from "./UnitForm";

interface CompanyHeaderProps {
  name: string;
  description?: string | null;
  isRTL: boolean;
  companyId: string;
}

export function CompanyHeader({ name, description, isRTL, companyId }: CompanyHeaderProps) {
  const { t } = useTranslation();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="space-y-4">
      <div className={cn(
        "flex items-center justify-between",
        isRTL && "flex-row-reverse"
      )}>
        <h1 className={cn(
          "text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100",
          isRTL && "font-cairo"
        )}>
          {name}
        </h1>
        <div className={cn(
          "flex gap-4",
          isRTL && "flex-row-reverse"
        )}>
          <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button className={cn(
                "flex items-center gap-2 bg-primary hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70",
                isRTL ? "flex-row-reverse font-cairo" : ""
              )}>
                <Plus className="h-4 w-4" />
                {isRTL ? "إضافة مشروع" : "Add Project"}
              </Button>
            </DialogTrigger>
            <DialogContent className={cn(
              "max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800/95 border-gray-200 dark:border-gray-700/30",
              isRTL && "font-cairo"
            )}>
              <ProjectForm 
                companyId={companyId}
                onSuccess={() => setIsProjectDialogOpen(false)}
                onCancel={() => setIsProjectDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isUnitDialogOpen} onOpenChange={setIsUnitDialogOpen}>
            <DialogTrigger asChild>
              <Button className={cn(
                "flex items-center gap-2",
                isRTL ? "flex-row-reverse font-cairo" : ""
              )}>
                <Plus className="h-4 w-4" />
                {isRTL ? "الوحدات" : "Units"}
              </Button>
            </DialogTrigger>
            <DialogContent className={cn(
              "max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800/95 border-gray-200 dark:border-gray-700/30",
              isRTL && "font-cairo"
            )}>
              <UnitForm 
                companyName={name}
                onSuccess={() => setIsUnitDialogOpen(false)}
                onCancel={() => setIsUnitDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {description && (
        <div className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDescription(!showDescription)}
            className={cn(
              "self-start",
              isRTL && "self-end"
            )}
          >
            {showDescription ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                {isRTL ? "إخفاء التفاصيل" : "Hide details"}
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                {isRTL ? "إظهار التفاصيل" : "Show details"}
              </>
            )}
          </Button>
          {showDescription && (
            <p className={cn(
              "text-gray-600 dark:text-gray-300",
              isRTL && "font-cairo text-right"
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}