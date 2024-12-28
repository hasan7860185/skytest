import { Button } from "@/components/ui/button";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/forms/CompanyForm";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteCompany } from "./actions/deleteCompany";
import { DeleteCompanyDialog } from "./actions/DeleteCompanyDialog";

interface CompanyCardActionsProps {
  companyId: string;
  companyName: string;
  companyDescription?: string | null;
  isRTL: boolean;
}

export function CompanyCardActions({ companyId, companyName, companyDescription, isRTL }: CompanyCardActionsProps) {
  const { t } = useTranslation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      console.log('Starting company deletion process for company:', companyId);
      
      toast.loading(isRTL ? 'جاري حذف الشركة...' : 'Deleting company...');
      
      await deleteCompany(companyId);
      await queryClient.invalidateQueries({ queryKey: ['companies'] });
      
      toast.dismiss();
      toast.success(isRTL ? 'تم حذف الشركة بنجاح' : 'Company deleted successfully');
    } catch (error) {
      console.error('Error in delete operation:', error);
      toast.dismiss();
      toast.error(isRTL ? 'حدث خطأ أثناء حذف الشركة' : 'Error deleting company');
    }
  };

  const handleEdit = async (data: { name: string; description?: string }) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: data.name,
          description: data.description
        })
        .eq('id', companyId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsEditDialogOpen(false);
      toast.success(isRTL ? 'تم تحديث بيانات الشركة بنجاح' : 'Company updated successfully');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث بيانات الشركة' : 'Error updating company');
    }
  };

  return (
    <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => navigate(`/companies/${companyId}`)}
        title={isRTL ? "معاينة الشركة" : "Preview Company"}
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CompanyForm
            onSubmit={handleEdit}
            onCancel={() => setIsEditDialogOpen(false)}
            defaultValues={{
              name: companyName,
              description: companyDescription || ''
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <DeleteCompanyDialog isRTL={isRTL} onConfirm={handleDelete} />
      </AlertDialog>
    </div>
  );
}