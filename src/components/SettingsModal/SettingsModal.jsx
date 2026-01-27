import React, { useState } from 'react';
import { FaTimes, FaPalette, FaFont, FaCheck, FaLink, FaExternalLinkAlt, FaUndo, FaEye, FaTachometerAlt, FaFilm, FaSave, FaTrash, FaInfoCircle, FaSlidersH, FaMagic, FaPlus } from 'react-icons/fa';
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
    const {
        theme, updateThemeEntry, applyPreset, resetTheme, resetAll, presets,
        performance, updatePerformance, enableLiteMode,
        animations, updateAnimation,
        styles, updateStyle, STYLE_REGISTRY,
        customAnimations, addCustomAnimation, deleteCustomAnimation,
        elementAnimations, updateElementMapping,
        savedProfiles, saveProfile, loadProfile, deleteProfile
    } = useTheme();

    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState('theme'); // 'theme' or 'fonts'
    const [activeThemeSubTab, setActiveThemeSubTab] = useState('presets'); // 'presets' or 'custom'

    // Font Custom State
    const [customFontUrl, setCustomFontUrl] = useState('');
    const [customFontName, setCustomFontName] = useState('');

    // Profile Save State
    const [newProfileName, setNewProfileName] = useState('');

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

            <div className="pointer-events-auto w-full max-w-md h-full glass border-l border-[var(--border-subtle)] shadow-2xl flex flex-col animate-slide-in-right transform transition-transform">

                {/* Header */}
                <div className="px-6 py-4 border-b border-[var(--border-subtle)] shrink-0 bg-transparent">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[var(--text-primary)]">Appearance</h2>
                        <button onClick={onClose} className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg"><FaTimes /></button>
                    </div>

                    {/* Preview Selector */}
                    <div className="bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-subtle)] flex items-center gap-3">
                        <FaEye className="text-[var(--text-secondary)]" />
                        <select
                            className="bg-transparent text-sm w-full outline-none text-[var(--text-primary)] cursor-pointer"
                            value={location.pathname}
                            onChange={(e) => navigate(e.target.value)}
                        >
                            {PREVIEW_PAGES.map(page => <option key={page.path} value={page.path}>{page.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-[var(--border-subtle)] bg-transparent overflow-x-auto no-scrollbar">
                    {[
                        { id: 'styles', icon: <FaSlidersH />, label: 'Editor' },
                        { id: 'anim', icon: <FaMagic />, label: 'Studio' },
                        { id: 'perf', icon: <FaTachometerAlt />, label: 'Speed' },
                        { id: 'theme', icon: <FaPalette />, label: 'Theme' },
                        { id: 'fonts', icon: <FaFont />, label: 'Fonts' },
                        { id: 'profiles', icon: <FaSave />, label: 'Profiles' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[70px] py-3 px-2 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
                                ? 'border-[var(--accent-purple)] text-[var(--accent-purple)] bg-[var(--bg-surface)]/50'
                                : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]/50'
                                }`}
                        >
                            <span className="text-base">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">

                    {/* --- STYLE EDITOR TAB (Deep Customization) --- */}
                    {activeTab === 'styles' && (
                        <div className="p-6 space-y-8">
                            {Object.entries(STYLE_REGISTRY).map(([category, items]) => (
                                <section key={category}>
                                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3 border-b border-[var(--border-subtle)] pb-2">{category}</h3>
                                    <div className="space-y-5">
                                        {items.map(style => (
                                            <div key={style.id}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-sm font-medium text-[var(--text-primary)]">{style.label}</label>
                                                    {style.cost === 'HIGH' && <span className="text-[10px] bg-[var(--error)]/10 text-[var(--error)] px-2 py-0.5 rounded-full font-bold">High GPU</span>}
                                                    {style.cost === 'MEDIUM' && <span className="text-[10px] bg-[var(--warning)]/10 text-[var(--warning)] px-2 py-0.5 rounded-full font-bold">Med GPU</span>}
                                                </div>
                                                <input
                                                    type="range"
                                                    min={style.min} max={style.max} step={style.step || 1}
                                                    value={parseFloat(styles[style.id])}
                                                    onChange={(e) => {
                                                        const newVal = `${e.target.value}${style.type === 'number' ? '' : style.type}`;
                                                        updateStyle(style.id, newVal);

                                                        // Auto-enable performance settings if disabled
                                                        if (style.id === '--glass-blur' && !performance.enableGlassmorphism) {
                                                            updatePerformance('enableGlassmorphism', true);
                                                        }
                                                        if (style.id === '--shadow-opacity' && !performance.enableShadows) {
                                                            updatePerformance('enableShadows', true);
                                                        }
                                                    }}
                                                    className="w-full accent-[var(--accent-purple)]"
                                                />
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-[var(--text-tertiary)]">{style.desc}</span>
                                                    <span className="text-xs font-mono text-[var(--text-primary)]">{styles[style.id]}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}

                            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaTachometerAlt className="text-[var(--text-secondary)]" />
                                    <span className="text-sm font-bold text-[var(--text-primary)]">Quick Actions</span>
                                </div>
                                <button
                                    onClick={() => {
                                        updateStyle('--glass-blur', '0px');
                                        updateStyle('--shadow-opacity', '0');
                                        updatePerformance('enableGlassmorphism', false);
                                        updatePerformance('enableShadows', false);
                                    }}
                                    className="btn btn-sm w-full border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]"
                                >
                                    Optimize for Speed
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- ANIMATION STUDIO TAB (Builder) --- */}
                    {activeTab === 'anim' && (
                        <div className="p-6 space-y-8">

                            {/* Global Timing */}
                            <section>
                                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3">Global Timing</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                                        <label className="text-xs font-medium text-[var(--text-primary)] mb-1 block">Duration</label>
                                        <select
                                            value={animations.duration}
                                            onChange={(e) => updateAnimation('duration', e.target.value)}
                                            className="input text-sm w-full bg-[var(--bg-card)]"
                                        >
                                            <option value="0.1s">Very Fast (0.1s)</option>
                                            <option value="0.2s">Fast (0.2s)</option>
                                            <option value="0.3s">Normal (0.3s)</option>
                                            <option value="0.5s">Slow (0.5s)</option>
                                            <option value="1s">Very Slow (1s)</option>
                                        </select>
                                    </div>
                                    <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                                        <label className="text-xs font-medium text-[var(--text-primary)] mb-1 block">Easing</label>
                                        <select
                                            value={animations.easing}
                                            onChange={(e) => updateAnimation('easing', e.target.value)}
                                            className="input text-sm w-full bg-[var(--bg-card)]"
                                        >
                                            <option value="linear">Linear</option>
                                            <option value="ease">Ease</option>
                                            <option value="ease-in">Ease In</option>
                                            <option value="ease-out">Ease Out</option>
                                            <option value="ease-in-out">Ease In/Out</option>
                                            <option value="cubic-bezier(0.4, 0, 0.2, 1)">Smooth</option>
                                            <option value="cubic-bezier(0.175, 0.885, 0.32, 1.275)">Bouncy</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-[var(--border-subtle)]"></div>

                            {/* Assigner */}
                            <section>
                                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3">Animation Mapping</h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                                        <label className="text-xs font-medium text-[var(--text-primary)] mb-1 block">Buttons</label>
                                        <select
                                            value={elementAnimations.button}
                                            onChange={(e) => updateElementMapping('button', e.target.value)}
                                            className="input text-sm w-full bg-[var(--bg-card)]"
                                        >
                                            <optgroup label="Presets">
                                                <option value="scale">Scale Up</option>
                                                <option value="lift">Lift Up</option>
                                                <option value="glow">Glow</option>
                                                <option value="none">None</option>
                                            </optgroup>
                                            <optgroup label="Custom">
                                                {customAnimations.map(a => <option key={a.id} value={`custom-${a.name}`}>{a.name}</option>)}
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                                        <label className="text-xs font-medium text-[var(--text-primary)] mb-1 block">Modals / Cards</label>
                                        <select
                                            value={elementAnimations.modal || 'zoom'}
                                            onChange={(e) => updateElementMapping('modal', e.target.value)}
                                            className="input text-sm w-full bg-[var(--bg-card)]"
                                        >
                                            <option value="zoom">Zoom In</option>
                                            <option value="slide">Slide Up</option>
                                            {customAnimations.map(a => <option key={a.id} value={`custom-${a.name}`}>{a.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-[var(--border-subtle)]"></div>

                            {/* Builder */}
                            <section>
                                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3 flex items-center justify-between">
                                    Create Animation
                                    <span className="text-[10px] bg-[var(--accent-purple)] text-white px-2 rounded-full">BETA</span>
                                </h3>

                                <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] space-y-4">
                                    <div>
                                        <label className="text-xs text-[var(--text-secondary)]">Name</label>
                                        <input type="text" placeholder="e.g. MyBounce" className="input w-full text-sm" id="anim-name-input" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-[var(--text-secondary)] block">Frames Logic (CSS)</label>
                                        <textarea
                                            className="input w-full text-xs font-mono h-24"
                                            placeholder={`0% { transform: scale(1); }\n50% { transform: scale(1.2); }\n100% { transform: scale(1); }`}
                                            id="anim-frames-input"
                                        ></textarea>
                                        <p className="text-[10px] text-[var(--text-tertiary)]">Enter standard CSS Keyframes logic.</p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const name = document.getElementById('anim-name-input').value;
                                            const frames = document.getElementById('anim-frames-input').value;
                                            if (name && frames) {
                                                addCustomAnimation(name, frames);
                                                // Clear inputs
                                                document.getElementById('anim-name-input').value = '';
                                                document.getElementById('anim-frames-input').value = '';
                                            }
                                        }}
                                        className="btn btn-primary w-full text-xs"
                                    >
                                        <FaPlus className="mr-2" /> Add Animation
                                    </button>
                                </div>

                                <div className="mt-4 space-y-2">
                                    {customAnimations.map(anim => (
                                        <div key={anim.id} className="flex justify-between items-center p-2 rounded border border-[var(--border-subtle)]">
                                            <span className="text-xs font-mono">{anim.name}</span>
                                            <button onClick={() => deleteCustomAnimation(anim.id)} className="text-[var(--error)] hover:opacity-75"><FaTrash /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* --- THEME TAB --- */}
                    {activeTab === 'theme' && (
                        // ... (Existing Theme Logic with subtabs replaced/kept)
                        <div className="flex flex-col min-h-full">
                            {/* Sub Tabs for Theme */}
                            <div className="flex px-6 pt-4 gap-2 shrink-0">
                                <button onClick={() => setActiveThemeSubTab('presets')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeThemeSubTab === 'presets' ? 'bg-[var(--accent-purple)] text-white' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'}`}>Presets</button>
                                <button onClick={() => setActiveThemeSubTab('custom')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeThemeSubTab === 'custom' ? 'bg-[var(--accent-purple)] text-white' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'}`}>Custom</button>
                            </div>

                            <div className="p-6">
                                {activeThemeSubTab === 'presets' ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {presets.map(preset => (
                                            <button key={preset} onClick={() => applyPreset(preset)} className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-purple)] text-left">
                                                <div className="text-xs font-medium text-[var(--text-primary)] mb-2">{preset}</div>
                                                <div className="flex gap-1">
                                                    <div className="h-3 w-3 rounded-full" style={{ background: 'var(--bg-deepest)' }}></div>
                                                    <div className="h-3 w-3 rounded-full" style={{ background: 'var(--accent-purple)' }}></div>
                                                    <div className="h-3 w-3 rounded-full" style={{ background: 'var(--accent-blue)' }}></div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <section>
                                            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3">Colors</h3>
                                            <div className="space-y-2">
                                                <ColorInput label="Background" variable="--bg-deepest" />
                                                <ColorInput label="Surface" variable="--bg-surface" />
                                                <ColorInput label="Primary Accent" variable="--accent-purple" />
                                                <ColorInput label="Secondary Accent" variable="--accent-blue" />
                                                <ColorInput label="Text" variable="--text-primary" />
                                            </div>
                                        </section>

                                        <button
                                            onClick={resetTheme}
                                            className="w-full py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] text-xs font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            <FaUndo className="text-[10px]" /> Reset Colors
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- FONTS TAB --- */}
                    {activeTab === 'fonts' && (
                        <div className="p-6">
                            <div className="space-y-3 mb-6">
                                {PREDEFINED_FONTS.map(font => (
                                    <button key={font.name} onClick={() => changeFont(font)} className={`w-full p-3 rounded-lg border text-left flex justify-between items-center ${currentFont.name === font.name ? 'border-[var(--accent-purple)] bg-[var(--bg-surface)]' : 'border-[var(--border-subtle)]'}`}>
                                        <span className="text-sm font-medium text-[var(--text-primary)]" style={{ fontFamily: font.family }}>{font.name}</span>
                                        {currentFont.name === font.name && <FaCheck className="text-[var(--accent-purple)] text-xs" />}
                                    </button>
                                ))}
                            </div>
                            {/* Custom Font Logic */}
                            <div className="p-4 bg-[var(--bg-surface)] rounded-xl">
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
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCustomFontApply}
                                                disabled={!customFontUrl}
                                                className="btn btn-primary whitespace-nowrap flex-1"
                                            >
                                                Apply
                                            </button>
                                            <button
                                                onClick={resetFont}
                                                className="btn btn-secondary whitespace-nowrap px-4"
                                                title="Reset to default font"
                                            >
                                                <FaUndo />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PROFILES TAB --- */}
                    {activeTab === 'profiles' && (
                        <div className="p-6 space-y-6">
                            <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                                <label className="text-xs font-medium text-[var(--text-primary)] mb-2 block">Save Current Setup</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newProfileName}
                                        onChange={(e) => setNewProfileName(e.target.value)}
                                        placeholder="Profile Name..."
                                        className="input text-sm w-full"
                                    />
                                    <button
                                        onClick={() => {
                                            if (newProfileName) {
                                                saveProfile(newProfileName);
                                                setNewProfileName('');
                                            }
                                        }}
                                        disabled={!newProfileName}
                                        className="btn btn-primary"
                                    >
                                        <FaSave />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {savedProfiles.length === 0 ? (
                                    <p className="text-center text-sm text-[var(--text-tertiary)] py-4">No saved profiles yet.</p>
                                ) : (
                                    savedProfiles.map(profile => (
                                        <div key={profile.id} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                                            <span className="text-sm font-medium text-[var(--text-primary)]">{profile.name}</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => loadProfile(profile)} className="p-2 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/10 rounded-lg"><FaUndo /></button>
                                                <button onClick={() => deleteProfile(profile.id)} className="p-2 text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg"><FaTrash /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- PERFORMANCE TAB --- */}
                    {activeTab === 'perf' && (
                        <div className="p-6 space-y-8">

                            {/* Lite Mode Banner */}
                            <div className="bg-gradient-to-r from-[var(--bg-deepest)] to-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-subtle)] shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[var(--accent-purple)]/5 group-hover:bg-[var(--accent-purple)]/10 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-[var(--accent-purple)] text-white rounded-lg shadow-lg">
                                            <FaTachometerAlt className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Lite Mode</h3>
                                            <p className="text-xs text-[var(--text-secondary)]">Max speed, zero lag.</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[var(--text-tertiary)] mb-4">
                                        Instantly disables all heavy visual effects (Blur, Shadows, 3D) for the most lightweight experience possible.
                                    </p>
                                    <button
                                        onClick={enableLiteMode}
                                        className="w-full py-2.5 rounded-xl bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/90 text-white font-semibold text-sm shadow-lg shadow-[var(--accent-purple)]/20 transition-all active:scale-[0.98]"
                                    >
                                        Activate Lite Mode
                                    </button>
                                </div>
                            </div>
                            {/* Strict CPU Mode (User Requested) */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                                <div>
                                    <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                                        Ultra Performance
                                        {performance.strictMode && <span className="text-[10px] bg-[var(--success)]/10 text-[var(--success)] px-2 py-0.5 rounded-full">ACTIVE</span>}
                                    </h3>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                                        Strictly disables GPU usage. No animations, transitions, or effects.
                                    </p>
                                </div>
                                <button
                                    onClick={() => updatePerformance('strictMode', !performance.strictMode)}
                                    className={`relative w-12 h-7 rounded-full transition-colors ${performance.strictMode ? 'bg-[var(--success)]' : 'bg-[var(--bg-elevated)]'}`}
                                >
                                    <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform shadow-sm ${performance.strictMode ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>

                            {/* Suggestions Section */}
                            {(performance.enableGlassmorphism || performance.enableShadows || performance.enable3D) && (
                                <section>
                                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3 flex items-center gap-2">
                                        Optimization Suggestions
                                        <span className="bg-[var(--warning)]/10 text-[var(--warning)] text-[10px] px-2 rounded-full">
                                            {(performance.enableGlassmorphism ? 1 : 0) + (performance.enableShadows ? 1 : 0) + (performance.enable3D ? 1 : 0)} Issues
                                        </span>
                                    </h3>
                                    <div className="space-y-3">
                                        {performance.enableGlassmorphism && (
                                            <div className="flex items-center justify-between p-3 bg-[var(--bg-surface)] rounded-xl border-l-4 border-l-[var(--warning)] border-y border-r border-[var(--border-subtle)]">
                                                <div>
                                                    <p className="text-sm font-medium text-[var(--text-primary)]">Heavy Blur Detected</p>
                                                    <p className="text-[10px] text-[var(--text-tertiary)]">Glassmorphism uses significant GPU power.</p>
                                                </div>
                                                <button onClick={() => updatePerformance('enableGlassmorphism', false)} className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] text-xs rounded-lg font-medium border border-[var(--border-subtle)]">
                                                    Disable
                                                </button>
                                            </div>
                                        )}
                                        {performance.enableShadows && (
                                            <div className="flex items-center justify-between p-3 bg-[var(--bg-surface)] rounded-xl border-l-4 border-l-[var(--warning)] border-y border-r border-[var(--border-subtle)]">
                                                <div>
                                                    <p className="text-sm font-medium text-[var(--text-primary)]">Shadows Active</p>
                                                    <p className="text-[10px] text-[var(--text-tertiary)]">Drop shadows can cause scroll lag.</p>
                                                </div>
                                                <button onClick={() => updatePerformance('enableShadows', false)} className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] text-xs rounded-lg font-medium border border-[var(--border-subtle)]">
                                                    Disable
                                                </button>
                                            </div>
                                        )}
                                        {performance.enable3D && (
                                            <div className="flex items-center justify-between p-3 bg-[var(--bg-surface)] rounded-xl border-l-4 border-l-[var(--warning)] border-y border-r border-[var(--border-subtle)]">
                                                <div>
                                                    <p className="text-sm font-medium text-[var(--text-primary)]">3D Transforms</p>
                                                    <p className="text-[10px] text-[var(--text-tertiary)]">Avoid complex perspective calculations.</p>
                                                </div>
                                                <button onClick={() => updatePerformance('enable3D', false)} className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] text-xs rounded-lg font-medium border border-[var(--border-subtle)]">
                                                    Disable
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Manual Toggles (Existing but refined) */}
                            <section>
                                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3">Manual Control</h3>
                                <div className="space-y-2">
                                    {[
                                        { key: 'enableGlassmorphism', label: 'Glassmorphism (Blur)', desc: 'High GPU Usage' },
                                        { key: 'enableShadows', label: 'Drop Shadows', desc: 'Moderate GPU Usage' },
                                        { key: 'enable3D', label: '3D Transforms', desc: 'Low-Med GPU Usage' },
                                        { key: 'enableAnimations', label: 'UI Animations', desc: 'CPU Usage' },
                                    ].map(item => (
                                        <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                                            <div>
                                                <div className="text-sm font-medium text-[var(--text-primary)]">{item.label}</div>
                                                <div className="text-[10px] text-[var(--text-secondary)]">{item.desc}</div>
                                            </div>
                                            <button
                                                onClick={() => updatePerformance(item.key, !performance[item.key])}
                                                className={`relative w-10 h-6 rounded-full transition-colors ${performance[item.key] ? 'bg-[var(--accent-purple)]' : 'bg-[var(--bg-elevated)]'}`}
                                            >
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${performance[item.key] ? 'translate-x-4' : ''}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                </div>

                {/* Footer - Reset All */}
                <div className="p-4 border-t border-[var(--border-subtle)] bg-transparent">
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to reset all appearance settings to default?')) {
                                resetAll();
                            }
                        }}
                        className="w-full py-3 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white hover:border-[var(--text-primary)] transition-all font-medium text-sm flex items-center justify-center gap-2 group"
                    >
                        <FaUndo className="group-hover:-rotate-180 transition-transform duration-500" />
                        Reset All Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
