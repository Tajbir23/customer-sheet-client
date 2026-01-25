import React, { useState, useEffect, useCallback } from 'react';

const CountdownTimer = ({ endDate }) => {
    const calculateTimeLeft = useCallback(() => {
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
    }, [endDate]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    const timeBlocks = [
        { label: 'Days', value: timeLeft.days, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
        { label: 'Hours', value: timeLeft.hours, gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        { label: 'Minutes', value: timeLeft.minutes, gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
        { label: 'Seconds', value: timeLeft.seconds, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }
    ];

    if (Object.keys(timeLeft).length === 0) {
        return (
            <div
                className="flex items-center gap-2 p-4 rounded-xl"
                style={{
                    background: 'var(--error-bg)',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
            >
                <span className="w-2 h-2 rounded-full bg-[var(--error)] animate-pulse" />
                <span className="text-[var(--error-light)] font-medium">
                    Subscription has expired!
                </span>
            </div>
        );
    }

    return (
        <div className="flex gap-3">
            {timeBlocks.map(({ label, value, gradient }, index) => (
                <div
                    key={label}
                    className="flex-1 relative group animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div
                        className="relative rounded-xl p-4 text-center overflow-hidden transition-all duration-300 group-hover:scale-105"
                        style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                        }}
                    >
                        {/* Gradient Overlay */}
                        <div
                            className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                            style={{ background: gradient }}
                        />

                        {/* Value */}
                        <div
                            className="relative text-2xl sm:text-3xl font-bold mb-1"
                            style={{
                                background: gradient,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {value?.toString().padStart(2, '0') || '00'}
                        </div>

                        {/* Label */}
                        <div className="relative text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                            {label}
                        </div>

                        {/* Bottom Indicator */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-0.5 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: gradient }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CountdownTimer;