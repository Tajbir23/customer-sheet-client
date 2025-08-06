import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(endDate) - new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    const timeBlocks = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
    ];

    if (Object.keys(timeLeft).length === 0) {
        return (
            <div className="text-red-500 dark:text-red-400 font-medium">
                Subscription has expired!
            </div>
        );
    }

    return (
        <div className="flex gap-2 sm:gap-3">
            {timeBlocks.map(({ label, value }) => (
                <div 
                    key={label}
                    className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center"
                >
                    <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                        {value?.toString().padStart(2, '0') || '00'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CountdownTimer; 