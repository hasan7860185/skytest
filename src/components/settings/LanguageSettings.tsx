import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function LanguageSettings() {
  const { t } = useTranslation();

  return (
    <Card className="bg-white dark:bg-gray-800/95 border-gray-200 dark:border-gray-700/30">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          {t("settings.language.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LanguageSwitcher />
      </CardContent>
    </Card>
  );
}