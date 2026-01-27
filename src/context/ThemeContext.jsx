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
        '--text-tertiary': '#94a3b8',  // Slate 400 (New)
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
        '--error': '#dc2626',

        // Glassmorphism (Light)
        '--glass-bg': 'rgba(255, 255, 255, 0.7)',
        '--glass-bg-light': 'rgba(255, 255, 255, 0.5)',
        '--glass-border': 'rgba(0, 0, 0, 0.1)'
    }
};

export const ThemeProvider = ({ children }) => {
    // --- Theme State ---
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('app_theme');
        return saved ? JSON.parse(saved) : DEFAULT_THEME;
    });

    // --- Granular Styles State ---
    const [styles, setStyles] = useState(() => {
        const saved = localStorage.getItem('app_styles');
        return saved ? JSON.parse(saved) : {
            '--glass-blur': '10px',
            '--border-radius-base': '12px',
            '--shadow-opacity': '0.1',
            '--font-scale': '1'
        };
    });

    // --- Custom Animations Builder State ---
    const [customAnimations, setCustomAnimations] = useState(() => {
        const saved = localStorage.getItem('app_custom_anims');
        return saved ? JSON.parse(saved) : [];
    });

    // --- Element Mapping State ---
    const [elementAnimations, setElementAnimations] = useState(() => {
        const saved = localStorage.getItem('app_elem_anims');
        return saved ? JSON.parse(saved) : {
            'button': 'scale', // maps to preset or custom name
            'modal': 'zoom',
            'page': 'fade'
        };
    });

    // --- Performance State ---
    const [performance, setPerformance] = useState(() => {
        const saved = localStorage.getItem('app_performance');
        return saved ? JSON.parse(saved) : {
            enableGlassmorphism: true,
            enableShadows: true,
            enable3D: true,
            enableAnimations: true,
            reduceMotion: false,
            strictMode: false // User Requested "CPU Optimized" Mode
        };
    });

    // --- Animation State ---
    const [animations, setAnimations] = useState(() => {
        const saved = localStorage.getItem('app_animations');
        return saved ? JSON.parse(saved) : {
            buttonHover: 'scale', // none, scale, glow, lift
            pageTransition: 'fade', // none, fade, slide, zoom
            modalEntry: 'zoom', // none, zoom, slide-up, fade
            duration: '0.2s',
            easing: 'ease-out'
        };
    });

    // --- Profiles State ---
    const [savedProfiles, setSavedProfiles] = useState(() => {
        const saved = localStorage.getItem('app_profiles');
        return saved ? JSON.parse(saved) : [];
    });

    // STYLE REGISTRY (Metadata for UI generation & Warnings)
    const STYLE_REGISTRY = {
        'Visual Effects': [
            { id: '--glass-blur', label: 'Glass Blur', type: 'px', min: 0, max: 50, cost: 'HIGH', desc: 'Blurs background behind elements. High GPU usage.' },
            { id: '--shadow-opacity', label: 'Shadow Intensity', type: 'number', min: 0, max: 1, step: 0.05, cost: 'MEDIUM', desc: 'Darkness of drop shadows.' },
        ],
        'Layout & Spacing': [
            { id: '--border-radius-base', label: 'Corner Roundness', type: 'px', min: 0, max: 30, cost: 'LOW', desc: 'Roundness of buttons and cards.' },
            { id: '--font-scale', label: 'Content Scaling', type: 'number', min: 0.8, max: 1.2, step: 0.05, cost: 'LOW', desc: 'Overall size of UI elements.' },
        ]
    };

    // Apply Logic
    useEffect(() => {
        const root = document.documentElement;

        // 1. Apply Theme Colors
        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        // 2. Apply Granular Styles
        Object.entries(styles).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        // 3. Apply Performance Optimizations (Overrides)
        if (!performance.enableGlassmorphism) {
            root.style.setProperty('--glass-blur', '0px');
            // Force styles state update to reflect reality if needed, or just visual override
        } else {
            root.style.setProperty('--glass-blur', styles['--glass-blur']); // Restore from styles if glassmorphism is enabled
        }

        if (!performance.enableShadows) {
            root.style.setProperty('--shadow-sm', 'none');
            root.style.setProperty('--shadow-md', 'none');
            root.style.setProperty('--shadow-lg', 'none');
            root.style.setProperty('--shadow-xl', 'none');
        } // Else rely on defaults in index.css (though we should ideally store "active" values to restore them)
        // Simplified: We rely on CSS classes for heavy lifting

        const body = document.body;
        body.classList.toggle('perf-no-glass', !performance.enableGlassmorphism);
        body.classList.toggle('perf-no-shadow', !performance.enableShadows);
        body.classList.toggle('perf-no-3d', !performance.enable3D);
        body.classList.toggle('perf-no-anim', !performance.enableAnimations);
        body.classList.toggle('performance-mode', performance.strictMode);

        // 4. Apply Animations (legacy, might be replaced by elementAnimations)
        root.style.setProperty('--anim-duration', animations.duration);
        root.style.setProperty('--anim-easing', animations.easing);
        root.style.setProperty('--anim-btn-type', animations.buttonHover);

        // 5. Inject Custom Keyframes & Mappings
        let styleTag = document.getElementById('dynamic-animations');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-animations';
            document.head.appendChild(styleTag);
        }

        let css = '';

        // Generate Keyframes
        customAnimations.forEach(anim => {
            css += `@keyframes ${anim.name} { ${anim.frames} } \n`;
        });

        // Generate Mappings
        // We use data attributes or classes in the app to hook these up.
        // For buttons, we might check .btn class
        if (performance.enableAnimations) {
            // Example for button:
            const buttonAnimName = elementAnimations.button;
            if (buttonAnimName && buttonAnimName !== 'none') {
                const animKey = buttonAnimName.startsWith('custom-') ? buttonAnimName.replace('custom-', '') : `anim-${buttonAnimName}`;
                css += `.btn { animation-name: ${animKey}; animation-duration: var(--anim-duration); animation-timing-function: var(--anim-easing); }\n`;
            } else {
                css += `.btn { animation-name: none; }\n`;
            }
            // Note: We need to ensure standard presets are prefixed 'anim-' in CSS, custom ones might not be.
            // Simplified logic for now:
        }

        styleTag.innerHTML = css;

        // Persist
        localStorage.setItem('app_theme', JSON.stringify(theme));
        localStorage.setItem('app_styles', JSON.stringify(styles));
        localStorage.setItem('app_performance', JSON.stringify(performance));
        localStorage.setItem('app_animations', JSON.stringify(animations)); // Keeping for legacy/timing
        localStorage.setItem('app_custom_anims', JSON.stringify(customAnimations));
        localStorage.setItem('app_elem_anims', JSON.stringify(elementAnimations));
        localStorage.setItem('app_profiles', JSON.stringify(savedProfiles));

    }, [theme, styles, performance, animations, customAnimations, elementAnimations, savedProfiles]);

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

    const resetAll = () => {
        setTheme(DEFAULT_THEME);
        setStyles({
            '--glass-blur': '10px',
            '--border-radius-base': '12px',
            '--shadow-opacity': '0.1',
            '--font-scale': '1'
        });
        setPerformance({
            enableGlassmorphism: true,
            enableShadows: true,
            enable3D: true,
            enableAnimations: true,
            reduceMotion: false,
            strictMode: false
        });
        setAnimations({
            buttonHover: 'scale',
            pageTransition: 'fade',
            modalEntry: 'zoom',
            duration: '0.2s',
            easing: 'ease-out'
        });
        setElementAnimations({
            'button': 'scale',
            'modal': 'zoom',
            'page': 'fade'
        });
        // We do typically reset Custom Animations or Profiles, but "Reset All Settings" suggests current configuration
        // Preserving saved profiles and custom animations library unless explicitly requested to wipe data.
    };

    // New Handlers
    const updatePerformance = (key, value) => {
        setPerformance(prev => ({ ...prev, [key]: value }));
    };

    const updateAnimation = (key, value) => {
        setAnimations(prev => ({ ...prev, [key]: value }));
    };

    const updateStyle = (key, value) => {
        setStyles(prev => ({ ...prev, [key]: value }));
    };

    const addCustomAnimation = (name, frames) => {
        setCustomAnimations(prev => [...prev, { id: Date.now(), name, frames }]);
    };

    const deleteCustomAnimation = (id) => {
        setCustomAnimations(prev => prev.filter(a => a.id !== id));
    };

    const updateElementMapping = (element, animName) => {
        setElementAnimations(prev => ({ ...prev, [element]: animName }));
    };

    const enableLiteMode = () => {
        // 1. Disable Heavy Toggles
        setPerformance({
            enableGlassmorphism: false,
            enableShadows: false,
            enable3D: false,
            enableAnimations: false, // Optional: User might want SOME motion, but for "Lite" it's safest off
            reduceMotion: true
        });

        // 2. Reset Granular Styles to Zero Cost
        setStyles(prev => ({
            ...prev,
            '--glass-blur': '0px',
            '--shadow-opacity': '0',
            // Keep Font Scale as is (accessibility)
        }));

        // 3. Reset Animations (Optional, but good for "Lite")
        setAnimations(prev => ({
            ...prev,
            duration: '0s',
            buttonHover: 'none',
            pageTransition: 'none',
            modalEntry: 'none'
        }));
    };

    const saveProfile = (name) => {
        const newProfile = {
            id: Date.now(),
            name,
            theme,
            styles,
            performance,
            animations,
            customAnimations,
            elementAnimations,
            font: JSON.parse(localStorage.getItem('app_font')) // Accessing font directly from storage since it's in another context
        };
        setSavedProfiles(prev => [...prev, newProfile]);
    };

    const loadProfile = (profile) => {
        setTheme(profile.theme);
        if (profile.styles) setStyles(profile.styles);
        setPerformance(profile.performance);
        setAnimations(profile.animations);
        if (profile.customAnimations) setCustomAnimations(profile.customAnimations);
        if (profile.elementAnimations) setElementAnimations(profile.elementAnimations);
        // Font needs to be handled by FontContext, we might need to expose a "load" event or save it there.
        // For A-Z consistency, fonts are part of the profile.
        // Ideally we'd trigger a custom event or callback, but for now let's focus on Theme/Perf/Anim
    };

    const deleteProfile = (id) => {
        setSavedProfiles(prev => prev.filter(p => p.id !== id));
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            performance,
            animations,
            styles,
            customAnimations,
            elementAnimations,
            savedProfiles,
            presets: Object.keys(PRESETS),
            STYLE_REGISTRY,
            updateThemeEntry,
            applyPreset,
            resetTheme,
            resetAll,
            updatePerformance,
            updateAnimation,
            updateStyle,
            addCustomAnimation,
            deleteCustomAnimation,
            updateElementMapping,
            enableLiteMode,
            saveProfile,
            loadProfile,
            deleteProfile
        }}>
            {children}
        </ThemeContext.Provider>
    );
};
