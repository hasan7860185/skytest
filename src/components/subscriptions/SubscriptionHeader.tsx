import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddSubscriptionForm } from "./AddSubscriptionForm";

interface SubscriptionHeaderProps {
  title: string;
  isRTL: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function SubscriptionHeader({ title, isRTL, isDialogOpen, setIsDialogOpen }: SubscriptionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className={cn(
        "text-2xl font-bold",
        isRTL && "font-cairo text-right"
      )}>
        {title}
      </h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className={cn(
            "flex items-center gap-2",
            isRTL && "flex-row-reverse font-cairo"
          )}>
            <Plus className="h-4 w-4" />
            {isRTL ? "إضافة اشتراك" : "Add Subscription"}
          </Button>
        </DialogTrigger>
        <DialogContent className={cn(
          "max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800/95 border-gray-200 dark:border-gray-700/30",
          isRTL && "font-cairo"
        )}>
          <DialogHeader>
            <DialogTitle className={cn(
              isRTL && "text-right",
              "text-foreground dark:text-gray-100"
            )}>
              {isRTL ? "إضافة اشتراك جديد" : "Add New Subscription"}
            </DialogTitle>
          </DialogHeader>
          <AddSubscriptionForm 
            onSuccess={() => setIsDialogOpen(false)}
            isRTL={isRTL}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}