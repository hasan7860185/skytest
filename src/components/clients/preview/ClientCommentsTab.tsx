import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Client } from "@/data/clientsData";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { actionTypeLabels } from "@/types/actionTypes";

interface ClientCommentsTabProps {
  client: Client;
}

interface Action {
  id: string;
  action_type: string;
  comment: string;
  created_at: string;
  created_by: string;
  userName: string;
}

export function ClientCommentsTab({ client }: ClientCommentsTabProps) {
  const { t, i18n } = useTranslation();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchActions = async () => {
      try {
        // Fetch actions with user names
        const { data: actionsData, error: actionsError } = await supabase
          .from("client_actions")
          .select("*")
          .eq("client_id", client.id)
          .order("created_at", { ascending: false });

        if (actionsError) {
          console.error("Error fetching actions:", actionsError);
          return;
        }

        // Fetch user names for each action
        const actionsWithUserNames = await Promise.all(
          actionsData.map(async (action) => {
            if (action.created_by) {
              const { data: userData, error: userError } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", action.created_by)
                .single();

              if (userError) {
                console.error("Error fetching user:", userError);
                return {
                  ...action,
                  userName: isRTL ? "مستخدم غير معروف" : "Unknown User"
                };
              }

              return {
                ...action,
                userName: userData?.full_name || (isRTL ? "مستخدم غير معروف" : "Unknown User")
              };
            }
            return {
              ...action,
              userName: isRTL ? "مستخدم غير معروف" : "Unknown User"
            };
          })
        );

        setActions(actionsWithUserNames);
      } catch (error) {
        console.error("Error in fetchActions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [client.id, isRTL]);

  if (loading) {
    return <div className="text-center py-4">{t("common.loading")}</div>;
  }

  if (actions.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        {isRTL ? "لا توجد تعليقات" : "No comments"}
      </div>
    );
  }

  const getActionTypeLabel = (actionType: string) => {
    const label = actionTypeLabels[actionType] || { ar: actionType, en: actionType };
    return isRTL ? label.ar : label.en;
  };

  return (
    <ScrollArea className="h-[60vh] w-full pr-4">
      <div className="space-y-4 p-1">
        {actions.map((action) => (
          <Card key={action.id} className="w-full">
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex-1">
                    <span className="font-medium text-primary">
                      {getActionTypeLabel(action.action_type)}
                    </span>
                    <div className="text-sm text-muted-foreground mt-1">
                      {isRTL ? "بواسطة:" : "By:"} {action.userName}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(action.created_at), "yyyy-MM-dd HH:mm")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 break-words">
                  {action.comment}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}