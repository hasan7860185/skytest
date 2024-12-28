import { useEffect, useState } from "react";
import type { DayData, UserStats } from "@/components/daily-tasks/types";
import { useClientStore } from "@/data/clientsData";

export function useChartData(userProfiles: Record<string, { full_name: string }>, isRTL: boolean) {
  const clients = useClientStore((state) => state.clients);
  const [chartData, setChartData] = useState<DayData[]>([]);

  useEffect(() => {
    // Get the last 3 days
    const last3Days = Array.from({ length: 3 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    }).reverse();

    // Process data for each day
    const processedData = last3Days.map(date => {
      const dayClients = clients.filter(client => {
        const clientDate = new Date(client.createdAt);
        clientDate.setHours(0, 0, 0, 0);
        return clientDate.getTime() === date.getTime();
      });

      // Group clients by user and status
      const userStats: Record<string, UserStats> = {};
      
      dayClients.forEach(client => {
        const userId = client.userId;
        const userName = userProfiles[userId]?.full_name || (isRTL ? 'مستخدم غير معروف' : 'Unknown User');
        
        if (!userStats[userId]) {
          userStats[userId] = {
            id: userId,
            name: userName,
            statuses: {},
            newClients: 0
          };
        }
        
        // Track status counts
        if (!userStats[userId].statuses[client.status]) {
          userStats[userId].statuses[client.status] = 0;
        }
        userStats[userId].statuses[client.status]++;
        
        // Track new clients added
        if (new Date(client.createdAt).toDateString() === date.toDateString()) {
          userStats[userId].newClients++;
        }
      });

      const users = Object.values(userStats);

      // Calculate totals for chart
      const totalCompleted = users.reduce((sum, user) => 
        sum + (user.statuses['sold'] || 0) + (user.statuses['booked'] || 0), 0);
      const totalPending = users.reduce((sum, user) => 
        sum + (user.statuses['new'] || 0) + (user.statuses['interested'] || 0), 0);
      const totalCancelled = users.reduce((sum, user) => 
        sum + (user.statuses['cancelled'] || 0) + (user.statuses['not_interested'] || 0), 0);

      return {
        name: date.getDate().toString(),
        date,
        completed: totalCompleted,
        pending: totalPending,
        cancelled: totalCancelled,
        users,
        totalNewClients: dayClients.length
      };
    });

    setChartData(processedData);
  }, [clients, isRTL, userProfiles]);

  return chartData;
}