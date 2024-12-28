import { ActivityLogsView } from "@/components/activity/ActivityLogsView";
import { PageLayout } from "@/components/layouts/PageLayout";

const ActivityLogs = () => {
  return (
    <PageLayout>
      <div className="max-w-screen-xl mx-auto">
        <ActivityLogsView />
      </div>
    </PageLayout>
  );
};

export default ActivityLogs;