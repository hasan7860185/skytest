import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function NotificationSettings() {
  const { t, i18n } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('notification_settings')
        .eq('id', session.user.id)
        .single();

      if (profile?.notification_settings) {
        const settings = profile.notification_settings as { [key: string]: boolean };
        setNotificationsEnabled(Boolean(settings.enabled));
        setSoundEnabled(Boolean(settings.sound));
        setEmailEnabled(Boolean(settings.email));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error(t("common.errors.unauthorized"));
        return;
      }

      const settings = {
        enabled: notificationsEnabled,
        sound: soundEnabled,
        email: emailEnabled
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: settings
        })
        .eq('id', session.user.id);

      if (error) throw error;
      toast.success(t("settings.notifications.saveSuccess"));
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(t("common.errors.saveFailed"));
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800/95 border-gray-200 dark:border-gray-700/30">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          {t("settings.notifications.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-gray-700 dark:text-gray-200">
            {t("settings.notifications.enable")}
          </Label>
          <Switch 
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-gray-700 dark:text-gray-200">
            {t("settings.notifications.sound")}
          </Label>
          <Switch 
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
            disabled={!notificationsEnabled}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-gray-700 dark:text-gray-200">
            {t("settings.notifications.email")}
          </Label>
          <Switch 
            checked={emailEnabled}
            onCheckedChange={setEmailEnabled}
            disabled={!notificationsEnabled}
          />
        </div>
        <Button 
          onClick={handleSaveSettings}
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {t("settings.notifications.save")}
        </Button>
      </CardContent>
    </Card>
  );
}