import { Json } from "@/integrations/supabase/types";

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  email: boolean;
}

export type NotificationSettingsJson = NotificationSettings & {
  [key: string]: Json | undefined;
};

export const defaultNotificationSettings: NotificationSettings = {
  enabled: false,
  sound: false,
  email: false
};