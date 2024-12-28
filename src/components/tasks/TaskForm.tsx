import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "./taskSchema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BasicFields } from "./form/BasicFields";
import { PriorityField } from "./form/PriorityField";
import { AssigneeField } from "./form/AssigneeField";
import { TaskDateField } from "./TaskDateField";

interface TaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      assigned_to: null,
    },
    mode: "all",
  });

  const createTask = useMutation({
    mutationFn: async (values: z.infer<typeof taskSchema>) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) throw new Error("No user session");

      console.log('Creating task with values:', values);

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: values.title,
          description: values.description,
          priority: values.priority,
          status: values.status,
          created_by: session.session.user.id,
          assigned_to: values.assigned_to,
          reminder_date: values.reminder_date?.toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }
      
      console.log('Task created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(t("tasks.addSuccess"));
      onSuccess();
    },
    onError: (error) => {
      console.error('Error in createTask mutation:', error);
      toast.error(t("tasks.addError"));
    },
  });

  const onSubmit = (values: z.infer<typeof taskSchema>) => {
    console.log('Submitting form with values:', values);
    createTask.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicFields form={form} isRTL={isRTL} />
        <PriorityField form={form} isRTL={isRTL} />
        <AssigneeField form={form} isRTL={isRTL} />
        
        <TaskDateField
          form={form}
          name="reminder_date"
          label={t("tasks.form.reminderDate")}
        />

        <div className={cn(
          "flex justify-end gap-2",
          isRTL && "flex-row-reverse"
        )}>
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("tasks.cancel")}
          </Button>
          <Button type="submit">
            {t("tasks.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}