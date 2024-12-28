import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPresenceDialog } from "./users/presence/UserPresenceDialog";
import { UserPresenceItem } from "./users/presence/UserPresenceItem";
import { usePresenceState } from "./users/presence/usePresenceState";
import { UserDetails } from "@/types/userTypes";

export const ActiveUsers = () => {
  const { t, i18n } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [usersList, setUsersList] = useState<UserDetails[]>([]);
  const isRTL = i18n.language === 'ar';
  
  const { onlineUsers, offlineUsers, presenceState } = usePresenceState();

  const handleShowUsers = async (type: 'online' | 'offline') => {
    const { data: allUsers } = await supabase
      .from('profiles')
      .select('id, full_name, avatar, role')
      .eq('status', 'active');

    if (allUsers) {
      const onlineUserIds = Object.values(presenceState['user-presence'] || {}).map(
        (presence: any) => presence.user_id
      );
      console.log('Online user IDs:', onlineUserIds);
      
      const filteredUsers = allUsers.filter(user => {
        const isUserOnline = onlineUserIds.includes(user.id);
        return type === 'online' ? isUserOnline : !isUserOnline;
      });

      console.log(`${type} users:`, filteredUsers);
      setUsersList(filteredUsers);
      setDialogTitle(type === 'online' 
        ? (isRTL ? "المستخدمون المتصلون" : "Online Users")
        : (isRTL ? "المستخدمون غير المتصلين" : "Offline Users")
      );
      setDialogOpen(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {t("dashboard.activeUsers")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <UserPresenceItem
              label={isRTL ? "المستخدمون المتصلون" : "Online Users"}
              count={onlineUsers}
              isOnline={true}
              isRTL={isRTL}
              onClick={() => handleShowUsers('online')}
            />
            <UserPresenceItem
              label={isRTL ? "المستخدمون غير المتصلين" : "Offline Users"}
              count={offlineUsers}
              isOnline={false}
              isRTL={isRTL}
              onClick={() => handleShowUsers('offline')}
            />
          </div>
        </CardContent>
      </Card>

      <UserPresenceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dialogTitle={dialogTitle}
        usersList={usersList}
        isRTL={isRTL}
      />
    </>
  );
};