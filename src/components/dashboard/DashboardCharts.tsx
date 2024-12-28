import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface DashboardChartsProps {
  activeUsersData: Array<{ hour: number; users: number }>;
  connectedUsersData: Array<{ hour: number; users: number }>;
}

export function DashboardCharts({ activeUsersData, connectedUsersData }: DashboardChartsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return null; // Component removed as requested
}