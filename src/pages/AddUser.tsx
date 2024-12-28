import { useTranslation } from "react-i18next";
import { UserForm } from "@/components/forms/UserForm";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DashboardContent } from "@/components/layouts/DashboardContent";

export default function AddUser() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  return (
    <DashboardContent>
      <div className="p-8 pt-20">
        <div className="max-w-2xl mx-auto">
          <h1 className={cn(
            "text-2xl font-bold mb-6",
            "text-gray-900 dark:text-white",
            isRTL && "font-cairo text-right"
          )}>
            {isRTL ? "إضافة مستخدم جديد" : "Add New User"}
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <UserForm
              onSuccess={() => navigate("/users")}
              onCancel={() => navigate("/users")}
              onUpdate={() => navigate("/users")}
            />
          </div>
        </div>
      </div>
    </DashboardContent>
  );
}