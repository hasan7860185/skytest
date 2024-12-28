import React from 'react';
import { Filter } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const SalesChart = () => {
  const { language } = useLanguage();
  const [reportType, setReportType] = React.useState('all');

  const salesData = [
    { month: language === 'ar' ? 'يناير' : 'January', sales: 65, target: 50 },
    { month: language === 'ar' ? 'فبراير' : 'February', sales: 59, target: 50 },
    { month: language === 'ar' ? 'مارس' : 'March', sales: 80, target: 60 },
    { month: language === 'ar' ? 'أبريل' : 'April', sales: 81, target: 60 },
    { month: language === 'ar' ? 'مايو' : 'May', sales: 56, target: 70 },
    { month: language === 'ar' ? 'يونيو' : 'June', sales: 55, target: 70 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {language === 'ar' ? 'أداء المبيعات' : 'Sales Performance'}
        </h2>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="text-sm border-none focus:ring-0"
          >
            <option value="all">
              {language === 'ar' ? 'جميع العقارات' : 'All Properties'}
            </option>
            <option value="residential">
              {language === 'ar' ? 'سكني' : 'Residential'}
            </option>
            <option value="commercial">
              {language === 'ar' ? 'تجاري' : 'Commercial'}
            </option>
          </select>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="sales" 
              fill="#3B82F6" 
              name={language === 'ar' ? 'المبيعات' : 'Sales'} 
            />
            <Bar 
              dataKey="target" 
              fill="#E5E7EB" 
              name={language === 'ar' ? 'المستهدف' : 'Target'} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;