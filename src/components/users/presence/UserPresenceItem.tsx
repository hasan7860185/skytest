import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserPresenceItemProps {
  label: string;
  count: number;
  isOnline?: boolean;
  isRTL: boolean;
  onClick: () => void;
}

export function UserPresenceItem({
  label,
  count,
  isOnline = false,
  isRTL,
  onClick
}: UserPresenceItemProps) {
  return (
    <div 
      className={`flex items-center ${isRTL ? 'justify-between' : 'justify-between'} cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors`}
      onClick={onClick}
    >
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <Users className={`w-5 h-5 ${isOnline ? 'text-green-500' : 'text-gray-500'}`} />
        <span className="text-gray-700 dark:text-gray-300">
          {label}
        </span>
      </div>
      <span className="font-bold text-gray-900 dark:text-gray-100">
        {count}
      </span>
    </div>
  );
}