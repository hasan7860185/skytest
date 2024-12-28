import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientAssignmentInfoProps {
  assignedTo?: string | null;
  userId: string;
}

export function ClientAssignmentInfo({ assignedTo, userId }: ClientAssignmentInfoProps) {
  const { t } = useTranslation();
  const [assignedUser, setAssignedUser] = useState<string>("");
  const [creator, setCreator] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        
        // Fetch assigned user details if exists
        if (assignedTo) {
          const { data: assignedUserData, error: assignedError } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', assignedTo)
            .maybeSingle();

          if (assignedError) {
            console.error('Error fetching assigned user:', assignedError);
            toast.error(t('errors.fetchingUser'));
          } else if (assignedUserData) {
            setAssignedUser(assignedUserData.full_name || t('users.unknown'));
          }
        }

        // Fetch creator details
        const { data: creatorData, error: creatorError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', userId)
          .maybeSingle();

        if (creatorError) {
          console.error('Error fetching creator:', creatorError);
          toast.error(t('errors.fetchingUser'));
        } else if (creatorData) {
          setCreator(creatorData.full_name || t('users.unknown'));
        }

      } catch (error) {
        console.error('Error in fetchUserDetails:', error);
        toast.error(t('errors.general'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [assignedTo, userId, t]);

  if (isLoading) {
    return <div className="animate-pulse h-12 bg-gray-200 rounded" />;
  }

  return (
    <div className="flex flex-col gap-1 text-xs">
      {assignedTo && (
        <Badge variant="outline" className="gap-1 justify-end bg-[#191970]">
          <User className="h-3 w-3" />
          <span className="text-white">{t("clients.assignedTo")}:</span>
          <span>{assignedUser}</span>
        </Badge>
      )}
      <Badge variant="secondary" className="gap-1 justify-end bg-[#191970]">
        <User className="h-3 w-3" />
        <span className="text-white">{t("clients.creator")}:</span>
        <span>{creator}</span>
      </Badge>
    </div>
  );
}