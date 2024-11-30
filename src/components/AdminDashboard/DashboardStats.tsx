import React from 'react';
import { Users, CreditCard, Calendar } from 'lucide-react';
import { DashboardStatsProps } from './types';
import { format } from 'date-fns';

const DashboardStats: React.FC<DashboardStatsProps> = ({ users }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const totalStudents = users.length;
  const pendingPayments = users.filter(user => user.paymentStatus === 'Pending').length;
  const presentToday = users.filter(user => user.attendance[today] === 'P').length;

  const stats = [
    {
      name: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Pending Payments',
      value: pendingPayments,
      icon: CreditCard,
      color: 'bg-yellow-500',
    },
    {
      name: 'Present Today',
      value: presentToday,
      icon: Calendar,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;