import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "هذا الحقل مطلوب"),
  phone: z.string().min(1, "هذا الحقل مطلوب"),
  email: z.string().optional(),
  facebook: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  project: z.string().optional(),
  budget: z.string().optional(),
  campaign: z.string().optional(),
  status: z.string().optional(),
  salesPerson: z.string().optional(),
  contactMethod: z.string().optional(),
  user_id: z.string().optional(),
  postUrl: z.string().optional(),
  comment: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;