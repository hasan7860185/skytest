import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { NotificationSettings, defaultNotificationSettings } from "@/types/settings";
import { toast } from "sonner";

export function useNotificationSound(unreadCount: number, prevUnreadCount: number) {
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const initializeSound = async () => {
      try {
        // Get the notification sound URL from storage
        const { data: { publicUrl } } = supabase.storage
          .from('notifications')
          .getPublicUrl('notification-sound.mp3');

        if (!notificationSound.current) {
          notificationSound.current = new Audio(publicUrl);
          notificationSound.current.preload = "auto";
          notificationSound.current.volume = 0.5;
          console.log('Notification sound initialized with URL:', publicUrl);

          // Add error handling for audio loading
          notificationSound.current.onerror = () => {
            console.error('Error loading notification sound');
            toast.error('فشل في تحميل صوت الإشعارات');
          };
        }
      } catch (error) {
        console.error('Error initializing notification sound:', error);
      }
    };

    initializeSound();
  }, []);

  useEffect(() => {
    const playNotificationSound = async () => {
      try {
        // Get user session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.log('No user session found');
          return;
        }

        // Get user profile and notification settings
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('notification_settings')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        // Parse notification settings with type safety
        const rawSettings = profile?.notification_settings as unknown;
        const settings: NotificationSettings = rawSettings 
          ? { 
              enabled: Boolean((rawSettings as any)?.enabled ?? defaultNotificationSettings.enabled),
              sound: Boolean((rawSettings as any)?.sound ?? defaultNotificationSettings.sound),
              email: Boolean((rawSettings as any)?.email ?? defaultNotificationSettings.email)
            }
          : defaultNotificationSettings;

        console.log('Notification settings:', settings);

        // Only play sound if notifications are enabled and sound is enabled
        if (unreadCount > prevUnreadCount && settings.enabled && settings.sound && notificationSound.current) {
          console.log('Playing notification sound');
          try {
            // Force sound to play from the beginning
            notificationSound.current.currentTime = 0;
            const playPromise = notificationSound.current.play();
            
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error('Error playing notification sound:', error);
                if (error instanceof Error && error.name === 'NotAllowedError') {
                  toast.error('يرجى السماح بتشغيل الصوت في المتصفح');
                } else {
                  toast.error('حدث خطأ أثناء تشغيل صوت الإشعار');
                }
              });
            }
          } catch (error) {
            console.error('Error playing notification sound:', error);
            toast.error('حدث خطأ أثناء تشغيل صوت الإشعار');
          }
        } else {
          console.log('Skipping notification sound:', {
            unreadCount,
            prevUnreadCount,
            notificationsEnabled: settings.enabled,
            soundEnabled: settings.sound
          });
        }
      } catch (error) {
        console.error('Error checking notification settings:', error);
      }
    };

    playNotificationSound();
  }, [unreadCount, prevUnreadCount]);
}