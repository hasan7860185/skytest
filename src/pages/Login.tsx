import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error checking session:', error);
        return;
      }
      
      if (session) {
        navigate("/");
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام إدارة العقارات</h1>
            <p className="text-gray-600">قم بتسجيل الدخول للوصول إلى لوحة التحكم</p>
          </div>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#8B5CF6',
                    brandAccent: '#7C3AED',
                  },
                },
              },
              className: {
                container: 'font-cairo',
                button: 'font-cairo w-full bg-primary hover:bg-primary/90',
                input: 'font-cairo text-right',
                label: 'font-cairo text-right',
                message: 'font-cairo text-right text-red-500',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'البريد الإلكتروني',
                  password_label: 'كلمة المرور',
                  button_label: 'تسجيل الدخول',
                  email_input_placeholder: 'أدخل بريدك الإلكتروني',
                  password_input_placeholder: 'أدخل كلمة المرور',
                  loading_button_label: 'جاري تسجيل الدخول...',
                }
              },
            }}
            theme="light"
            providers={[]}
            view="sign_in"
          />
        </div>
      </div>
    </div>
  );
}