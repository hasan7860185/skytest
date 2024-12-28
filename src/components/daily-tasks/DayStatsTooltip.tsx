import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import type { DayData } from "./types";

interface DayStatsTooltipProps {
  payload: any;
  isRTL: boolean;
}

export function DayStatsTooltip({ payload, isRTL }: DayStatsTooltipProps) {
  const { t } = useTranslation();
  
  if (!payload?.date) return null;
  
  const { date, users, totalNewClients } = payload as DayData;
  
  const formattedDate = format(date, 'EEEE, d MMMM yyyy', {
    locale: isRTL ? ar : undefined
  });

  // Group all status counts across users
  const statusTotals: Record<string, { total: number, users: { name: string; count: number }[] }> = {};
  
  users.forEach(user => {
    Object.entries(user.statuses).forEach(([status, count]) => {
      if (!statusTotals[status]) {
        statusTotals[status] = { total: 0, users: [] };
      }
      statusTotals[status].total += count;
      if (count > 0) {
        statusTotals[status].users.push({ name: user.name, count });
      }
    });
  });

  const newClientsSection = users
    .filter(user => user.newClients > 0)
    .map(user => `${user.name}: ${user.newClients}`)
    .join('\n');

  const statusDetails = Object.entries(statusTotals)
    .map(([status, data]) => {
      const userDetails = data.users
        .map(u => `${u.name}: ${u.count}`)
        .join('\n');
      return [
        `${t(`clients.status.${status}`)}: ${data.total}`,
        userDetails
      ].join('\n');
    })
    .join('\n\n');

  return [
    formattedDate,
    `${t("dashboard.totalNewClients")}: ${totalNewClients}`,
    newClientsSection ? `\n${t("dashboard.newClientsBy")}:\n${newClientsSection}` : '',
    '\n' + t("dashboard.statusBreakdown") + ':',
    statusDetails
  ].join('\n');
}