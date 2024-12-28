import { useTranslation } from "react-i18next";
import { UserAvatar } from "@/components/users/UserAvatar";
import { Plus, FileEdit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogItemHeaderProps {
  profileName: string;
  profileAvatar: string | null;
  actionType: string;
  entityType: string;
}

export function LogItemHeader({ profileName, profileAvatar, actionType, entityType }: LogItemHeaderProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const getActionIcon = () => {
    switch (actionType) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'update':
        return <FileEdit className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getActionText = () => {
    const entityName = isRTL ? 
      entityType === 'user' ? 'المستخدم' : 
      entityType === 'client' ? 'العميل' : 
      'العنصر' : entityType;

    switch (actionType) {
      case 'create':
        return isRTL ? `قام بإنشاء ${entityName}` : `Created ${entityName}`;
      case 'update':
        return isRTL ? `قام بتحديث ${entityName}` : `Updated ${entityName}`;
      case 'delete':
        return isRTL ? `قام بحذف ${entityName}` : `Deleted ${entityName}`;
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <UserAvatar 
        user={{
          full_name: profileName,
          avatar: profileAvatar
        }}
        className="h-8 w-8"
      />
      <span className="font-medium">{profileName}</span>
      <span className="text-muted-foreground">{getActionText()}</span>
      {getActionIcon()}
    </div>
  );
}