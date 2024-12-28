import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface DeleteCompanyDialogProps {
  isRTL: boolean;
  onConfirm: () => Promise<void>;
}

export function DeleteCompanyDialog({ isRTL, onConfirm }: DeleteCompanyDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {isRTL ? 'تأكيد حذف الشركة' : 'Confirm Company Deletion'}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {isRTL 
            ? 'هل أنت متأكد من حذف هذه الشركة؟ سيتم حذف جميع المشاريع والتحليلات والبيانات المرتبطة بها.'
            : 'Are you sure you want to delete this company? All related projects, analysis, and data will be deleted.'}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          {isRTL ? 'إلغاء' : 'Cancel'}
        </AlertDialogCancel>
        <AlertDialogAction 
          onClick={handleConfirm}
          className="bg-destructive hover:bg-destructive/90"
          disabled={isDeleting}
        >
          {isDeleting ? (isRTL ? 'جاري الحذف...' : 'Deleting...') : (isRTL ? 'حذف' : 'Delete')}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}