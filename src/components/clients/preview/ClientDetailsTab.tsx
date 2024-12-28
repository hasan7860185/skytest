import { useTranslation } from "react-i18next";
import { Client } from "@/types/client";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Facebook, MapPin, Building, User, MessageSquare } from "lucide-react";

interface ClientDetailsTabProps {
  client: Client;
}

export function ClientDetailsTab({ client }: ClientDetailsTabProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const details = [
    { icon: Phone, label: "clients.form.phone", value: client.phone },
    { icon: Mail, label: "clients.form.email", value: client.email },
    { icon: Facebook, label: "clients.form.facebook", value: client.facebook },
    { icon: MapPin, label: "clients.form.country", value: client.country },
    { icon: MapPin, label: "clients.form.city", value: client.city },
    { icon: Building, label: "clients.form.project", value: client.project },
    { icon: User, label: "clients.form.salesPerson", value: client.salesPerson },
    { icon: MessageSquare, label: "clients.form.comments", value: client.comments?.join(', ') }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            {client.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.map(({ icon: Icon, label, value }) => value && (
              <div key={label} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t(label)}</p>
                  <p className="font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}