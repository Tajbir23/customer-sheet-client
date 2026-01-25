import React from 'react'
import { FaUsers, FaCheckCircle, FaTimesCircle, FaEnvelope } from 'react-icons/fa'

const TeamStats = ({ totalCount }) => {
  const { totalTeams, totalMembers, totalActiveTeams, totalInactiveTeams } = totalCount

  const stats = [
    {
      title: 'Total Teams',
      value: totalTeams,
      icon: FaUsers,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    },
    {
      title: 'Active Teams',
      value: totalActiveTeams,
      icon: FaCheckCircle,
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    },
    {
      title: 'Inactive Teams',
      value: totalInactiveTeams,
      icon: FaTimesCircle,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
    },
    {
      title: 'Total Members',
      value: totalMembers,
      icon: FaEnvelope,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    }
  ]

  if (totalTeams === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative overflow-hidden animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Card */}
          <div
            className="relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Glow Effect on Hover */}
            <div
              className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"
              style={{ background: stat.gradient }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ background: stat.gradient }}
                >
                  <stat.icon className="text-white text-xl" />
                </div>
                <div className="text-right">
                  <div
                    className="text-3xl font-bold"
                    style={{
                      background: stat.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">
                  {stat.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1.5 flex-1 rounded-full opacity-20"
                    style={{ background: stat.gradient }}
                  />
                  <span className="text-xs font-medium text-[var(--text-tertiary)]">
                    {totalTeams > 0 ? Math.round((stat.value / totalTeams) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Gradient Line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: stat.gradient }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default TeamStats