import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Task } from "@/components/tasks/taskSchema";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { cn } from "@/lib/utils";
import { DashboardContent } from "@/components/layouts/DashboardContent";

const Tasks = () => {
  const { t, i18n } = useTranslation();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const isRTL = i18n.language === 'ar';

  useRealtimeSubscription('tasks', ['tasks']);

  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('Fetching tasks...');
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles(
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        throw tasksError;
      }

      console.log('Tasks data:', tasksData);
      return tasksData as Task[];
    },
  });

  const handleTaskSuccess = async () => {
    setIsAddingTask(false);
    await refetch();
    toast.success(t("tasks.addSuccess"));
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <DashboardContent>
        {/* Changed the width class to be responsive: default width on mobile, 150% on lg screens */}
        <div className="p-6 pt-20 w-full lg:w-[150%]">
          <div className={cn(
            "flex justify-between items-center mb-6",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <h1 className="text-2xl font-semibold">{t("tasks.title")}</h1>
            <Sheet open={isAddingTask} onOpenChange={setIsAddingTask}>
              <SheetTrigger asChild>
                <Button className={cn(
                  "gap-2",
                  isRTL ? "flex-row-reverse" : ""
                )}>
                  <Plus className="w-4 h-4" />
                  {t("tasks.addTask")}
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "right" : "left"} className="h-[100dvh] overflow-hidden">
                <SheetHeader>
                  <SheetTitle>{t("tasks.addTask")}</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-5rem)] mt-6 pr-4">
                  <TaskForm
                    onSuccess={handleTaskSuccess}
                    onCancel={() => setIsAddingTask(false)}
                  />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          <Card className="p-0">
            <ScrollArea className="h-[600px]">
              {isLoading ? (
                <div className="p-4 text-center">{t("tasks.loading")}</div>
              ) : (
                <TaskList tasks={tasks} />
              )}
            </ScrollArea>
          </Card>
        </div>
      </DashboardContent>
    </div>
  );
};

export default Tasks;