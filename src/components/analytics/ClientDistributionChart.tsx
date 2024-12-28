import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ClientData {
  id: string;
  created_at: string;
  status: string;
}

interface Props {
  data: ClientData[];
}

export const ClientDistributionChart = ({ data }: Props) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: distributionData, isLoading } = useQuery({
    queryKey: ['client-distribution'],
    queryFn: async () => {
      try {
        const { data: clients, error } = await supabase
          .from('clients')
          .select('status');

        if (error) throw error;

        // Count clients by status
        const statusCounts = (clients || []).reduce((acc: Record<string, number>, client) => {
          acc[client.status] = (acc[client.status] || 0) + 1;
          return acc;
        }, {});

        return Object.entries(statusCounts).map(([status, count]) => ({
          name: getStatusName(status),
          value: count
        }));
      } catch (error: any) {
        console.error('Error fetching client distribution:', error);
        toast.error(isRTL ? 'حدث خطأ أثناء تحميل توزيع العملاء' : 'Error loading client distribution');
        return [];
      }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Map status to translated names
  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      new: isRTL ? 'عملاء جدد' : 'New Clients',
      potential: isRTL ? 'عملاء محتملون' : 'Potential Clients',
      interested: isRTL ? 'مهتمون' : 'Interested',
      responded: isRTL ? 'تم الرد' : 'Responded',
      noResponse: isRTL ? 'لا يوجد رد' : 'No Response',
      scheduled: isRTL ? 'مجدول' : 'Scheduled',
      postMeeting: isRTL ? 'بعد الاجتماع' : 'Post Meeting',
      whatsappContact: isRTL ? 'تواصل واتساب' : 'WhatsApp Contact',
      facebookContact: isRTL ? 'تواصل فيسبوك' : 'Facebook Contact',
      booked: isRTL ? 'تم الحجز' : 'Booked',
      cancelled: isRTL ? 'ملغي' : 'Cancelled',
      sold: isRTL ? 'تم البيع' : 'Sold',
      postponed: isRTL ? 'مؤجل' : 'Postponed',
      resale: isRTL ? 'إعادة بيع' : 'Resale',
      interestedNAC: isRTL ? 'مهتم بالعاصمة الإدارية' : 'Interested in NAC',
      interestedTagamoa: isRTL ? 'مهتم بالتجمع' : 'Interested in Tagamoa',
      interestedMustakbal: isRTL ? 'مهتم بالمستقبل' : 'Interested in Mustakbal',
      interestedNorthCoast: isRTL ? 'مهتم بالساحل' : 'Interested in North Coast',
      interestedZayed: isRTL ? 'مهتم بزايد' : 'Interested in Zayed',
      interestedOctober: isRTL ? 'مهتم بأكتوبر' : 'Interested in October',
      interestedSokhna: isRTL ? 'مهتم بالسخنة' : 'Interested in Sokhna',
      interestedShorouk: isRTL ? 'مهتم بالشروق' : 'Interested in Shorouk',
      interestedObour: isRTL ? 'مهتم بالعبور' : 'Interested in Obour',
      interestedHeliopolis: isRTL ? 'مهتم بمصر الجديدة' : 'Interested in Heliopolis'
    };
    
    return statusMap[status] || status;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', 
                 '#ff7300', '#666666', '#ff6b81', '#c56cf0', '#7d5fff', '#3ae374', '#17c0eb'];

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={cn(
          "bg-white p-2 rounded-lg shadow border border-gray-200",
          "dark:bg-gray-800 dark:border-gray-700"
        )}>
          <p className={cn(
            "text-sm font-medium text-gray-900 dark:text-gray-100",
            isRTL && "font-cairo"
          )}>
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isRTL ? 'العدد:' : 'Count:'} {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={distributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {distributionData?.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};