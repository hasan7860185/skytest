import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { SubscriptionCredentials } from "./SubscriptionCredentials";

interface SubscriptionCardProps {
  subscription: {
    id: string;
    company_name: string;
    path_segment: string;
    is_active: boolean;
    max_users: number;
    admin_email: string | null;
    admin_password: string | null;
    end_date: string;
    start_date: string;
  };
  onDelete: (id: string) => void;
  onUpdate: (id: string, max_users: number) => void;
  onCredentialsUpdate: (id: string, email: string, password: string) => void;
  onDaysUpdate: (id: string, days: number) => void;
  isRTL: boolean;
  isUpdating?: boolean;
}

export function SubscriptionCard({
  subscription,
  onDelete,
  onUpdate,
  onCredentialsUpdate,
  onDaysUpdate,
  isRTL,
  isUpdating
}: SubscriptionCardProps) {
  const [showDaysEdit, setShowDaysEdit] = useState(false);
  const [days, setDays] = useState(() => {
    const start = new Date(subscription.start_date);
    const end = new Date(subscription.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });

  const handleDaysUpdate = () => {
    onDaysUpdate(subscription.id, days);
    setShowDaysEdit(false);
  };

  return (
    <Card className="p-6">
      <div className={cn(
        "flex justify-between items-start",
        isRTL && "flex-row-reverse"
      )}>
        <div className={cn(
          "space-y-4 w-full",
          isRTL && "text-right"
        )}>
          <h3 className="font-semibold">{subscription.company_name}</h3>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-500">
              {isRTL ? "الرابط المخصص:" : "Custom URL:"}
            </label>
            <Input 
              value={`${window.location.origin}/${subscription.path_segment}`}
              readOnly
              className="font-mono bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-500">
              {isRTL ? "عدد المستخدمين:" : "Max Users:"}
            </label>
            <Input 
              type="number"
              value={subscription.max_users}
              onChange={(e) => onUpdate(subscription.id, parseInt(e.target.value))}
              min={1}
              className="max-w-[200px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-500">
              {isRTL ? "مدة الاشتراك (بالأيام):" : "Subscription Duration (days):"}
            </label>
            {showDaysEdit ? (
              <div className="flex items-center gap-2">
                <Input 
                  type="number"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  min={1}
                  className="max-w-[200px]"
                />
                <Button 
                  onClick={handleDaysUpdate}
                  disabled={isUpdating}
                  className={cn(isRTL && "font-cairo")}
                >
                  {isRTL ? "حفظ" : "Save"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowDaysEdit(false)}
                  disabled={isUpdating}
                  className={cn(isRTL && "font-cairo")}
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input 
                  value={days}
                  readOnly
                  className="max-w-[200px] bg-gray-50"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowDaysEdit(true)}
                  className={cn(isRTL && "font-cairo")}
                >
                  {isRTL ? "تعديل" : "Edit"}
                </Button>
              </div>
            )}
          </div>

          <SubscriptionCredentials
            adminEmail={subscription.admin_email}
            adminPassword={subscription.admin_password}
            onUpdate={(email, password) => onCredentialsUpdate(subscription.id, email, password)}
            isRTL={isRTL}
            isUpdating={isUpdating}
          />

          <SubscriptionStatus 
            isActive={subscription.is_active} 
            isRTL={isRTL}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                className={cn(
                  "mt-4",
                  isRTL && "font-cairo"
                )}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isRTL ? "حذف الاشتراك" : "Delete Subscription"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isRTL ? "هل أنت متأكد؟" : "Are you sure?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isRTL 
                    ? "سيتم حذف هذا الاشتراك بشكل نهائي. لا يمكن التراجع عن هذا الإجراء."
                    : "This subscription will be permanently deleted. This action cannot be undone."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {isRTL ? "إلغاء" : "Cancel"}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(subscription.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isRTL ? "حذف" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}