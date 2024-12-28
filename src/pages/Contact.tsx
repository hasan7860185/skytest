import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { DashboardSidebar } from "@/components/layouts/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { open } = useSidebar();

  return (
    <DashboardLayout>
      <DashboardSidebar open={open} />
      <DashboardContent>
        <div className={cn(
          "container mx-auto p-4",
          isRTL && "font-cairo"
        )} dir={isRTL ? "rtl" : "ltr"}>
          <h1 className="text-2xl font-bold mb-6">{t("contact.title")}</h1>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {t("contact.phone")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href="tel:+201090492570" className="text-lg hover:underline">
                  +201090492570
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {t("contact.email")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href="mailto:samy1432008815@gmail.com" className="text-lg hover:underline">
                  samy1432008815@gmail.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}