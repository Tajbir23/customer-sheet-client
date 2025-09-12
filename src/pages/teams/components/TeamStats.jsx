import React from 'react';
import { FaUsers, FaCheckCircle, FaTimesCircle, FaChartBar } from 'react-icons/fa';

const TeamStats = ({ teams = [] }) => {
  const totalTeams = teams.length;
  const activeTeams = teams.filter(team => team.isActive).length;
  const inactiveTeams = totalTeams - activeTeams;
  const totalMembers = teams.reduce((sum, team) => sum + (team.members?.length || 0), 0);

  const stats = [
    {
      title: 'Total Teams',
      value: totalTeams,
      icon: FaChartBar,
      color: 'text-blue',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Teams',
      value: activeTeams,
      icon: FaCheckCircle,
      color: 'text-green',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Inactive Teams',
      value: inactiveTeams,
      icon: FaTimesCircle,
      color: 'text-red',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Members',
      value: totalMembers,
      icon: FaUsers,
      color: 'text-primary',
      bgColor: 'bg-gray-50'
    }
  ];

  if (totalTeams === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="card hover:shadow-md transition-shadow"
        >
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`text-xl ${stat.color}`} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-700">
                  {stat.value}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {stat.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${stat.bgColor.replace('-50', '')}`}
                    style={{ 
                      width: totalTeams > 0 ? `${Math.round((stat.value / (stat.title === 'Total Members' ? Math.max(totalMembers, 1) : totalTeams)) * 100)}%` : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-500 ml-2">
                  {totalTeams > 0 ? Math.round((stat.value / (stat.title === 'Total Members' ? Math.max(totalMembers, 1) : totalTeams)) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamStats; 