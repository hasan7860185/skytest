import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectAnalysis } from "@/hooks/useProjectAnalysis";
import { ProjectAnalysisResults } from "./ProjectAnalysisResults";
import { ProjectData } from "@/components/companies/project-form/types";

interface ProjectAIAnalysisProps {
  project: ProjectData;
  isRTL: boolean;
}

export function ProjectAIAnalysis({ project, isRTL }: ProjectAIAnalysisProps) {
  const { analysis, analyzeProject, isLoading } = useProjectAnalysis();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => analyzeProject(project)}
          disabled={isLoading}
          className={cn(
            "gap-2",
            isRTL && "flex-row-reverse font-cairo"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          {isRTL ? "تحليل المشروع" : "Analyze Project"}
        </Button>
      </div>

      {analysis && (
        <ProjectAnalysisResults analysis={analysis} isRTL={isRTL} />
      )}
    </div>
  );
}