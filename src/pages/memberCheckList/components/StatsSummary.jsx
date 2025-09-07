import React from 'react'
import { FaServer, FaUsers, FaCheckCircle, FaTimesCircle, FaPercentage } from 'react-icons/fa'

const StatsSummary = ({ data }) => {
  const totalAccounts = data.length
  const totalMembers = data.reduce((sum, account) => sum + account.members.length, 0)
  const checkedMembers = data.reduce((sum, account) => 
    sum + account.members.filter(member => member.isChecked).length, 0
  )
  const pendingMembers = totalMembers - checkedMembers
  const completionPercentage = totalMembers > 0 ? Math.round((checkedMembers / totalMembers) * 100) : 0
  const resellMembers = data.reduce((sum, account) => 
    sum + account.members.filter(member => member.isResell).length, 0
  )

  const stats = [
    {
      title: 'Total Accounts',
      value: totalAccounts,
      icon: FaServer,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Members',
      value: totalMembers,
      icon: FaUsers,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Checked',
      value: checkedMembers,
      icon: FaCheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending',
      value: pendingMembers,
      icon: FaTimesCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Completion',
      value: `${completionPercentage}%`,
      icon: FaPercentage,
      color: completionPercentage >= 75 ? 'bg-green-500' : completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500',
      textColor: completionPercentage >= 75 ? 'text-green-600' : completionPercentage >= 50 ? 'text-yellow-600' : 'text-red-600',
      bgColor: completionPercentage >= 75 ? 'bg-green-50' : completionPercentage >= 50 ? 'bg-yellow-50' : 'bg-red-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              {stat.title === 'Completion' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        completionPercentage >= 75 ? 'bg-green-500' : 
                        completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className={`${stat.color} p-3 rounded-xl`}>
              <stat.icon className="text-white text-xl" />
            </div>
          </div>
        </div>
      ))}
      
      {/* Additional Info Card */}
      {resellMembers > 0 && (
        <div className="col-span-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Resell Information</h3>
              <p className="text-purple-600">
                <span className="font-bold text-xl">{resellMembers}</span> members are marked for resell
              </p>
            </div>
            <div className="bg-purple-500 p-4 rounded-xl">
              <FaServer className="text-white text-2xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsSummary 