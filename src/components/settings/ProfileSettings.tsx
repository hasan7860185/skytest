import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileSettings() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.profile.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("settings.profile.name")}</Label>
          <Input />
        </div>
        <div className="space-y-2">
          <Label>{t("settings.profile.email")}</Label>
          <Input type="email" />
        </div>
        <div className="space-y-2">
          <Label>{t("settings.profile.role")}</Label>
          <Input disabled />
        </div>
        <Button className="w-full">
          {t("settings.profile.save")}
        </Button>
      </CardContent>
    </Card>
  );
}