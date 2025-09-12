import React from 'react'
import TeamCard from './TeamCard'

const TeamGrid = ({ teams, onToggleActive, onTeamUpdate, togglingTeam }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {teams.map((team) => (
        <div key={team._id}>
          <TeamCard 
            team={team} 
            onToggleStatus={onToggleActive}
            onTeamUpdate={onTeamUpdate}
            isToggling={togglingTeam === team._id}
          />
        </div>
      ))}
    </div>
  )
}

export default TeamGrid 