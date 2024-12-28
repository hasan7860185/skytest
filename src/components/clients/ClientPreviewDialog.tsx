import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "react-i18next"
import { Client } from "@/data/clientsData"
import { ClientDetailsTab } from "./preview/ClientDetailsTab"
import { ClientActionsTab } from "./preview/ClientActionsTab"
import { ClientCommentsTab } from "./preview/ClientCommentsTab"
import { ClientAnalysisTab } from "./preview/ClientAnalysisTab"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface ClientPreviewDialogProps {
  client: Client
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientPreviewDialog({ client, open, onOpenChange }: ClientPreviewDialogProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const isMobile = useIsMobile()

  const tabNames = {
    details: isRTL ? "التفاصيل" : "Details",
    actions: isRTL ? "الإجراءات" : "Actions",
    comments: isRTL ? "التعليقات" : "Comments",
    analysis: isRTL ? "التحليلات" : "Analysis"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "max-w-3xl w-[95vw] p-4 md:p-6 overflow-hidden",
          isMobile ? "h-[95vh]" : "",
          "bg-background dark:bg-background-dark"
        )}
      >
        <ScrollArea className="h-full w-full pr-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className={cn(
              "grid w-full bg-background dark:bg-background-dark rounded-lg p-4 mb-8",
              "grid-cols-4 gap-2",
              "sticky top-0 z-10",
              "shadow-sm border border-border/50"
            )}>
              <TabsTrigger 
                value="details" 
                className={cn(
                  "text-sm font-medium transition-all",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  "hover:bg-muted/50",
                  "rounded-md shadow-sm border border-border/50",
                  isMobile && "py-2 px-1 text-xs"
                )}
              >
                {tabNames.details}
              </TabsTrigger>
              <TabsTrigger 
                value="actions" 
                className={cn(
                  "text-sm font-medium transition-all",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  "hover:bg-muted/50",
                  "rounded-md shadow-sm border border-border/50",
                  isMobile && "py-2 px-1 text-xs"
                )}
              >
                {tabNames.actions}
              </TabsTrigger>
              <TabsTrigger 
                value="comments" 
                className={cn(
                  "text-sm font-medium transition-all",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  "hover:bg-muted/50",
                  "rounded-md shadow-sm border border-border/50",
                  isMobile && "py-2 px-1 text-xs"
                )}
              >
                {tabNames.comments}
              </TabsTrigger>
              <TabsTrigger 
                value="analysis" 
                className={cn(
                  "text-sm font-medium transition-all",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  "hover:bg-muted/50",
                  "rounded-md shadow-sm border border-border/50",
                  isMobile && "py-2 px-1 text-xs"
                )}
              >
                {tabNames.analysis}
              </TabsTrigger>
            </TabsList>
            
            <div className={cn(
              "mt-8 space-y-6",
              isMobile ? "px-2" : "",
              "transition-all duration-200"
            )}>
              <TabsContent value="details">
                <ClientDetailsTab client={client} />
              </TabsContent>
              
              <TabsContent value="actions">
                <ClientActionsTab client={client} />
              </TabsContent>
              
              <TabsContent value="comments">
                <ClientCommentsTab client={client} />
              </TabsContent>

              <TabsContent value="analysis">
                <ClientAnalysisTab client={client} />
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}