import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProjectForm } from "../project-form/ProjectForm";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectCard } from "./project/ProjectCard";
import { DeleteProjectDialog } from "./project/DeleteProjectDialog";
import { ViewProjectDialog } from "./project/ViewProjectDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CompanyProjectsProps {
  companyId: string;
  isRTL: boolean;
}

export function CompanyProjects({ companyId, isRTL }: CompanyProjectsProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast.success(isRTL ? 'تم حذف المشروع بنجاح' : 'Project deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['projects', companyId] });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء حذف المشروع' : 'Error deleting project');
    }
  };

  const filteredProjects = projects?.filter(project => {
    const searchLower = searchQuery.toLowerCase();
    return (
      project.name?.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower) ||
      project.location?.toLowerCase().includes(searchLower) ||
      project.engineering_consultant?.toLowerCase().includes(searchLower) ||
      project.operating_company?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="mt-8 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className={cn(
        "mt-8 text-center py-12 border rounded-lg",
        "dark:border-gray-700 dark:text-gray-400",
        isRTL && "font-cairo"
      )}>
        {isRTL ? "لا توجد مشاريع حالياً" : "No projects yet"}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className={cn(
        "flex flex-col md:flex-row items-center justify-between gap-4",
        isRTL && "md:flex-row-reverse"
      )}>
        <h2 className={cn(
          "text-xl font-semibold",
          "dark:text-gray-100",
          isRTL && "font-cairo text-right"
        )}>
          {isRTL ? "المشاريع" : "Projects"}
        </h2>
        
        <div className="relative w-full md:w-64">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400",
            isRTL ? "right-3" : "left-3"
          )} />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? "ابحث عن مشروع..." : "Search projects..."}
            className={cn(
              "pl-10",
              "bg-white/5 dark:bg-gray-800/50",
              "border-gray-200/20 dark:border-gray-700/30",
              "text-gray-700 dark:text-gray-100",
              "placeholder:text-gray-500 dark:placeholder:text-gray-400",
              isRTL && "font-cairo text-right pr-10 pl-4"
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isRTL={isRTL}
            onView={() => {
              setSelectedProject(project);
              setIsViewDialogOpen(true);
            }}
            onEdit={() => {
              setSelectedProject(project);
              setIsEditDialogOpen(true);
            }}
            onDelete={() => {
              setSelectedProject(project);
              setIsDeleteDialogOpen(true);
            }}
          />
        ))}
      </div>

      <DeleteProjectDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => selectedProject && handleDelete(selectedProject.id)}
        isRTL={isRTL}
      />

      <ViewProjectDialog
        project={selectedProject}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        isRTL={isRTL}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800">
          <ProjectForm
            companyId={companyId}
            project={selectedProject}
            onSuccess={() => setIsEditDialogOpen(false)}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}