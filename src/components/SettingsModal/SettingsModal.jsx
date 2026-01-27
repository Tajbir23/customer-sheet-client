import React, { useState } from 'react';
import { FaTimes, FaPalette, FaFont, FaCheck, FaLink, FaExternalLinkAlt, FaUndo, FaEye } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFont } from '../../context/FontContext';
import { useTheme } from '../../context/ThemeContext';

const PREDEFINED_FONTS = [
    { name: 'Inter', family: "'Inter', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
    { name: 'Roboto', family: "'Roboto', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' },
    { name: 'Open Sans', family: "'Open Sans', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap' },
    { name: 'Poppins', family: "'Poppins', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' },
    { name: 'Lato', family: "'Lato', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap' },
    { name: 'Montserrat', family: "'Montserrat', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap' },
    { name: 'Raleway', family: "'Raleway', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap' },
    { name: 'Nunito', family: "'Nunito', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap' },
];

const PREVIEW_PAGES = [
    { name: 'Home', path: '/' },
    { name: 'Customers', path: '/customers' },
    { name: 'Teams', path: '/teams' },
    { name: 'ChatGPT Accounts', path: '/chatgpt-accounts' },
    { name: 'Member Checklist', path: '/member-check-list' },
    { name: 'Removed Members', path: '/removed-members' },
    { name: 'Login', path: '/login' },
];

const SettingsModal = ({ isOpen, onClose }) => {
    const { currentFont, changeFont, resetFont } = useFont();
    const { theme, updateThemeEntry, applyPreset, resetTheme, presets } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState('theme'); // 'theme' or 'fonts'
    const [activeThemeSubTab, setActiveThemeSubTab] = useState('presets'); // 'presets' or 'custom'

    // Font Custom State
    const [customFontUrl, setCustomFontUrl] = useState('');
    const [customFontName, setCustomFontName] = useState('');

    if (!isOpen) return null;

    const handleCustomFontApply = () => {
        if (!customFontUrl) return;

        let derivedName = customFontName;
        if (!derivedName) {
            try {
                const urlObj = new URL(customFontUrl);
                const familyParam = urlObj.searchParams.get('family');
                if (familyParam) {
                    derivedName = familyParam.split(':')[0].replace(/\+/g, ' ');
                }
            } catch (e) {
                console.error("Invalid URL");
            }
        }
        if (!derivedName) derivedName = "Custom Font";

        changeFont({
            name: derivedName,
            family: `'${derivedName}', sans-serif`,
            url: customFontUrl
        });
    };

    const ColorInput = ({ label, variable }) => (
        <div className="flex items-center justify-between p-3 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)]">
            <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[var(--text-tertiary)] uppercase">{theme[variable]}</span>
                <input
                    type="color"
                    value={theme[variable]}
                    onChange={(e) => updateThemeEntry(variable, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden"
                />
            </div>
        </div>
    );

    return (
        // Replaced modal-overlay with a transparent pointer-events-none layer that allows clicking through
        // The panel itself has pointer-events-auto
        <div className="fixed inset-0 z-50 pointer-events-none flex justify-end">

            {/* Sidebar Panel */}
            <div className="pointer-events-auto w-full max-w-sm h-full bg-[var(--bg-card)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col animate-slide-in-right transform transition-transform">

                {/* Header containing Actions and Preview Selector */}
                <div className="px-6 py-4 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-card)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[var(--text-primary)]">Settings</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg"
                            aria-label="Close"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Preview Page Selector */}
                    <div className="bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-subtle)]">
                        <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                            <FaEye className="text-[var(--accent-blue)]" />
                            Preview Page
                        </label>
                        <select
                            className="input w-full py-2 px-3 text-sm"
                            value={location.pathname}
                            onChange={(e) => navigate(e.target.value)}
                        >
                            {PREVIEW_PAGES.map(page => (
                                <option key={page.path} value={page.path}>
                                    {page.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="flex border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-card)]">
                    <button
                        onClick={() => setActiveTab('theme')}
                        className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'theme'
                                ? 'border-[var(--accent-purple)] text-[var(--text-primary)] bg-[var(--bg-surface)]'
                                : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                            }`}
                    >
                        <FaPalette /> Theme
                    </button>
                    <button
                        onClick={() => setActiveTab('fonts')}
                        className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'fonts'
                                ? 'border-[var(--accent-purple)] text-[var(--text-primary)] bg-[var(--bg-surface)]'
                                : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                            }`}
                    >
                        <FaFont /> Typography
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--bg-card)]">
                    {activeTab === 'theme' ? (
                        <div className="flex flex-col min-h-full">
                            {/* Sub Tabs */}
                            <div className="flex px-6 pt-4 gap-2 shrink-0">
                                <button
                                    onClick={() => setActiveThemeSubTab('presets')}
                                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${activeThemeSubTab === 'presets'
                                            ? 'bg-[var(--accent-purple)] text-white'
                                            : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white'
                                        }`}
                                >
                                    Presets
                                </button>
                                <button
                                    onClick={() => setActiveThemeSubTab('custom')}
                                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${activeThemeSubTab === 'custom'
                                            ? 'bg-[var(--accent-purple)] text-white'
                                            : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white'
                                        }`}
                                >
                                    Custom Colors
                                </button>
                            </div>

                            <div className="p-6">
                                {activeThemeSubTab === 'presets' ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {presets.map(preset => (
                                            <button
                                                key={preset}
                                                onClick={() => applyPreset(preset)}
                                                className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-purple)] transition-all text-left group"
                                            >
                                                <div className="font-medium text-[var(--text-primary)] text-sm mb-2 truncate">{preset}</div>
                                                <div className="flex gap-2">
                                                    <div className="h-5 w-5 rounded-full border border-[var(--border-subtle)]" style={{ background: 'var(--bg-deepest)' }}></div>
                                                    <div className="h-5 w-5 rounded-full" style={{ background: 'var(--accent-purple)' }}></div>
                                                    <div className="h-5 w-5 rounded-full" style={{ background: 'var(--accent-blue)' }}></div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <section>
                                            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3">Backgrounds</h3>
                                            <div className="space-y-3">
                                                <ColorInput label="Main Background" variable="--bg-deepest" />
                                                <ColorInput label="Secondary Background" variable="--bg-deep" />
                                                <ColorInput label="Card Background" variable="--bg-card" />
                                                <ColorInput label="Surface Background" variable="--bg-surface" />
                                                <ColorInput label="Hover State" variable="--bg-hover" />
                                            </div>
                                        </section>

                                        <div className="h-px bg-[var(--border-subtle)]"></div>

                                        <section>
                                            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3">Accents & Text</h3>
                                            <div className="space-y-3">
                                                <ColorInput label="Primary Accent (Purple)" variable="--accent-purple" />
                                                <ColorInput label="Secondary Accent (Blue)" variable="--accent-blue" />
                                                <ColorInput label="Primary Text" variable="--text-primary" />
                                                <ColorInput label="Secondary Text" variable="--text-secondary" />
                                            </div>
                                        </section>

                                        <div className="h-px bg-[var(--border-subtle)]"></div>

                                        <section>
                                            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3">Borders</h3>
                                            <div className="space-y-3">
                                                <ColorInput label="Subtle Border" variable="--border-subtle" />
                                                <ColorInput label="Default Border" variable="--border-default" />
                                            </div>
                                        </section>
                                    </div>
                                )}
                            </div>

                            {/* Footer Action */}
                            <div className="p-4 mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-card)] flex justify-end shrink-0 sticky bottom-0">
                                <button onClick={resetTheme} className="btn btn-ghost text-xs">
                                    <FaUndo className="mr-2" /> Reset Theme
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col min-h-full p-6">
                            {/* Predefined Fonts */}
                            <div className="space-y-4 mb-8">
                                <h3 className="text-sm font-medium text-[var(--text-secondary)]">Popular Fonts</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {PREDEFINED_FONTS.map((font) => (
                                        <button
                                            key={font.name}
                                            onClick={() => changeFont(font)}
                                            className={`p-3 rounded-xl border text-left transition-all ${currentFont.name === font.name
                                                    ? 'bg-[var(--bg-surface)] border-[var(--accent-purple)] shadow-[0_0_0_1px_var(--accent-purple)]'
                                                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-[var(--text-primary)] text-sm">{font.name}</span>
                                                {currentFont.name === font.name && <FaCheck className="text-[var(--accent-purple)] text-xs" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Font */}
                            <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                    <FaLink className="text-[var(--accent-blue)]" />
                                    Custom Google Font
                                </h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="https://fonts.googleapis.com/css2?family=..."
                                        value={customFontUrl}
                                        onChange={(e) => setCustomFontUrl(e.target.value)}
                                        className="input w-full"
                                    />
                                    <div className="grid gap-2">
                                        <input
                                            type="text"
                                            placeholder="Font Name (Optional)"
                                            value={customFontName}
                                            onChange={(e) => setCustomFontName(e.target.value)}
                                            className="input w-full"
                                        />
                                        <button
                                            onClick={handleCustomFontApply}
                                            disabled={!customFontUrl}
                                            className="btn btn-primary whitespace-nowrap w-full"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 flex justify-end">
                                <button onClick={resetFont} className="btn btn-ghost text-xs">
                                    <FaUndo className="mr-2" /> Reset Font
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
