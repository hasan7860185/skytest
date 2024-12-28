import { z } from "zod";

export const propertyFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, {
    message: "يجب أن يكون اسم العقار أكثر من حرفين"
  }),
  type: z.string().min(1, {
    message: "يجب اختيار نوع العقار"
  }),
  area: z.string().optional(),
  location: z.string().optional(),
  price: z.string().optional(),
  description: z.string().optional(),
  owner_phone: z.string().min(1, {
    message: "يجب إدخال رقم هاتف المالك"
  }),
  operating_company: z.string().optional(),
  project_sections: z.string().optional(),
  images: z.array(z.string()).optional(),
  pricePerMeterFrom: z.string().optional(),
  pricePerMeterTo: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;