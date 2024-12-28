import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  due_date: z.date().optional(),
  status: z.string().default("pending"),
  priority: z.string().default("medium"),
  reminder_date: z.date({
    required_error: "Reminder date is required",
  }),
  assigned_to: z.string().nullable(),
});

export type Task = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  priority: string;
  reminder_date: string | null;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  assignee: {
    id: string;
    full_name: string | null;
  } | null;
};