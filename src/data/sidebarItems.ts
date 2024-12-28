import {
  LayoutDashboard,
  Users,
  Home,
  ClipboardList,
  Bell,
  Settings,
  UserPlus,
  Bot,
  Building2,
  MessageCircle,
  ChartBar,
  BookOpen,
  LightbulbIcon,
  MapPin,
  Smartphone,
  Activity
} from "lucide-react";
import { staticClientStatuses } from "./clientStatuses";
import { supabase } from "@/integrations/supabase/client";

const getRole = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
    
  return profile?.role;
};

export const getSidebarItems = async () => {
  const role = await getRole();
  const isAdminOrSupervisor = role === 'admin' || role === 'supervisor';

  const baseItems = [
    { icon: LayoutDashboard, label: "nav.home", path: "/" },
    { 
      icon: Users, 
      label: "nav.clients", 
      path: "/clients", 
      hasSubmenu: true, 
      submenu: [
        { icon: Users, label: "status.all" },
        ...staticClientStatuses.map(status => ({
          icon: status.icon,
          label: `status.${status.key}`
        }))
      ]
    },
    { icon: Home, label: "nav.properties", path: "/properties" },
    { icon: Building2, label: "nav.companies", path: "/companies" },
    { icon: MapPin, label: "nav.regions", path: "/regions" },
    { icon: ChartBar, label: "nav.analytics", path: "/analytics" },
    { icon: Activity, label: "nav.activityLogs", path: "/activity-logs" },
    { icon: BookOpen, label: "nav.guides", path: "/guides" },
    { icon: Users, label: "nav.users", path: "/users" },
    { icon: ClipboardList, label: "nav.tasks", path: "/tasks" },
    { icon: Bell, label: "nav.notifications", path: "/notifications" },
    { icon: Settings, label: "nav.settings", path: "/settings" },
    { icon: Bot, label: "nav.assistant", path: "/assistant" },
    { icon: MessageCircle, label: "nav.chat", path: "/chat" },
    { icon: LightbulbIcon, label: "nav.suggestions", path: "/suggestions" },
    { icon: Smartphone, label: "nav.androidApp", path: "/android-download" },
  ];

  if (isAdminOrSupervisor) {
    baseItems.splice(8, 0, { icon: UserPlus, label: "nav.addUser", path: "/users/add" });
  }

  return baseItems;
};