export interface ClientInsights {
  purchaseProbability: number | null;
  bestContactTime: string | null;
  recommendations: string[];
  nextSteps: string[];
}

export interface ClientAnalysisProps {
  clientId: string;
}