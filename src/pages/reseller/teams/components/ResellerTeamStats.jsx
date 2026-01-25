import React from 'react';

const ResellerTeamStats = ({ teams }) => {
    const totalTeams = teams.length;
    const totalMembers = teams.reduce((acc, team) => acc + (team.totalMembers || 0), 0);
    const myMembers = teams.reduce((acc, team) => acc + (team.members?.length || 0), 0);
    const teamsWithMembers = teams.filter(team => team.members && team.members.length > 0).length;

    const stats = [
        {
            symbol: 'T',
            label: 'Total Teams',
            value: totalTeams,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
        },
        {
            symbol: 'M',
            label: 'Total Members',
            value: totalMembers,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700'
        },
        {
            symbol: 'My',
            label: 'My Members',
            value: myMembers,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700'
        },
        {
            symbol: '%',
            label: 'Teams With My Members',
            value: teamsWithMembers,
            color: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700'
        },
    ];

    return (
        <div className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`${stat.bgColor} rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                                <span className="text-white text-xl font-bold">{stat.symbol}</span>
                            </div>
                            <div>
                                <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResellerTeamStats;
