import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@/components/forms/propertySchema";
import { PropertyShareDialog } from "./PropertyViewDialog";
import { PropertyEditSheet } from "./PropertyEditSheet";
import { usePropertyMutations } from "@/hooks/usePropertyMutations";
import { toast } from "sonner";
import { useState } from "react";
import { PropertyViewFields } from "../forms/fields/PropertyViewFields";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type PropertyCardProps = {
  property: Property;
  onEdit: (data: Property) => void;
  onDelete: (property: Property) => void;
};

export function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { deleteProperty } = usePropertyMutations();
  const [showPreview, setShowPreview] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProperty.mutateAsync(property.id);
      toast.success(isRTL ? 'تم حذف العقار بنجاح' : 'Property deleted successfully');
      onDelete(property);
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء حذف العقار' : 'Error deleting property');
    }
  };

  return (
    <>
      <Card className={cn(
        "group h-full transition-all duration-300",
        "bg-white dark:bg-gray-800/50 dark:border-gray-700/30",
        "hover:shadow-md hover:scale-[1.01]",
        "rounded-lg shadow-sm",
        "border border-gray-200/20",
        "backdrop-blur-sm",
        "max-w-[300px]", // Updated from 240px to 300px
        isRTL ? "text-right" : "text-left"
      )}>
        <CardHeader className="space-y-1 p-2">
          <CardTitle className={cn(
            "text-[10px]",
            "font-semibold line-clamp-1",
            "text-gray-900 dark:text-gray-100",
            isRTL ? "font-cairo" : ""
          )}>
            {property.title}
          </CardTitle>
          {property.description && (
            <p className={cn(
              "text-[8px]",
              "text-gray-500 dark:text-gray-400 line-clamp-1",
              isRTL ? "font-cairo" : ""
            )}>
              {property.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-1 p-2 pt-0">
          {property.location && (
            <p className={cn(
              "text-[8px]",
              "text-gray-600 dark:text-gray-300",
              isRTL ? "font-cairo" : ""
            )}>
              📍 {property.location}
            </p>
          )}
          {property.price && (
            <p className={cn(
              "text-[8px]",
              "font-semibold text-primary",
              isRTL ? "font-cairo" : ""
            )}>
              💰 {property.price}
            </p>
          )}
        </CardContent>
        <CardFooter className={cn(
          "flex gap-1 justify-center p-1",
          "bg-gray-50/50 dark:bg-gray-900/50 rounded-b-lg"
        )}>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowPreview(true)}
            className="h-5 w-5 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <PropertyShareDialog property={property} />
          <PropertyEditSheet property={property} onSubmit={onEdit} />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleDelete}
            className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 dark:bg-gray-900 dark:border-gray-800">
          <PropertyViewFields property={property} isRTL={isRTL} />
        </DialogContent>
      </Dialog>
    </>
  );
}