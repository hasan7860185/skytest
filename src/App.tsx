import { TooltipProvider } from "@/components/ui/tooltip";
import "./i18n/config";
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { CapacitorProvider } from "@/components/providers/CapacitorProvider";
import { Suspense } from "react";
import { Skeleton } from "./components/ui/skeleton";

function App() {
  const { handleAuthError } = useSessionManagement();

  return (
    <QueryProvider onAuthError={handleAuthError}>
      <TooltipProvider>
        <Toaster />
        <CapacitorProvider>
          <Suspense fallback={<Skeleton className="w-full h-screen" />}>
            <div className="min-h-screen">
              <AppRoutes />
            </div>
          </Suspense>
        </CapacitorProvider>
      </TooltipProvider>
    </QueryProvider>
  );
}

export default App;