import { User } from "@/types/user";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, UserPlus, Lock, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteUserDialog } from "../DeleteUserDialog";
import { EditUserDialog } from "../EditUserDialog";
import { AdminUserButton } from "../AdminUserButton";
import { UserEnableButton } from "../UserEnableButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PasswordResetButton } from "./PasswordResetButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { UserSessionsDialog } from "../sessions/UserSessionsDialog";
import { UserAvatar } from "../UserAvatar";

interface UserTableRowProps {
  user: User;
  isAdmin: boolean;
  isRTL: boolean;
  getRoleLabel: (role: string | null) => string;
  getStatusLabel: (status: string | null) => string;
  refetch: () => void;
}

export function UserTableRow({ 
  user, 
  isAdmin, 
  isRTL, 
  getRoleLabel,
  getStatusLabel,
  refetch 
}: UserTableRowProps) {
  const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false);

  // Fetch active sessions count for this user
  const { data: activeSessions } = useQuery({
    queryKey: ['activeSessions', user.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_active_sessions');
      if (error) throw error;
      
      // Find sessions for this specific user
      const userSessions = data.find(session => session.user_id === user.id);
      return userSessions?.active_sessions || 0;
    }
  });

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <TableCell className="w-12">
        <input type="checkbox" className="rounded border-gray-300" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <UserAvatar 
            user={user} 
            className="h-8 w-8"
          />
          <div className="flex flex-col">
            <span className="font-medium">{user.full_name}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>{getRoleLabel(user.role)}</TableCell>
      <TableCell>
        <Button
          variant={user.status === 'active' ? "default" : "secondary"}
          size="sm"
          className={cn(
            user.status === 'active' ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-200",
            "text-white"
          )}
        >
          {getStatusLabel(user.status)}
        </Button>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            {/* Sessions Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSessionsDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Lock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{activeSessions}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isRTL ? "عرض الأجهزة النشطة" : "View active devices"}
              </TooltipContent>
            </Tooltip>

            {isAdmin && (
              <>
                {/* Password Reset Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PasswordResetButton 
                      email={user.email || ''} 
                      isRTL={isRTL}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isRTL ? "إعادة تعيين كلمة المرور" : "Reset Password"}
                  </TooltipContent>
                </Tooltip>

                {/* Edit Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <EditUserDialog
                      user={user}
                      onUpdate={refetch}
                      editText={<Edit2 className="h-4 w-4 text-blue-500" />}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isRTL ? "تعديل المستخدم" : "Edit User"}
                  </TooltipContent>
                </Tooltip>

                {/* Delete Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DeleteUserDialog
                      userId={user.id}
                      userName={user.full_name || ''}
                      onDelete={refetch}
                      deleteText={<Trash2 className="h-4 w-4 text-red-500" />}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isRTL ? "حذف المستخدم" : "Delete User"}
                  </TooltipContent>
                </Tooltip>

                {/* Admin Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AdminUserButton userId={user.id} />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isRTL ? "تعيين كمسؤول" : "Set as Admin"}
                  </TooltipContent>
                </Tooltip>

                {/* Enable/Disable Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <UserEnableButton userId={user.id} />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isRTL ? "تفعيل/تعطيل المستخدم" : "Enable/Disable User"}
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </TooltipProvider>
        </div>

        <UserSessionsDialog
          open={sessionsDialogOpen}
          onOpenChange={setSessionsDialogOpen}
          userId={user.id}
          isRTL={isRTL}
          refetch={refetch}
        />
      </TableCell>
    </TableRow>
  );
}