import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { SubscriptionManager } from "./SubscriptionManager";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionDialogProps {
  companyId: string;
  companyName: string;
  isRTL: boolean;
}

export function SubscriptionDialog({ companyId, companyName, isRTL }: SubscriptionDialogProps) {
  const [open, setOpen] = useState(false);

  // Get current user's email and role
  const { data: userInfo } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      return {
        email: session.user.email,
        role: profile?.role
      };
    }
  });

  // Only show for admin or specific email
  if (!userInfo || (userInfo.role !== 'admin' && userInfo.email !== 'samy1432008815@gmail.com')) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className={cn(
            "gap-2",
            isRTL && "flex-row-reverse font-cairo"
          )}
        >
          <Settings className="h-4 w-4" />
          {isRTL ? "إدارة الاشتراك" : "Manage Subscription"}
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "sm:max-w-[425px]",
        "bg-background dark:bg-gray-900",
        "border-gray-200 dark:border-gray-800"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            isRTL && "text-right font-cairo",
            "text-foreground dark:text-gray-100"
          )}>
            {isRTL ? "إدارة الاشتراك" : "Manage Subscription"}
          </DialogTitle>
        </DialogHeader>
        <SubscriptionManager 
          companyId={companyId}
          companyName={companyName}
          isRTL={isRTL}
        />
      </DialogContent>
    </Dialog>
  );
}