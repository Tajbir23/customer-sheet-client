import React from 'react'
import { FaUsers, FaCheckCircle, FaTimesCircle, FaEnvelope } from 'react-icons/fa'

const TeamStats = ({ teams }) => {
  const totalTeams = teams.length
  const activeTeams = teams.filter(team => team.isActive).length
  const inactiveTeams = totalTeams - activeTeams
  const totalMembers = teams.reduce((sum, team) => sum + (team.members?.length || 0), 0)

  const stats = [
    {
      title: 'Total Teams',
      value: totalTeams,
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700'
    },
    {
      title: 'Active Teams',
      value: activeTeams,
      icon: FaCheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-700'
    },
    {
      title: 'Inactive Teams',
      value: inactiveTeams,
      icon: FaTimesCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      textColor: 'text-red-700'
    },
    {
      title: 'Total Members',
      value: totalMembers,
      icon: FaEnvelope,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700'
    }
  ]

  if (totalTeams === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative overflow-hidden"
        >
          {/* Card */}
          <div className={`relative bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-20 h-20 bg-current rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-current rounded-full translate-y-8 -translate-x-8"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className={`text-sm font-bold ${stat.textColor} mb-1`}>
                  {stat.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`h-2 flex-1 bg-gradient-to-r ${stat.color} rounded-full opacity-20`}></div>
                  <span className="text-xs font-medium text-gray-600">
                    {totalTeams > 0 ? Math.round((stat.value / totalTeams) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hover Glow Effect */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl`}></div>
        </div>
      ))}
    </div>
  )
}

export default TeamStats 