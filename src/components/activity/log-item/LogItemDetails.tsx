import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogItemDetailsProps {
  details: {
    old_data?: any;
    new_data?: any;
  };
}

export function LogItemDetails({ details }: LogItemDetailsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      status: isRTL ? 'الحالة' : 'Status',
      next_action_date: isRTL ? 'موعد الإجراء التالي' : 'Next Action Date',
      next_action_type: isRTL ? 'نوع الإجراء التالي' : 'Next Action Type',
      name: isRTL ? 'الاسم' : 'Name',
      phone: isRTL ? 'الهاتف' : 'Phone',
      email: isRTL ? 'البريد الإلكتروني' : 'Email',
      country: isRTL ? 'الدولة' : 'Country',
      city: isRTL ? 'المدينة' : 'City',
      comment: isRTL ? 'التعليق' : 'Comment',
      assigned_to: isRTL ? 'تم تعيينه إلى' : 'Assigned To'
    };
    return labels[field] || field;
  };

  const formatValue = (field: string, value: any): string => {
    if (value === null) return isRTL ? 'لا يوجد' : 'None';
    
    if (field === 'status') {
      return value;
    }
    
    if (field === 'next_action_date' && value) {
      return format(new Date(value), 'PPpp', {
        locale: isRTL ? ar : undefined
      });
    }
    
    return value.toString();
  };

  const formatChanges = () => {
    if (!details) return null;
    
    if (!details.old_data || !details.new_data) return null;

    const changes: { field: string; old: any; new: any }[] = [];
    
    Object.keys(details.new_data).forEach(key => {
      if (JSON.stringify(details.old_data[key]) !== JSON.stringify(details.new_data[key])) {
        changes.push({
          field: key,
          old: details.old_data[key],
          new: details.new_data[key]
        });
      }
    });

    return changes.length > 0 ? (
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {changes.map((change, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium">{getFieldLabel(change.field)}: </span>
              <span className="text-red-500 line-through mx-1">
                {formatValue(change.field, change.old)}
              </span>
              <span className="text-green-500">
                {formatValue(change.field, change.new)}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    ) : null;
  };

  return formatChanges();
}