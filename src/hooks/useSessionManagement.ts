import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useLocation } from 'react-router-dom';

export const useSessionManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const cleanupSession = async () => {
    console.log("Cleaning up session data");
    
    // Store last path before cleanup
    if (location.pathname !== '/login') {
      localStorage.setItem('lastPath', location.pathname);
    }
    
    // Clear all storage except lastPath and theme
    const lastPath = localStorage.getItem('lastPath');
    const theme = localStorage.getItem('theme');
    localStorage.clear();
    if (lastPath) {
      localStorage.setItem('lastPath', lastPath);
    }
    if (theme) {
      localStorage.setItem('theme', theme);
    }
    sessionStorage.clear();
    
    // Clear Supabase specific items
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.expires_at');
    localStorage.removeItem('supabase.auth.refresh_token');
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  };

  const handleAuthError = async () => {
    try {
      console.log("Handling auth error - signing out");
      await cleanupSession();
      await supabase.auth.signOut();
      toast.error("جلستك انتهت. يرجى تسجيل الدخول مرة أخرى.");
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Force navigation to login even if signOut fails
      navigate('/login');
    }
  };

  const verifySession = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("User verification failed:", error);
        throw error;
      }
      return user;
    } catch (error) {
      console.error("Session verification failed:", error);
      throw error;
    }
  };

  const checkSession = async () => {
    try {
      console.log("Checking session status...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session check error:", error);
        await handleAuthError();
        return;
      }
      
      if (!session) {
        console.log("No active session found");
        await cleanupSession();
        navigate('/login');
        return;
      }
      
      try {
        await verifySession();
        console.log("Active session verified:", session.user?.id);
        
        // If we're on login page and have a valid session, redirect to last path or home
        if (location.pathname === '/login') {
          const lastPath = localStorage.getItem('lastPath');
          if (lastPath && lastPath !== '/login') {
            navigate(lastPath);
          } else {
            navigate('/');
          }
        }
      } catch (error) {
        await handleAuthError();
      }
      
    } catch (error) {
      console.error("Session check failed:", error);
      await handleAuthError();
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Save current path when it changes
    if (location.pathname !== '/login') {
      localStorage.setItem('lastPath', location.pathname);
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        console.log("User signed out or token refreshed, cleaning up...");
        await cleanupSession();
        navigate('/login');
      } else if (event === 'SIGNED_IN') {
        console.log("User signed in");
        const lastPath = localStorage.getItem('lastPath');
        if (lastPath && lastPath !== '/login') {
          navigate(lastPath);
        } else {
          navigate('/');
        }
      }
    });

    // Check session on mount and when returning to the tab
    checkSession();
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSession();
      }
    };

    // Handle page reload and visibility changes
    window.addEventListener('load', checkSession);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
      window.removeEventListener('load', checkSession);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate, location.pathname]);

  return { handleAuthError };
};