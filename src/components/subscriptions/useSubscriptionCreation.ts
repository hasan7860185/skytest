import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { SubscriptionFormData } from "./types";
import { generatePathSegment, generateSubdomain } from "./utils";

export function useSubscriptionCreation(isRTL: boolean, onSuccess: () => void) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const createSubscription = async (data: SubscriptionFormData) => {
    setIsLoading(true);
    try {
      // First, get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(isRTL 
          ? "يجب عليك تسجيل الدخول أولاً" 
          : "You must be logged in");
        return;
      }

      // Then check if the current user is a super admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_super_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile?.is_super_admin) {
        toast.error(isRTL 
          ? "ليس لديك صلاحية لإضافة اشتراكات. يجب أن تكون مسؤولاً متميزاً" 
          : "You don't have permission to add subscriptions. Must be a super admin");
        return;
      }

      // Create the company first
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.company_name,
          user_id: user.id,
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Try to sign up the admin user for the subscription
      let adminUser;
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.admin_email,
        password: data.admin_password,
        options: {
          data: {
            full_name: `${data.company_name} Admin`,
            role: 'admin',
          },
        }
      });

      // Handle user already exists case
      if (signUpError?.message?.includes('User already registered')) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.admin_email,
          password: data.admin_password,
        });

        if (signInError) {
          toast.error(isRTL 
            ? "كلمة المرور غير صحيحة للمستخدم الموجود" 
            : "Incorrect password for existing user");
          return;
        }
        adminUser = signInData.user;
      } else if (signUpError) {
        throw signUpError;
      } else {
        adminUser = signUpData.user;
      }

      if (!adminUser) {
        throw new Error("Failed to create or find admin user");
      }

      // Update admin user profile
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          company_id: companyData.id,
          role: 'admin',
          is_enabled: true,
          is_super_admin: false,
          full_name: `${data.company_name} Admin`,
        })
        .eq('id', adminUser.id);

      if (updateProfileError) throw updateProfileError;

      // Generate unique path segment and subdomain with timestamp
      const timestamp = Date.now().toString().slice(-6);
      const basePathSegment = generatePathSegment(data.company_name);
      const pathSegment = `${basePathSegment}-${timestamp}`;
      const subdomain = generateSubdomain(data.company_name);

      // Calculate end date
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + data.days);

      // Create subscription with all required fields
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          company_id: companyData.id,
          company_name: data.company_name,
          max_users: data.max_users,
          path_segment: pathSegment,
          end_date: endDate.toISOString(),
          is_active: true,
          admin_email: data.admin_email,
          admin_password: data.admin_password,
          start_date: new Date().toISOString(),
        });

      if (subscriptionError) throw subscriptionError;

      // Create domain
      const { error: domainError } = await supabase
        .from('domains')
        .insert({
          company_id: companyData.id,
          subdomain: subdomain,
          path_segment: pathSegment,
          is_active: true,
        });

      if (domainError) {
        if (domainError.code === '23505') {
          toast.error(isRTL 
            ? "عنوان URL هذا مستخدم بالفعل. سيتم إنشاء عنوان URL فريد تلقائياً." 
            : "This URL is already taken. A unique URL will be generated automatically.");
        } else {
          throw domainError;
        }
      }

      toast.success(isRTL ? 'تم إضافة الاشتراك بنجاح' : 'Subscription added successfully');
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      onSuccess();
    } catch (error: any) {
      console.error('Error adding subscription:', error);
      let errorMessage = isRTL ? 'حدث خطأ أثناء إضافة الاشتراك' : 'Error adding subscription';
      
      if (error?.message?.includes('domains_subdomain_key')) {
        errorMessage = isRTL 
          ? 'هذا النطاق الفرعي مستخدم بالفعل. يرجى المحاولة مرة أخرى' 
          : 'This subdomain is already taken. Please try again';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createSubscription, isLoading };
}