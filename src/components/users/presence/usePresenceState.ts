import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePresenceState() {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [offlineUsers, setOfflineUsers] = useState(0);
  const [presenceState, setPresenceState] = useState<Record<string, any>>({});

  useEffect(() => {
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: 'user-presence',
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence state:', state);
        setPresenceState(state);
        
        const onlineUserIds = Object.values(state['user-presence'] || {}).map(
          (presence: any) => presence.user_id
        );
        console.log('Extracted online user IDs:', onlineUserIds);
        
        const onlineCount = onlineUserIds.length;
        
        supabase
          .from('profiles')
          .select('count')
          .eq('status', 'active')
          .single()
          .then(({ data }) => {
            const totalUsers = data?.count || 0;
            setOnlineUsers(onlineCount);
            setOfflineUsers(totalUsers - onlineCount);
          });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await channel.track({
              user_id: user.id,
              online_at: new Date().toISOString(),
            });
          }
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    onlineUsers,
    offlineUsers,
    presenceState
  };
}