import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormData } from "./formSchema";
import { ClientFormFields } from "./ClientFormFields";
import { arabCountries } from "@/data/countries";
import { useTranslation } from "react-i18next";
import { ClientStatus } from "@/types/client";

interface ClientFormProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: {
    name: string;
    phone: string;
    email?: string;
    facebook?: string;
    country: string;
    city?: string;
    project?: string;
    status: ClientStatus;
    postUrl?: string;
    comment?: string;
  };
}

export function ClientForm({ onSubmit, defaultValues }: ClientFormProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      facebook: "",
      country: "",
      city: "",
      project: "",
      budget: "",
      salesPerson: "",
      contactMethod: "phone",
      status: "new",
      postUrl: "",
      comment: ""
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ClientFormFields
          form={form}
          countries={arabCountries}
          projects={[]}
          salesPersons={[]}
          contactMethods={["phone", "whatsapp", "email", "facebook"]}
        />
        <Button type="submit" className="w-full">
          {isRTL ? "حفظ التغييرات" : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}