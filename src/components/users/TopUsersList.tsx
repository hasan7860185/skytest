import { TopUser } from "@/types/userTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { UserActionsHoverCard } from "./UserActionsHoverCard";
import { Crown } from "lucide-react";

interface TopUsersListProps {
  users: TopUser[];
  isRTL: boolean;
}

export function TopUsersList({ users, isRTL }: TopUsersListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <div
          key={user.user_id}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-sm font-medium text-gray-500 dark:text-gray-400 w-6",
              isRTL && "font-cairo text-right"
            )}>
              #{index + 1}
            </span>
            <div className="relative">
              {index === 0 && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce">
                  <Crown className="w-6 h-6" />
                </div>
              )}
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || ''} alt={user.full_name || ''} />
                <AvatarFallback>
                  {user.full_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-medium text-sm",
                isRTL && "font-cairo text-right"
              )}>
                {user.full_name || t('clients.common.unnamed')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user.role || t('users.roles.employee')}
              </span>
            </div>
          </div>
          <UserActionsHoverCard 
            userId={user.user_id}
            actionCount={user.action_count}
            isRTL={isRTL}
          />
        </div>
      ))}
    </div>
  );
}