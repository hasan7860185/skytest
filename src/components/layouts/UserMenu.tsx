import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserProfileDialog } from "./UserProfileDialog";

export function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    avatar: string | null;
    email: string | null;
  } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session?.user) {
        navigate('/login');
        return;
      }

      // First try to get user email from session
      const userEmail = session.user.email;
      
      // Then fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setProfile({
          full_name: session.user.user_metadata?.full_name || null,
          avatar: null,
          email: userEmail
        });
        return;
      }

      setProfile({
        ...profileData,
        email: userEmail,
      });
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      const session = await supabase.auth.getSession();
      if (session.data.session?.user) {
        setProfile({
          full_name: session.data.session.user.user_metadata?.full_name || null,
          avatar: null,
          email: session.data.session.user.email
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any cached data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      navigate('/login');
      toast.success(t("settings.auth.logoutSuccess"));
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(t("settings.auth.logoutError"));
    }
  };

  // If no profile at all, show loading state
  if (!profile) {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
        <Avatar className="h-9 w-9">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 md:h-11 md:w-11 rounded-full p-0"
          >
            <Avatar className="h-9 w-9 md:h-10 md:w-10">
              {profile.avatar ? (
                <AvatarImage 
                  src={profile.avatar} 
                  alt={profile.full_name || 'User avatar'} 
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback>
                {profile?.full_name?.slice(0, 2)?.toUpperCase() || profile?.email?.slice(0, 2)?.toUpperCase() || "UN"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {profile?.full_name && (
                <p className="font-medium">{profile.full_name}</p>
              )}
              {profile?.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {profile.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
            <User className="ml-2 h-4 w-4" />
            <span>{t("settings.profile.title")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="ml-2 h-4 w-4" />
            <span>{t("settings.auth.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileDialog
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        profile={profile}
        onProfileUpdate={setProfile}
      />
    </>
  );
}