import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUnitOperations = (companyName: string) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const deleteUnit = async (unitId: string, isRTL: boolean) => {
    try {
      setIsDeleting(true);
      console.log('Deleting unit with ID:', unitId);

      const { error } = await supabase
        .from('project_units')
        .delete()
        .eq('id', unitId);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      // Invalidate and refetch units
      await queryClient.invalidateQueries({ queryKey: ['units', companyName] });
      
      toast.success(isRTL ? 'تم حذف الوحدة بنجاح' : 'Unit deleted successfully');
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء حذف الوحدة' : 'Error deleting unit');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteUnit,
    isDeleting
  };
};