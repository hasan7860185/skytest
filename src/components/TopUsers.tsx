import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { TimeRange } from "@/types/userTypes";
import { useGeminiAI } from "@/hooks/useGeminiAI";
import { supabase } from "@/integrations/supabase/client";
import { TopUsersList } from "./users/TopUsersList";
import { TopUsersInsights } from "./users/TopUsersInsights";
import { TopUsersHeader } from "./users/TopUsersHeader";
import { toast } from "sonner";

export function TopUsers() {
  const { t, i18n } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [showAIInsights, setShowAIInsights] = useState(false);
  const isRTL = i18n.language === 'ar';
  const { generateText } = useGeminiAI();

  useRealtimeSubscription('profiles', ['profiles']);
  useRealtimeSubscription('client_actions', ['client_actions']);

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users", timeRange],
    queryFn: async () => {
      try {
        // First get all active profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('status', 'active');

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        // Get actions based on time range
        let query = supabase
          .from('client_actions')
          .select('created_by, created_at');

        // Only apply date filter if not "all"
        if (timeRange !== "all") {
          let startDate = new Date();
          switch (timeRange) {
            case "daily":
              startDate.setDate(startDate.getDate() - 1);
              break;
            case "weekly":
              startDate.setDate(startDate.getDate() - 7);
              break;
            case "monthly":
              startDate.setMonth(startDate.getMonth() - 1);
              break;
          }
          query = query.gte('created_at', startDate.toISOString());
        }

        const { data: actions, error: actionsError } = await query;

        if (actionsError) {
          console.error('Error fetching actions:', actionsError);
          throw actionsError;
        }

        // Count actions for each user
        const actionCounts: Record<string, number> = {};
        actions?.forEach(action => {
          if (action.created_by) {
            actionCounts[action.created_by] = (actionCounts[action.created_by] || 0) + 1;
          }
        });

        // Map profiles to TopUser format and sort by action count
        const sortedUsers = profiles?.map(profile => ({
          user_id: profile.id,
          full_name: profile.full_name || t('clients.common.unnamed'),
          avatar: profile.avatar,
          role: profile.role,
          action_count: actionCounts[profile.id] || 0
        }))
        .sort((a, b) => b.action_count - a.action_count) || [];

        return sortedUsers;
      } catch (error: any) {
        console.error('Error in users query:', error);
        toast.error(isRTL ? 'حدث خطأ أثناء جلب المستخدمين' : 'Error fetching users');
        return [];
      }
    },
    refetchInterval: 5000,
  });

  const { data: aiInsights } = useQuery({
    queryKey: ["topUsersInsights", timeRange, users],
    queryFn: async () => {
      if (!showAIInsights || users.length === 0) return null;

      const prompt = `
        تحليل المستخدمين:
        
        البيانات:
        ${users.map((user, index) => 
          `${index + 1}. ${user.full_name || 'مستخدم'} (${user.role || 'غير محدد'}) - عدد الإجراءات: ${user.action_count}
          `
        ).join('\n')}
        
        المطلوب:
        1. تحليل نشاط المستخدمين
        2. تحديد نقاط القوة
        3. اقتراحات للتحسين
        4. توصيات للفريق
      `;

      const response = await generateText(prompt);
      return response;
    },
    enabled: showAIInsights && users.length > 0,
    refetchInterval: 1000 * 60 * 5,
  });

  if (error) {
    console.error('Error loading users:', error);
  }

  return (
    <Card className="bg-white dark:bg-gray-800/95 border-gray-200 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-4">
        <TopUsersHeader
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          showAIInsights={showAIInsights}
          setShowAIInsights={setShowAIInsights}
          isRTL={isRTL}
        />
      </CardHeader>
      <CardContent>
        <TopUsersList users={users} isRTL={isRTL} />
        {showAIInsights && <TopUsersInsights insights={aiInsights} isRTL={isRTL} />}
      </CardContent>
    </Card>
  );
}