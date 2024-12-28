import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface StatusCardProps {
  label: string;
  count: number;
  total: number;
  Icon: LucideIcon;
  status: string;
}

export const StatusCard = ({ label, count, total, Icon, status }: StatusCardProps) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Get icon color based on status
  const getIconColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-[#4285F4]'; // Reverted to light blue
      case 'contacted':
        return 'bg-[#34A853]'; // Green
      case 'interested':
        return 'bg-[#A142F4]'; // Purple
      case 'not_interested':
        return 'bg-[#EA4335]'; // Red
      case 'post_meeting':
        return 'bg-[#4285F4]'; // Reverted to light blue
      case 'scheduled':
        return 'bg-[#FBBC05]'; // Yellow
      case 'resale':
        return 'bg-[#00BCD4]'; // Cyan
      case 'postponed':
        return 'bg-[#E91E63]'; // Pink
      case 'sold':
        return 'bg-[#34A853]'; // Green
      case 'cancelled':
        return 'bg-[#9E9E9E]'; // Gray
      default:
        return 'bg-[#4285F4]'; // Reverted to light blue
    }
  };

  return (
    <Link to={`/clients/${status}`}>
      <Card className={cn(
        "bg-white",
        "hover:shadow-lg",
        "transition-all duration-300 cursor-pointer",
        "border border-gray-100",
        "group",
        "h-[120px] sm:h-[130px]",
        "relative",
        "overflow-hidden",
        "w-[90%] sm:w-full",
        "mx-auto sm:mx-0"
      )}>
        <CardContent className={cn(
          "p-4 sm:p-6 h-full flex flex-col justify-between",
          "relative z-10"
        )}>
          <div className="flex items-center justify-between">
            <div className="space-y-1 sm:space-y-2">
              <p className={cn(
                "text-xs sm:text-sm text-gray-500",
                isRTL && "font-cairo"
              )}>
                {label}
              </p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className={cn(
                  "text-lg sm:text-2xl font-bold text-gray-900",
                  isRTL && "font-cairo"
                )}>
                  {count}
                </span>
                <span className={cn(
                  "text-xs sm:text-sm text-gray-500"
                )}>
                  {percentage}%
                </span>
              </div>
            </div>
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              getIconColor(status),
              "transition-transform duration-300",
              "group-hover:scale-110"
            )}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}