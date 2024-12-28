import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { User } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityLogsView } from "@/components/activity/ActivityLogsView";
import { cn } from "@/lib/utils";

export default function Users() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Enable real-time subscription for profiles table
  useRealtimeSubscription('profiles', ['users']);

  // Get current user's role
  const { data: currentUserRole } = useQuery({
    queryKey: ["currentUserRole"],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          toast.error(isRTL ? "غير مصرح به" : "Unauthorized");
          return null;
        }

        const { data: profiles } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id);

        return profiles && profiles.length > 0 ? profiles[0].role : null;
      } catch (error: any) {
        console.error("Error fetching user role:", error);
        toast.error(isRTL ? "خطأ في جلب صلاحيات المستخدم" : "Error fetching user role");
        return null;
      }
    },
    retry: 1
  });

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;

        // Map profiles to User type
        return (profiles || []).map(profile => ({
          id: profile.id,
          full_name: profile.full_name,
          role: profile.role,
          status: profile.status,
          avatar: profile.avatar,
          email: null // Email is not accessible from client side
        })) as User[];

      } catch (error: any) {
        console.error("Error fetching users:", error);
        const errorMessage = error.message || (isRTL ? "خطأ في تحميل المستخدمين" : "Error loading users");
        toast.error(isRTL ? `خطأ: ${errorMessage}` : `Error: ${errorMessage}`);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const isAdmin = currentUserRole === 'admin';

  const getRoleLabel = (role: string | null) => {
    if (!role) return '';
    switch (role) {
      case 'admin':
        return isRTL ? 'مدير النظام' : 'Administrator';
      case 'supervisor':
        return isRTL ? 'مشرف' : 'Supervisor';
      case 'sales':
        return isRTL ? 'مبيعات' : 'Sales';
      case 'employee':
        return isRTL ? 'موظف' : 'Employee';
      default:
        return role;
    }
  };

  const getStatusLabel = (status: string | null) => {
    if (!status) return '';
    return status === 'active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <DashboardContent>
        <div className="p-8 pt-20">
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users" className={cn(isRTL && "font-cairo")}>
                {isRTL ? "المستخدمين" : "Users"}
              </TabsTrigger>
              <TabsTrigger value="activity" className={cn(isRTL && "font-cairo")}>
                {isRTL ? "سجل النشاطات" : "Activity Log"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <UsersHeader isAdmin={isAdmin} isRTL={isRTL} />
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <UsersTable 
                  users={users}
                  isLoading={isLoading}
                  isAdmin={isAdmin}
                  isRTL={isRTL}
                  getRoleLabel={getRoleLabel}
                  getStatusLabel={getStatusLabel}
                  refetch={refetch}
                />
              )}
            </TabsContent>

            <TabsContent value="activity">
              <ActivityLogsView />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardContent>
    </div>
  );
}

