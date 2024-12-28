import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreVertical, Trash, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Task {
  id: string;
  status: string;
}

interface TaskActionsProps {
  task: Task;
}

export function TaskActions({ task }: TaskActionsProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateStatus = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', task.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(t("tasks.statusUpdated"));
    },
  });

  const deleteTask = useMutation({
    mutationFn: async () => {
      setIsDeleting(true);
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) {
        console.error('Delete task error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(t("tasks.deleted"));
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      console.error('Delete task error:', error);
      toast.error(t("tasks.deleteError"));
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      await deleteTask.mutateAsync();
    } catch (error) {
      console.error('Error in handleDelete:', error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {task.status !== "completed" && (
            <DropdownMenuItem onClick={() => updateStatus.mutate()}>
              <CheckCircle className="mr-2 h-4 w-4" />
              {t("tasks.markAsCompleted")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 dark:text-red-400"
            disabled={isDeleting}
          >
            <Trash className="mr-2 h-4 w-4" />
            {t("tasks.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("tasks.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("tasks.deleteConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}