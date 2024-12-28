import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSubscriptions(isRTL: boolean) {
  const queryClient = useQueryClient();

  // First, get user profile to check permissions
  const { data: userProfile, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Not authenticated');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, is_super_admin, company_id, subscription_id')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      return profile;
    }
  });

  // Then fetch subscriptions only if user is super admin
  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      if (!userProfile?.is_super_admin) {
        throw new Error('Unauthorized');
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          company:companies(id, name, is_subscription_company)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
      }

      return data;
    },
    enabled: !!userProfile && userProfile.is_super_admin
  });

  const updateSubscription = useMutation({
    mutationFn: async ({ id, max_users }: { id: string; max_users: number }) => {
      if (!userProfile?.is_super_admin) {
        throw new Error('Unauthorized');
      }

      const { error } = await supabase
        .from('subscriptions')
        .update({ max_users })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success(isRTL ? "تم تحديث الاشتراك بنجاح" : "Subscription updated successfully");
    },
    onError: (error) => {
      console.error('Error updating subscription:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث الاشتراك" : "Error updating subscription");
    }
  });

  const updateCredentials = useMutation({
    mutationFn: async ({ id, email, password }: { id: string; email: string; password: string }) => {
      if (!userProfile?.is_super_admin) {
        throw new Error('Unauthorized');
      }

      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          admin_email: email,
          admin_password: password
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success(isRTL ? "تم تحديث بيانات الاعتماد بنجاح" : "Credentials updated successfully");
    },
    onError: (error) => {
      console.error('Error updating credentials:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث بيانات الاعتماد" : "Error updating credentials");
    }
  });

  const deleteSubscription = useMutation({
    mutationFn: async (id: string) => {
      if (!userProfile?.is_super_admin) {
        throw new Error('Unauthorized');
      }

      const { data, error } = await supabase
        .rpc('delete_subscription_cascade', {
          subscription_id_param: id
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success(isRTL ? "تم حذف الاشتراك بنجاح" : "Subscription deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting subscription:', error);
      toast.error(isRTL ? "حدث خطأ أثناء حذف الاشتراك" : "Error deleting subscription");
    }
  });

  const updateDays = useMutation({
    mutationFn: async ({ id, days }: { id: string; days: number }) => {
      if (!userProfile?.is_super_admin) {
        throw new Error('Unauthorized');
      }

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);
      
      const { error } = await supabase
        .from('subscriptions')
        .update({ end_date: endDate.toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success(isRTL ? "تم تحديث مدة الاشتراك بنجاح" : "Subscription duration updated successfully");
    },
    onError: (error) => {
      console.error('Error updating subscription duration:', error);
      toast.error(isRTL ? "حدث خطأ أثناء تحديث مدة الاشتراك" : "Error updating subscription duration");
    }
  });

  return {
    userProfile,
    isProfileLoading,
    subscriptions,
    isSubscriptionsLoading,
    updateSubscription,
    updateCredentials,
    deleteSubscription,
    updateDays,
    error: profileError
  };
}
