import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProjectAnalysisResultsProps {
  analysis: {
    strengths: string[];
    weaknesses: string[];
    customerApproach: string[];
    talkingPoints: string[];
  };
  isRTL: boolean;
}

export function ProjectAnalysisResults({ analysis, isRTL }: ProjectAnalysisResultsProps) {
  if (!analysis) return null;

  const renderSection = (title: string, items: string[]) => (
    <Card className="h-full">
      <CardContent className={cn(
        "p-4 space-y-2",
        isRTL && "text-right"
      )}>
        <h3 className={cn(
          "font-semibold text-lg text-primary",
          isRTL && "font-cairo"
        )}>
          {title}
        </h3>
        <ul className="mt-2 space-y-2">
          {items.map((item, index) => (
            <li 
              key={index} 
              className={cn(
                "text-sm text-muted-foreground flex items-start gap-2",
                isRTL && "font-cairo"
              )}
            >
              <span className="text-primary mt-1 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {renderSection(isRTL ? "نقاط القوة" : "Strengths", analysis.strengths)}
      {renderSection(isRTL ? "نقاط الضعف" : "Weaknesses", analysis.weaknesses)}
      {renderSection(
        isRTL ? "كيفية مقاربة العملاء" : "Customer Approach",
        analysis.customerApproach
      )}
      {renderSection(
        isRTL ? "نقاط الحديث" : "Talking Points",
        analysis.talkingPoints
      )}
    </div>
  );
}