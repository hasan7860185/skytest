import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ThemeSettings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const isRTL = i18n.language === 'ar';

  return (
    <Card className="bg-white dark:bg-gray-800/95 border-gray-200 dark:border-gray-700/30">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          {t("settings.theme.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-gray-700 dark:text-gray-300">
            {t("settings.theme.light")}
          </Label>
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            size="sm"
            className="dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            {t("settings.theme.light")}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-gray-700 dark:text-gray-300">
            {t("settings.theme.dark")}
          </Label>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            size="sm"
            className="dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            {t("settings.theme.dark")}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-gray-700 dark:text-gray-300">
            {t("settings.theme.system")}
          </Label>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            onClick={() => setTheme("system")}
            size="sm"
            className="dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            {t("settings.theme.system")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}