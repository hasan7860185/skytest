import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddRegionDialog } from "@/components/regions/AddRegionDialog";
import { RegionsContent } from "@/components/regions/RegionsContent";
import { RegionViewDialog } from "@/components/regions/RegionViewDialog";
import { RegionEditDialog } from "@/components/regions/RegionEditDialog";
import { Region } from "@/types/region";
import { DashboardContent } from "@/components/layouts/DashboardContent";

export default function Regions() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: regions, isLoading, refetch } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (regionId: string) => {
    try {
      const { error } = await supabase
        .from('regions')
        .delete()
        .eq('id', regionId);

      if (error) throw error;

      toast.success(isRTL ? 'تم حذف المنطقة بنجاح' : 'Region deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting region:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء حذف المنطقة' : 'Error deleting region');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegion) return;

    try {
      const { error } = await supabase
        .from('regions')
        .update({
          name: selectedRegion.name,
          description: selectedRegion.description
        })
        .eq('id', selectedRegion.id);

      if (error) throw error;

      toast.success(isRTL ? 'تم تحديث المنطقة بنجاح' : 'Region updated successfully');
      setShowEditDialog(false);
      refetch();
    } catch (error) {
      console.error('Error updating region:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث المنطقة' : 'Error updating region');
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <DashboardContent>
        <RegionsContent
          regions={regions}
          isLoading={isLoading}
          onAdd={() => setShowAddDialog(true)}
          onEdit={setSelectedRegion}
          onDelete={handleDelete}
          onView={(region) => {
            setSelectedRegion(region);
            setShowViewDialog(true);
          }}
        />

        <AddRegionDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog} 
        />

        <RegionViewDialog
          region={selectedRegion}
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
        />

        <RegionEditDialog
          region={selectedRegion}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSubmit={handleEdit}
          onChange={setSelectedRegion}
        />
      </DashboardContent>
    </div>
  );
}