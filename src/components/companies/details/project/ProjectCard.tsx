import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectShareDialog } from "../../project-form/share/ProjectShareDialog";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectCardProps {
  project: any;
  isRTL: boolean;
  onView: (project: any) => void;
  onEdit: (project: any) => void;
  onDelete: (project: any) => void;
}

export function ProjectCard({ project, isRTL, onView, onEdit, onDelete }: ProjectCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isMobile = useIsMobile();

  const ActionButtons = () => (
    <div className={cn(
      "flex gap-2",
      isRTL && "flex-row-reverse"
    )}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowDetails(!showDetails)}
        className="dark:bg-gray-700/30 dark:border-gray-600 dark:hover:bg-gray-700/50 dark:text-white"
        title={showDetails ? (isRTL ? "إخفاء التفاصيل" : "Hide details") : (isRTL ? "إظهار التفاصيل" : "Show details")}
      >
        {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onView(project)}
        className="dark:bg-gray-700/30 dark:border-gray-600 dark:hover:bg-gray-700/50 dark:text-white"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onEdit(project)}
        className="dark:bg-gray-700/30 dark:border-gray-600 dark:hover:bg-gray-700/50 dark:text-white"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <ProjectShareDialog project={project} />
      <Button
        variant="destructive"
        size="icon"
        onClick={() => onDelete(project)}
        className="dark:bg-red-900/50 dark:hover:bg-red-900/75 dark:text-red-100"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div
      className={cn(
        "p-6 rounded-lg border",
        "bg-card text-card-foreground",
        "dark:bg-gray-800/50 dark:border-gray-700/50 dark:text-gray-100",
        "shadow-sm hover:shadow-md transition-shadow duration-200",
        "dark:shadow-gray-900/10 dark:hover:shadow-gray-900/20",
        isRTL && "font-cairo"
      )}
    >
      <div className={cn(
        "space-y-4",
        isRTL && "text-right"
      )}>
        <div className={cn(
          "flex flex-col md:flex-row items-center gap-4",
          isRTL ? "md:flex-row-reverse" : "",
          isMobile ? "flex-col-reverse" : ""
        )}>
          <h3 className="text-lg font-semibold dark:text-gray-100 flex-1">{project.name}</h3>
          <ActionButtons />
        </div>

        {showDetails && (
          <>
            {project.description && (
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {project.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              {project.engineering_consultant && (
                <div>
                  <span className="text-muted-foreground dark:text-gray-400">
                    {isRTL ? "الاستشاري الهندسي:" : "Engineering Consultant:"}
                  </span>
                  <p className="dark:text-gray-200">{project.engineering_consultant}</p>
                </div>
              )}

              {project.operating_company && (
                <div>
                  <span className="text-muted-foreground dark:text-gray-400">
                    {isRTL ? "شركة الإدارة:" : "Operating Company:"}
                  </span>
                  <p className="dark:text-gray-200">{project.operating_company}</p>
                </div>
              )}

              {project.location && (
                <div>
                  <span className="text-muted-foreground dark:text-gray-400">
                    {isRTL ? "الموقع:" : "Location:"}
                  </span>
                  <p className="dark:text-gray-200">{project.location}</p>
                </div>
              )}

              {project.price_per_meter && (
                <div>
                  <span className="text-muted-foreground dark:text-gray-400">
                    {isRTL ? "السعر/متر:" : "Price/m²:"}
                  </span>
                  <p className="dark:text-gray-200">{project.price_per_meter}</p>
                </div>
              )}

              {project.available_units && (
                <div>
                  <span className="text-muted-foreground dark:text-gray-400">
                    {isRTL ? "الوحدات المتاحة:" : "Available Units:"}
                  </span>
                  <p className="dark:text-gray-200">{project.available_units}</p>
                </div>
              )}

              {project.delivery_date && (
                <div>
                  <span className="text-muted-foreground dark:text-gray-400">
                    {isRTL ? "تاريخ التسليم:" : "Delivery Date:"}
                  </span>
                  <p className="dark:text-gray-200">
                    {format(new Date(project.delivery_date), 'PPP', {
                      locale: isRTL ? ar : undefined
                    })}
                  </p>
                </div>
              )}
            </div>

            {project.images && project.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {project.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${project.name} - ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border dark:border-gray-700"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}