import React from 'react'
import TeamCard from './TeamCard'

const TeamGrid = ({ teams, onToggleActive, onRemoveMember, onAddMembers, togglingTeam, recentlyToggledTeam, recentlyAddedMembers }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {teams.map((team, index) => (
        <div
          key={team._id}
          className="transform transition-all duration-300"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <TeamCard
            team={team}
            onToggleActive={onToggleActive}
            onRemoveMember={onRemoveMember}
            onAddMembers={onAddMembers}
            isToggling={togglingTeam === team._id}
            justToggled={recentlyToggledTeam === team._id}
            recentlyAddedMembers={recentlyAddedMembers?.teamId === team._id ? recentlyAddedMembers.members : []}
          />
        </div>
      ))}
    </div>
  )
}

export default TeamGrid 