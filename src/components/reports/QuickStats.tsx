import React from 'react';
import { TrendingUp, Users, Building2, Calendar } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const QuickStats = () => {
  const { language } = useLanguage();

  const stats = [
    {
      title: language === 'ar' ? 'إجمالي المبيعات' : 'Total Sales',
      value: language === 'ar' ? '2.5M ريال' : 'SAR 2.5M',
      change: '+12.5%',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: language === 'ar' ? 'العملاء الجدد' : 'New Clients',
      value: '128',
      change: '+8.2%',
      icon: Users,
      color: 'green'
    },
    {
      title: language === 'ar' ? 'العقارات النشطة' : 'Active Properties',
      value: '45',
      change: '-2.3%',
      icon: Building2,
      color: 'purple'
    },
    {
      title: language === 'ar' ? 'المواعيد هذا الشهر' : 'Appointments This Month',
      value: '24',
      change: '+15.8%',
      icon: Calendar,
      color: 'yellow'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-${stat.change.startsWith('+') ? 'green' : 'red'}-500 text-sm`}>
                {stat.change}
              </span>
              <span className="text-gray-500 text-sm">
                {language === 'ar' ? ' مقارنة بالفترة السابقة' : ' vs previous period'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;