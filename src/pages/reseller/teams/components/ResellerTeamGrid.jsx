import React from 'react';
import ResellerTeamCard from './ResellerTeamCard';

const ResellerTeamGrid = ({ teams, onRemoveMember, onMemberAdded }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {teams.map((team, index) => (
                <div
                    key={team.gptAccount}
                    className="transform transition-all duration-300"
                    style={{
                        animationDelay: `${index * 100}ms`
                    }}
                >
                    <ResellerTeamCard
                        team={team}
                        onRemoveMember={onRemoveMember}
                        onMemberAdded={onMemberAdded}
                    />
                </div>
            ))}
        </div>
    );
};

export default ResellerTeamGrid;
