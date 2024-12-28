import { z } from "zod";

export const subscriptionSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  max_users: z.coerce.number().min(1, "Must have at least 1 user"),
  days: z.coerce.number().min(1, "Must be at least 1 day"),
  admin_email: z.string().email("Invalid email address"),
  admin_password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;