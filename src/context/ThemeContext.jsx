import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const DEFAULT_THEME = {
    // Backgrounds
    '--bg-deepest': '#1e293b',
    '--bg-deep': '#334155',
    '--bg-primary': '#1e293b',
    '--bg-surface': '#334155',
    '--bg-card': '#334155',
    '--bg-elevated': '#475569',
    '--bg-hover': '#475569',

    // Text
    '--text-primary': '#f8fafc',
    '--text-secondary': '#e2e8f0',
    '--text-muted': '#94a3b8',

    // Borders
    '--border-subtle': '#475569',
    '--border-default': '#64748b',

    // Accents
    '--accent-purple': '#8b5cf6',
    '--accent-blue': '#3b82f6',
    '--accent-cyan': '#06b6d4',

    // Status
    '--success': '#10b981',
    '--warning': '#f59e0b',
    '--error': '#ef4444'
};

const PRESETS = {
    'Dark (Default)': DEFAULT_THEME,
    'Midnight Blue': {
        ...DEFAULT_THEME,
        '--bg-deepest': '#0f172a',
        '--bg-deep': '#1e293b',
        '--bg-primary': '#0f172a',
        '--bg-surface': '#1e293b',
        '--bg-card': '#1e293b',
        '--bg-elevated': '#334155',
        '--bg-hover': '#334155',
        '--accent-purple': '#6366f1',
        '--accent-blue': '#3b82f6',
    },
    'Forest Night': {
        ...DEFAULT_THEME,
        '--bg-deepest': '#052e16',
        '--bg-deep': '#064e3b',
        '--bg-primary': '#052e16',
        '--bg-surface': '#065f46',
        '--bg-card': '#065f46',
        '--bg-elevated': '#047857',
        '--bg-hover': '#047857',
        '--accent-purple': '#34d399',
        '--accent-blue': '#10b981',
        '--border-subtle': '#064e3b',
    },
    'Ocean Depth': {
        ...DEFAULT_THEME,
        '--bg-deepest': '#082f49',
        '--bg-deep': '#0c4a6e',
        '--bg-primary': '#082f49',
        '--bg-surface': '#0c4a6e',
        '--bg-card': '#0c4a6e',
        '--bg-elevated': '#075985',
        '--bg-hover': '#075985',
        '--accent-purple': '#38bdf8',
        '--accent-blue': '#0ea5e9',
        '--border-subtle': '#0c4a6e',
    },
    'Velvet': {
        ...DEFAULT_THEME,
        '--bg-deepest': '#2e0225',
        '--bg-deep': '#4a044e',
        '--bg-primary': '#2e0225',
        '--bg-surface': '#581c87',
        '--bg-card': '#581c87',
        '--bg-elevated': '#701a75',
        '--bg-hover': '#701a75',
        '--accent-purple': '#d8b4fe',
        '--accent-blue': '#f0abfc',
        '--border-subtle': '#4a044e',
    },
    'Light Mode': {
        '--bg-deepest': '#f8fafc', // Slate 50
        '--bg-deep': '#f1f5f9',    // Slate 100
        '--bg-primary': '#ffffff', // White
        '--bg-surface': '#ffffff', // White
        '--bg-card': '#ffffff',    // White
        '--bg-elevated': '#f1f5f9', // Slate 100
        '--bg-hover': '#e2e8f0',    // Slate 200

        // Text (Inverted)
        '--text-primary': '#0f172a',   // Slate 900
        '--text-secondary': '#334155', // Slate 700
        '--text-muted': '#64748b',     // Slate 500

        // Borders
        '--border-subtle': '#e2e8f0',  // Slate 200
        '--border-default': '#cbd5e1', // Slate 300

        // Accents (Slightly darker for visibility on light)
        '--accent-purple': '#7c3aed', // Violet 600
        '--accent-blue': '#2563eb',   // Blue 600
        '--accent-cyan': '#0891b2',   // Cyan 600

        // Status
        '--success': '#059669',
        '--warning': '#d97706',
        '--error': '#dc2626'
    }
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('app_theme');
        return saved ? JSON.parse(saved) : DEFAULT_THEME;
    });

    useEffect(() => {
        const root = document.documentElement;
        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        localStorage.setItem('app_theme', JSON.stringify(theme));
    }, [theme]);

    const updateThemeEntry = (key, value) => {
        setTheme(prev => ({ ...prev, [key]: value }));
    };

    const applyPreset = (presetName) => {
        if (PRESETS[presetName]) {
            setTheme(PRESETS[presetName]);
        }
    };

    const resetTheme = () => {
        setTheme(DEFAULT_THEME);
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            updateThemeEntry,
            applyPreset,
            resetTheme,
            presets: Object.keys(PRESETS)
        }}>
            {children}
        </ThemeContext.Provider>
    );
};
