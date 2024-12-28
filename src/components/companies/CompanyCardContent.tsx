import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyCardContentProps {
  name: string;
  description?: string | null;
  isRTL: boolean;
}

export function CompanyCardContent({ name, description, isRTL }: CompanyCardContentProps) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-4 mt-4">
      <h3 className={cn(
        "text-xl font-semibold text-center",
        isRTL && "font-cairo"
      )}>
        {name}
      </h3>
      {description && showDescription && (
        <p className={cn(
          "text-sm text-gray-500 dark:text-gray-400 text-center",
          isRTL && "font-cairo"
        )}>
          {description}
        </p>
      )}
      {!description && (
        <p className={cn(
          "text-sm text-gray-400 italic text-center",
          isRTL && "font-cairo"
        )}>
          {isRTL ? "لا يوجد وصف" : "No description"}
        </p>
      )}
      {description && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDescription(!showDescription)}
          className="mt-2"
        >
          {showDescription ? (
            <EyeOff className="h-4 w-4 mr-2" />
          ) : (
            <Eye className="h-4 w-4 mr-2" />
          )}
          {showDescription 
            ? (isRTL ? "إخفاء التفاصيل" : "Hide details") 
            : (isRTL ? "إظهار التفاصيل" : "Show details")
          }
        </Button>
      )}
    </div>
  );
}