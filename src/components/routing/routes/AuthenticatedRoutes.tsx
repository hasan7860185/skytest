import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import CompanyDetails from "@/components/layouts/CompanyDetails";
import Index from "@/pages/Index";
import Properties from "@/pages/Properties";
import Companies from "@/pages/Companies";
import AddCompany from "@/pages/AddCompany";
import Clients from "@/pages/Clients";
import Tasks from "@/pages/Tasks";
import Settings from "@/pages/Settings";
import Contact from "@/pages/Contact";
import AddProperty from "@/pages/AddProperty";
import Analytics from "@/pages/Analytics";
import Chat from "@/pages/Chat";
import Notifications from "@/pages/Notifications";
import Users from "@/pages/Users";
import AddUser from "@/pages/AddUser";
import Guides from "@/pages/Guides";
import SalesGuide from "@/pages/guides/SalesGuide";
import ClientManagement from "@/pages/guides/ClientManagement";
import ProjectManagement from "@/pages/guides/ProjectManagement";
import Suggestions from "@/pages/Suggestions";
import Regions from "@/pages/Regions";
import AndroidDownload from "@/pages/AndroidDownload";
import Subscriptions from "@/pages/Subscriptions";
import ActivityLogs from "@/pages/ActivityLogs";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardLayout>
      <DashboardContent>
        {children}
      </DashboardContent>
    </DashboardLayout>
  );
};

export function AuthenticatedRoutes() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Analytics />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/activity-logs" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <ActivityLogs />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/regions" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Regions />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        {/* Add the new route before the detail route */}
        <Route path="/companies/add" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <AddCompany />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/companies/:id" element={<ProtectedRoute><CompanyDetails /></ProtectedRoute>} />
        <Route path="/properties" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Properties />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/companies" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Companies />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/clients" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Clients />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/clients/:status" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Clients />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Tasks />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Settings />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/properties/add" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <AddProperty />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/guides" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Guides />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/guides/sales" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <SalesGuide />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/guides/client-management" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <ClientManagement />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/guides/project-management" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <ProjectManagement />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Users />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/users/add" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <AddUser />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Chat />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Notifications />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/contact" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Contact />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        <Route path="/suggestions" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Suggestions />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        
        {/* Add the Subscriptions route */}
        <Route path="/subscriptions" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Subscriptions />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
        
        <Route path="/android-download" element={
          <ProtectedRoute>
            <LayoutWrapper>
              <AndroidDownload />
            </LayoutWrapper>
          </ProtectedRoute>
        } />
      </Routes>
    </SidebarProvider>
  );
}
