import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopUsersInsightsProps {
  insights: string | null;
  isRTL: boolean;
}

export function TopUsersInsights({ insights, isRTL }: TopUsersInsightsProps) {
  if (!insights) return null;

  return (
    <Alert className="mt-4">
      <InfoIcon className="h-4 w-4" />
      <AlertDescription className={cn(
        "whitespace-pre-wrap text-sm",
        isRTL && "font-cairo text-right"
      )}>
        {insights}
      </AlertDescription>
    </Alert>
  );
}