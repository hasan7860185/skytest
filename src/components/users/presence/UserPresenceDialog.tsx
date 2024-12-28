import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/users/UserAvatar";
import { cn } from "@/lib/utils";
import { UserDetails } from "@/types/userTypes";

interface UserPresenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogTitle: string;
  usersList: UserDetails[];
  isRTL: boolean;
}

export function UserPresenceDialog({
  open,
  onOpenChange,
  dialogTitle,
  usersList,
  isRTL,
}: UserPresenceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={cn(isRTL && "font-cairo text-right")}>
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            {usersList.map((user) => (
              <div 
                key={user.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800",
                  isRTL && "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "flex items-center gap-3",
                  isRTL && "flex-row-reverse"
                )}>
                  <UserAvatar user={user} />
                  <div className={cn(
                    "flex flex-col",
                    isRTL && "items-end"
                  )}>
                    <span className="font-medium">{user.full_name}</span>
                    <span className="text-sm text-gray-500">{user.role}</span>
                  </div>
                </div>
              </div>
            ))}
            {usersList.length === 0 && (
              <div className={cn(
                "text-center text-gray-500 py-4",
                isRTL && "font-cairo"
              )}>
                {isRTL ? "لا يوجد مستخدمين" : "No users found"}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}