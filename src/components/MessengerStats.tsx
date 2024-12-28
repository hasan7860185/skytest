import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";

interface DailyStats {
  date: Date;
  count: number;
  users: { id: string; name: string; count: number }[];
}

export const MessengerStats = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [stats, setStats] = useState({
    dailyStats: [] as DailyStats[]
  });

  useEffect(() => {
    const fetchStats = async () => {
      const maxRetries = 3;
      let attempt = 0;

      while (attempt < maxRetries) {
        try {
          const { data: user } = await supabase.auth.getUser();
          if (!user.user?.id) return;

          // Get daily Messenger contacts for the last 7 days
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            return date;
          }).reverse();

          // Fetch client actions and profiles with retry logic
          const { data: clientActions, error: actionsError } = await supabase
            .from('client_actions')
            .select('created_at, created_by')
            .eq('action_type', 'facebookContact');

          if (actionsError) {
            console.error('Error finding client actions:', actionsError);
            throw actionsError;
          }

          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name');

          if (profilesError) {
            console.error('Error finding profiles:', profilesError);
            throw profilesError;
          }

          console.log('Messenger Stats - Raw Data:', { clientActions, profiles });

          const dailyData = last7Days.map(date => {
            const dayActions = (clientActions || []).filter(action => {
              const actionDate = new Date(action.created_at);
              return actionDate.toDateString() === date.toDateString();
            });

            // Group actions by user
            const userStats = dayActions.reduce((acc, action) => {
              const userId = action.created_by;
              const userProfile = profiles?.find(p => p.id === userId);
              const userName = userProfile?.full_name || (isRTL ? 'مستخدم غير معروف' : 'Unknown User');
              
              const existingUser = acc.find(u => u.id === userId);
              if (existingUser) {
                existingUser.count++;
              } else {
                acc.push({ id: userId, name: userName, count: 1 });
              }
              return acc;
            }, [] as { id: string; name: string; count: number }[]);

            return {
              date,
              count: dayActions.length,
              users: userStats
            };
          });

          console.log('Messenger Stats - Processed Data:', dailyData);

          setStats({
            dailyStats: dailyData
          });
          break; // Success - exit retry loop

        } catch (error: any) {
          console.error('Error in messenger stats:', error);
          attempt++;

          if (error.message?.includes('Failed to fetch')) {
            if (error.stack?.includes('gpteng.co')) {
              toast.error(
                isRTL ? 
                'يبدو أن برنامج الحماية يمنع الاتصال. الرجاء تعطيل برامج الحماية مؤقتاً أو إضافة النطاق إلى القائمة البيضاء' :
                'Security software is blocking the connection. Please temporarily disable security software or whitelist the domain'
              );
              break;
            }
          }

          if (attempt === maxRetries) {
            toast.error(isRTL ? 'فشل في تحميل الإحصائيات' : 'Failed to load statistics');
            break;
          }

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 10000)));
        }
      }
    };

    fetchStats();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('messenger_updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'client_actions',
          filter: 'action_type=eq.facebookContact'
        },
        () => {
          console.log('Messenger contact status changed, refreshing stats...');
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [i18n.language]);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className={cn(
          "text-lg font-medium flex items-center gap-2",
          isRTL ? "flex-row-reverse font-cairo" : "flex-row"
        )}>
          <MessageCircle className="w-5 h-5 text-blue-500" />
          {t("dashboard.messenger")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.dailyStats}>
              <XAxis 
                dataKey={(data) => format(data.date, 'd')}
                reversed={isRTL}
                tick={{ 
                  fill: 'currentColor',
                  fontSize: 12,
                  fontFamily: isRTL ? 'Cairo' : 'inherit'
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  textAlign: isRTL ? 'right' : 'left',
                  direction: isRTL ? 'rtl' : 'ltr'
                }}
                formatter={(value: number, name: string, props: any) => {
                  const { date, users } = props.payload;
                  const formattedDate = format(date, 'EEEE, d MMMM yyyy', {
                    locale: isRTL ? ar : undefined
                  });

                  const userDetails = users.map((user: { name: string; count: number }) => 
                    `${user.name}: ${user.count} ${t("dashboard.sent")}`
                  ).join('\n');

                  return [
                    [
                      `${value} ${t("dashboard.sent")}`,
                      formattedDate,
                      '',
                      isRTL ? 'المستخدمين:' : 'Users:',
                      userDetails
                    ].join('\n'),
                    ''
                  ];
                }}
                labelFormatter={() => t("dashboard.messenger")}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#1D9BF0"
                fill="#1D9BF0"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};