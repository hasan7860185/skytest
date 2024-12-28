import { ClientInsights } from "./types";

interface ClientAnalysisResultsProps {
  insights: ClientInsights;
  isRTL: boolean;
}

export function ClientAnalysisResults({ insights, isRTL }: ClientAnalysisResultsProps) {
  return (
    <div className="space-y-4">
      {insights.purchaseProbability && (
        <div>
          <h3 className="font-semibold mb-2">
            {isRTL ? "احتمالية الشراء" : "Purchase Probability"}
          </h3>
          <p>{Math.round(insights.purchaseProbability * 100)}%</p>
        </div>
      )}

      {insights.bestContactTime && (
        <div>
          <h3 className="font-semibold mb-2">
            {isRTL ? "أفضل وقت للتواصل" : "Best Contact Time"}
          </h3>
          <p>{insights.bestContactTime}</p>
        </div>
      )}

      {insights.recommendations.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">
            {isRTL ? "التوصيات" : "Recommendations"}
          </h3>
          <ul className="list-disc list-inside">
            {insights.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {insights.nextSteps.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">
            {isRTL ? "الخطوات التالية" : "Next Steps"}
          </h3>
          <ul className="list-disc list-inside">
            {insights.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}