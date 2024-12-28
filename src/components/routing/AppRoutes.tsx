import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProtectedRoute } from "./ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardContent } from "@/components/layouts/DashboardContent";

// Lazy load components with proper default exports
const Login = lazy(() => import("@/pages/Login"));
const AIAssistant = lazy(() => import("@/components/ai/AIAssistant").then(module => ({ default: module.AIAssistant })));
const AuthenticatedRoutes = lazy(() => import("./routes/AuthenticatedRoutes").then(module => ({ default: module.AuthenticatedRoutes })));

const LoadingFallback = () => (
  <Skeleton className="w-full h-screen" />
);

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/assistant" element={
          <ProtectedRoute>
            <SidebarProvider>
              <DashboardLayout>
                <DashboardContent>
                  <div className="max-w-4xl mx-auto">
                    <AIAssistant />
                  </div>
                </DashboardContent>
              </DashboardLayout>
            </SidebarProvider>
          </ProtectedRoute>
        } />
        <Route path="/*" element={<AuthenticatedRoutes />} />
      </Routes>
    </Suspense>
  );
}