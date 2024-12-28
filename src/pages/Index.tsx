import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardStatusGrid } from "@/components/dashboard/DashboardStatusGrid";
import { WhatsappStats } from "@/components/WhatsappStats";
import { MessengerStats } from "@/components/MessengerStats";
import { AIAssistant } from "@/components/AIAssistant";
import { TopUsers } from "@/components/TopUsers";
import { DelayedClientsList } from "@/components/clients/DelayedClientsList";
import { AdminAnalyticsDashboard } from "@/components/dashboard/AdminAnalyticsDashboard";
import { useState, useMemo, Suspense } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isDelayedClientsVisible, setIsDelayedClientsVisible] = useState(true);
  
  useRealtimeSubscription('profiles', ['profiles']);

  const { data: activeUsersData = [] } = useQuery({
    queryKey: ['active-users'],
    queryFn: async () => {
      const hours = Array.from({ length: 6 }, (_, i) => {
        const hour = new Date().getHours() - i;
        return {
          hour: hour >= 0 ? hour : 24 + hour,
          users: Math.floor(Math.random() * 6) + 2
        };
      }).reverse();
      return hours;
    },
    staleTime: 30000,
    gcTime: 60000,
    refetchInterval: 30000
  });

  const { data: connectedUsersData = [] } = useQuery({
    queryKey: ['connected-users'],
    queryFn: async () => {
      const hours = Array.from({ length: 6 }, (_, i) => {
        const hour = new Date().getHours() - i;
        return {
          hour: hour >= 0 ? hour : 24 + hour,
          users: Math.floor(Math.random() * 6) + 2
        };
      }).reverse();
      return hours;
    },
    staleTime: 30000,
    gcTime: 60000,
    refetchInterval: 30000
  });

  const { data: todayStats } = useQuery({
    queryKey: ['today-stats'],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('status', 'active');

      return {
        activities: 0,
        connected: 0,
        connectedUsers: profiles?.length || 0
      };
    },
    staleTime: 30000,
    gcTime: 60000
  });

  const { data: isAdmin } = useQuery({
    queryKey: ['is-admin'],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      return profile?.role === 'admin';
    },
    staleTime: 300000,
    gcTime: 600000
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full bg-white dark:bg-background-dark">
        <div className={cn(
          "w-full h-full p-4 space-y-4 bg-[#191970]",
          "w-[105%] sm:w-full mx-auto" // Changed from 100% to 105% for mobile
        )}>
          <div className="grid grid-cols-1 gap-4 min-h-[calc(100vh-2rem)]">
            <Suspense fallback={<Skeleton className="h-32" />}>
              <DashboardStats 
                isRTL={isRTL}
                todayStats={todayStats || {
                  activities: 0,
                  connected: 0,
                  connectedUsers: 0
                }} 
              />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-64" />}>
              <DashboardStatusGrid />
            </Suspense>
            
            {isAdmin && (
              <Suspense fallback={<Skeleton className="h-96" />}>
                <AdminAnalyticsDashboard />
              </Suspense>
            )}
            
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                onClick={() => setIsDelayedClientsVisible(!isDelayedClientsVisible)}
              >
                <h2 className={cn(
                  "text-lg font-semibold",
                  isRTL && "font-cairo"
                )}>
                  {isRTL ? "العملاء المتأخرين" : "Delayed Clients"}
                </h2>
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isDelayedClientsVisible && "transform rotate-180"
                  )} 
                />
              </div>
              
              {isDelayedClientsVisible && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                  <Suspense fallback={<Skeleton className="h-64" />}>
                    <DelayedClientsList />
                  </Suspense>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              <Suspense fallback={<Skeleton className="h-64" />}>
                <WhatsappStats />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-64" />}>
                <MessengerStats />
              </Suspense>
            </div>
            
            <Suspense fallback={<Skeleton className="h-64" />}>
              <DashboardCharts 
                activeUsersData={activeUsersData}
                connectedUsersData={connectedUsersData}
              />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-64" />}>
              <TopUsers />
            </Suspense>

            <div className="w-full bg-white/10 dark:bg-gray-900/30 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/30">
              <Suspense fallback={<Skeleton className="h-96" />}>
                <AIAssistant />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;