import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export interface UserAvatarProps {
  user: {
    full_name?: string | null;
    avatar?: string | null;
  };
  className?: string;
  onAvatarUpload?: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploading?: boolean;
}

export function UserAvatar({ user, className, onAvatarUpload, uploading }: UserAvatarProps) {
  return (
    <Avatar className={cn("h-10 w-10", className)}>
      <AvatarImage 
        src={user.avatar || undefined} 
        alt={user.full_name || "User avatar"} 
      />
      <AvatarFallback className="bg-primary/10">
        {user.full_name ? (
          <span className="font-medium text-primary">
            {user.full_name.charAt(0).toUpperCase()}
          </span>
        ) : (
          <User className="h-4 w-4 text-primary" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}