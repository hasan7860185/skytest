import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  change: {
    value: number;
    type: 'increase' | 'decrease';
  };
  bgColor: string;
  iconBgColor: string;
  isRTL: boolean;
}

export function StatCard({ 
  icon, 
  title, 
  value, 
  change, 
  bgColor,
  iconBgColor,
  isRTL 
}: StatCardProps) {
  return (
    <Card className={cn(
      "bg-white hover:shadow-md transition-all duration-300",
      "border border-gray-100",
      "relative overflow-hidden"
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className={cn(
            "space-y-1",
            isRTL && "text-right"
          )}>
            <p className={cn(
              "text-sm text-gray-600",
              isRTL && "font-cairo"
            )}>
              {title}
            </p>
            <h2 className={cn(
              "text-3xl font-bold text-gray-900",
              isRTL && "font-cairo"
            )}>
              {value}
            </h2>
            <p className={cn(
              "text-sm",
              change.type === 'increase' ? "text-green-600" : "text-red-600",
              "flex items-center gap-1",
              isRTL && "flex-row-reverse"
            )}>
              {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              <span className={cn(
                "text-gray-600",
                isRTL && "font-cairo"
              )}>
                {isRTL ? "مقارنة بالفترة السابقة" : "vs last period"}
              </span>
            </p>
          </div>
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center",
            iconBgColor,
            "bg-opacity-20"
          )}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
}