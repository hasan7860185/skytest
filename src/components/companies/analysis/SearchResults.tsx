import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { ViewProjectDialog } from "../details/project/ViewProjectDialog";
import { useState } from "react";

interface SearchResultsProps {
  results: any;
  isRTL: boolean;
}

export function SearchResults({ results, isRTL }: SearchResultsProps) {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  if (!results) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return isRTL ? "غير محدد" : "Not specified";
    return format(new Date(dateString), "PPP", {
      locale: isRTL ? ar : undefined
    });
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return isRTL ? "غير محدد" : "Not specified";
    if (typeof value === "number") {
      return value.toLocaleString(isRTL ? "ar-SA" : "en-US");
    }
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, { ar: string; en: string }> = {
      location: { ar: "الموقع", en: "Location" },
      price_per_meter: { ar: "السعر لكل متر", en: "Price per meter" },
      available_units: { ar: "الوحدات المتاحة", en: "Available units" },
      unit_price: { ar: "سعر الوحدة", en: "Unit price" },
      min_area: { ar: "الحد الأدنى للمساحة", en: "Minimum area" },
      project_sections: { ar: "أقسام المشروع", en: "Project sections" },
      operating_company: { ar: "شركة التشغيل", en: "Operating company" },
      engineering_consultant: { ar: "الاستشاري الهندسي", en: "Engineering consultant" },
      rental_system: { ar: "نظام الإيجار", en: "Rental system" },
      delivery_date: { ar: "تاريخ التسليم", en: "Delivery date" }
    };

    return labels[field] ? (isRTL ? labels[field].ar : labels[field].en) : field;
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="mt-4 space-y-4">
      <h4 className={cn(
        "font-semibold",
        isRTL && "font-cairo text-right"
      )}>
        {isRTL ? "نتائج البحث" : "Search Results"}
      </h4>
      <div className="prose dark:prose-invert max-w-none">
        <div className={cn(
          "text-sm",
          isRTL && "font-cairo text-right"
        )}>
          {results.summary}
        </div>
        {results.matches && results.matches.length > 0 && (
          <div className="mt-4 space-y-4">
            {results.matches.map((match: any, index: number) => (
              <Card key={index} className="p-4">
                <h5 className={cn(
                  "font-semibold mb-2",
                  isRTL && "font-cairo text-right"
                )}>
                  {formatValue(match.name)}
                </h5>
                <p className={cn(
                  "text-sm text-muted-foreground mb-4",
                  isRTL && "font-cairo text-right"
                )}>
                  {formatValue(match.relevance)}
                </p>
                
                {match.projects && match.projects.length > 0 && (
                  <div className="space-y-4">
                    <h6 className={cn(
                      "font-semibold text-sm",
                      isRTL && "font-cairo text-right"
                    )}>
                      {isRTL ? "المشاريع" : "Projects"}
                    </h6>
                    <div className="grid gap-4">
                      {match.projects.map((project: any, projectIndex: number) => (
                        <div 
                          key={projectIndex} 
                          className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                          onClick={() => handleProjectClick(project)}
                        >
                          <h6 className={cn(
                            "font-semibold mb-2",
                            isRTL && "font-cairo text-right"
                          )}>
                            {formatValue(project.name)}
                          </h6>
                          {project.description && (
                            <p className={cn(
                              "text-sm text-muted-foreground mb-2",
                              isRTL && "font-cairo text-right"
                            )}>
                              {formatValue(project.description)}
                            </p>
                          )}
                          
                          {/* Project Images */}
                          {project.images && project.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              {project.images.map((image: string, imgIndex: number) => (
                                <img
                                  key={imgIndex}
                                  src={image}
                                  alt={`${project.name} - ${imgIndex + 1}`}
                                  className="w-full h-24 object-cover rounded-md"
                                />
                              ))}
                            </div>
                          )}

                          <div className={cn(
                            "text-sm grid gap-2",
                            isRTL && "text-right"
                          )}>
                            {[
                              'location',
                              'price_per_meter',
                              'available_units',
                              'unit_price',
                              'min_area',
                              'project_sections',
                              'operating_company',
                              'engineering_consultant',
                              'rental_system',
                              'delivery_date'
                            ].map((field) => (
                              project[field] !== undefined && (
                                <div key={field} className="flex justify-between">
                                  <span className={cn(
                                    "font-medium",
                                    isRTL && "font-cairo"
                                  )}>
                                    {getFieldLabel(field)}:
                                  </span>
                                  <span className={cn(
                                    "text-muted-foreground",
                                    isRTL && "font-cairo"
                                  )}>
                                    {field === 'delivery_date' 
                                      ? formatDate(project[field])
                                      : formatValue(project[field])}
                                  </span>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <ViewProjectDialog
        project={selectedProject}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        isRTL={isRTL}
      />
    </div>
  );
}