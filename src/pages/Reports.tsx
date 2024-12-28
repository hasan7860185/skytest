import React, { useState } from 'react';
import { BarChartIcon, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import QuickStats from '../components/reports/QuickStats';
import SalesChart from '../components/reports/SalesChart';
import ClientDistribution from '../components/reports/ClientDistribution';
import PropertyDistribution from '../components/reports/PropertyDistribution';

const Reports = () => {
  const [dateRange, setDateRange] = useState('month');
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <BarChartIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Statistics'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="week">{language === 'ar' ? 'آخر أسبوع' : 'Last Week'}</option>
            <option value="month">{language === 'ar' ? 'آخر شهر' : 'Last Month'}</option>
            <option value="quarter">{language === 'ar' ? 'آخر 3 أشهر' : 'Last Quarter'}</option>
            <option value="year">{language === 'ar' ? 'آخر سنة' : 'Last Year'}</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
          </button>
        </div>
      </div>

      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <ClientDistribution />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PropertyDistribution />
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Additional chart or stats can be added here */}
        </div>
      </div>
    </div>
  );
};

export default Reports;