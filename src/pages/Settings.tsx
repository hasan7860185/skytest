import { useTranslation } from "react-i18next";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { cn } from "@/lib/utils";
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { NotificationSoundUpload } from "@/components/settings/NotificationSoundUpload";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <DashboardContent>
        <div className={cn(
          "container mx-auto p-4 pt-20 space-y-4",
          isRTL && "font-cairo"
        )} dir={isRTL ? "rtl" : "ltr"}>
          <h1 className="text-2xl font-bold">{t("settings.title")}</h1>

          <div className="grid gap-4 md:grid-cols-2">
            <ThemeSettings />
            <LanguageSettings />
            <NotificationSettings />
            <NotificationSoundUpload />
          </div>
        </div>
      </DashboardContent>
    </div>
  );
}