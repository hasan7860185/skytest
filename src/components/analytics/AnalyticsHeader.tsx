import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';

interface HeaderProps {
  isRTL: boolean;
}

export function AnalyticsHeader({ isRTL }: HeaderProps) {
  const handleExport = () => {
    // Get the data from the page
    const data = [
      {
        category: isRTL ? 'الفترة' : 'Period',
        value: isRTL ? 'آخر شهر' : 'Last Month'
      },
      {
        category: isRTL ? 'إجمالي العملاء' : 'Total Clients',
        value: '100'
      },
      {
        category: isRTL ? 'العملاء الجدد' : 'New Clients',
        value: '25'
      },
      {
        category: isRTL ? 'العملاء المحتملين' : 'Potential Clients',
        value: '35'
      }
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, isRTL ? "التحليلات" : "Analytics");

    // Save to file
    XLSX.writeFile(wb, isRTL ? "تحليلات-العملاء.xlsx" : "client-analytics.xlsx");
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className={cn(
        "text-2xl font-bold text-gray-900",
        isRTL && "font-cairo"
      )}>
        {isRTL ? "التقارير والإحصائيات" : "Reports & Statistics"}
      </h1>
      <div className="flex items-center gap-4">
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          defaultValue="month"
        >
          <option value="week">{isRTL ? 'آخر أسبوع' : 'Last Week'}</option>
          <option value="month">{isRTL ? 'آخر شهر' : 'Last Month'}</option>
          <option value="quarter">{isRTL ? 'آخر 3 أشهر' : 'Last Quarter'}</option>
          <option value="year">{isRTL ? 'آخر سنة' : 'Last Year'}</option>
        </select>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          {isRTL ? 'تصدير التقرير' : 'Export Report'}
        </button>
      </div>
    </div>
  );
}