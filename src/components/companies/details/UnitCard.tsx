import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { UnitForm } from "./UnitForm";
import { useUnitOperations } from "@/hooks/useUnitOperations";
import { useIsMobile } from "@/hooks/use-mobile";

interface UnitCardProps {
  unit: any;
  companyName: string;
  isRTL: boolean;
  onEdit: (unit: any) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
}

export function UnitCard({
  unit,
  companyName,
  isRTL,
  onEdit,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isViewDialogOpen,
  setIsViewDialogOpen
}: UnitCardProps) {
  const { deleteUnit, isDeleting } = useUnitOperations(companyName);
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "p-6 rounded-lg border relative",
        "bg-white dark:bg-gray-800/50",
        "dark:border-gray-700/50 dark:text-gray-100",
        "shadow-sm hover:shadow-md transition-shadow duration-200",
        isRTL && "font-cairo"
      )}
    >
      <div className={cn("space-y-4", isRTL && "text-right")}>
        <div className={cn(
          "flex gap-2",
          isRTL ? "justify-start flex-row-reverse" : "justify-end"
        )}>
          <Dialog 
            open={isViewDialogOpen} 
            onOpenChange={(open) => setIsViewDialogOpen(open)}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title={isRTL ? "عرض التفاصيل" : "View Details"}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className={cn(
              "max-w-2xl overflow-y-auto",
              isMobile && "w-[95%] p-4 max-h-[90vh]",
              isRTL && "font-cairo"
            )}>
              <div className="space-y-4">
                <h3 className={cn(
                  "text-lg font-semibold",
                  isRTL && "text-right font-cairo"
                )}>
                  {isRTL ? "تفاصيل الوحدة" : "Unit Details"}
                </h3>
                <div className={cn(
                  "space-y-2",
                  isRTL && "text-right"
                )}>
                  <p><strong>{isRTL ? "اسم المشروع: " : "Project Name: "}</strong>{unit.project_name}</p>
                  {unit.details && (
                    <p><strong>{isRTL ? "التفاصيل: " : "Details: "}</strong>{unit.details}</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog 
            open={isEditDialogOpen} 
            onOpenChange={(open) => setIsEditDialogOpen(open)}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(unit)}
                title={isRTL ? "تعديل" : "Edit"}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className={cn(
              isMobile && "w-[95%] p-4"
            )}>
              <UnitForm
                companyName={companyName}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                }}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                }}
                defaultValues={{
                  project_name: unit.project_name,
                  details: unit.details || ''
                }}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isDeleting}
                title={isRTL ? "حذف" : "Delete"}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className={cn(
              isMobile && "w-[95%] p-4"
            )}>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isRTL ? "تأكيد الحذف" : "Confirm Deletion"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isRTL
                    ? "هل أنت متأكد من حذف هذه الوحدة؟ لا يمكن التراجع عن هذا الإجراء."
                    : "Are you sure you want to delete this unit? This action cannot be undone."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className={cn(isRTL && "flex-row-reverse")}>
                <AlertDialogCancel>
                  {isRTL ? "إلغاء" : "Cancel"}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteUnit(unit.id, isRTL)}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isRTL ? "حذف" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <h3 className="text-lg font-semibold dark:text-gray-100">
          {unit.project_name}
        </h3>
        
        {unit.details && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {unit.details}
          </p>
        )}
      </div>
    </div>
  );
}