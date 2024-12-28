import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isRTL: boolean;
}

export function DeleteProjectDialog({ isOpen, onOpenChange, onConfirm, isRTL }: DeleteProjectDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(
        "dark:bg-gray-800 dark:text-gray-100",
        isRTL && "font-cairo"
      )}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isRTL ? "تأكيد الحذف" : "Confirm Deletion"}
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-gray-400">
            {isRTL
              ? "هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء."
              : "Are you sure you want to delete this project? This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={cn(
          "gap-2",
          isRTL && "flex-row-reverse"
        )}>
          <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">
            {isRTL ? "إلغاء" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-red-900/50 dark:hover:bg-red-900/75"
          >
            {isRTL ? "حذف" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}