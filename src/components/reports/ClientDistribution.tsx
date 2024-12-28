import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

const ClientDistribution = () => {
  const { language } = useLanguage();

  const data = [
    { name: language === 'ar' ? 'عملاء جدد' : 'New Clients', value: 45 },
    { name: language === 'ar' ? 'عملاء نشطون' : 'Active Clients', value: 30 },
    { name: language === 'ar' ? 'عملاء محتملون' : 'Potential Clients', value: 25 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {language === 'ar' ? 'توزيع العملاء' : 'Client Distribution'}
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClientDistribution;