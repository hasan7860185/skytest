import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type UsersHeaderProps = {
  isAdmin: boolean;
  isRTL: boolean;
};

export function UsersHeader({ isAdmin, isRTL }: UsersHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className={cn(
        "text-2xl font-bold",
        isRTL && "font-cairo"
      )}>
        {t("users.title")}
      </h1>
      {isAdmin && (
        <Button onClick={() => navigate("/users/add")}>
          <UserPlus className="ml-2 h-4 w-4" />
          {t("users.addUser")}
        </Button>
      )}
    </div>
  );
}