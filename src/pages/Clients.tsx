import { useTranslation } from "react-i18next";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { ClientsList } from "@/components/ClientsList";
import { useParams } from "react-router-dom";

export default function Clients() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { status = "all" } = useParams();

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <DashboardContent>
        <div className="p-8 pt-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div>
            <ClientsList status={status} />
          </div>
        </div>
      </DashboardContent>
    </div>
  );
}