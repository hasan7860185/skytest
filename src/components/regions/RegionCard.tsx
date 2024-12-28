import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface RegionCardProps {
  region: {
    id: string;
    name: string;
    description?: string;
  };
  isRTL: boolean;
  onEdit: (region: any) => void;
  onDelete: (id: string) => void;
  onView: (region: any) => void;
}

export function RegionCard({ region, isRTL, onEdit, onDelete, onView }: RegionCardProps) {
  const [showDescription, setShowDescription] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Card key={region.id} className={cn(
      "relative hover:shadow-md transition-shadow",
      isMobile ? "p-6 min-h-[180px] w-full" : "p-6 min-h-[160px]"
    )}>
      <div className="flex flex-col items-center h-full">
        <div className={cn(
          "flex gap-2",
          isMobile ? "mb-6" : "mb-4"
        )}>
          {region.description && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                isMobile && "h-9 w-9"
              )}
              onClick={() => setShowDescription(!showDescription)}
              title={showDescription ? (isRTL ? "إخفاء الوصف" : "Hide description") : (isRTL ? "إظهار الوصف" : "Show description")}
            >
              {showDescription ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              isMobile && "h-9 w-9"
            )}
            onClick={() => onView(region)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              isMobile && "h-9 w-9"
            )}
            onClick={() => onEdit(region)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              isMobile && "h-9 w-9"
            )}
            onClick={() => onDelete(region.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

        <h3 className={cn(
          "text-xl font-semibold text-center",
          isMobile && "text-2xl mb-2",
          isRTL && "font-cairo"
        )}>
          {region.name}
        </h3>
        
        {region.description && showDescription && (
          <p className={cn(
            "text-base text-gray-600 mt-4 text-center",
            isMobile && "text-lg mt-3",
            isRTL && "font-cairo"
          )}>
            {region.description}
          </p>
        )}
      </div>
    </Card>
  );
}