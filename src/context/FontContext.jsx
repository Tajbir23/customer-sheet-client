import React, { createContext, useContext, useEffect, useState } from 'react';

const FontContext = createContext();

export const useFont = () => useContext(FontContext);

const DEFAULT_FONT = {
    name: 'Inter',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    family: "'Inter', sans-serif"
};

export const FontProvider = ({ children }) => {
    const [currentFont, setCurrentFont] = useState(() => {
        const savedFont = localStorage.getItem('app_font');
        return savedFont ? JSON.parse(savedFont) : DEFAULT_FONT;
    });

    // Inject font link into head
    useEffect(() => {
        if (!currentFont || !currentFont.url) return;

        // Check if link already exists
        let link = document.getElementById('dynamic-font-link');
        if (!link) {
            link = document.createElement('link');
            link.id = 'dynamic-font-link';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        link.href = currentFont.url;

        // Update CSS variable
        document.documentElement.style.setProperty('--font-primary', currentFont.family);

        // Save to localStorage
        localStorage.setItem('app_font', JSON.stringify(currentFont));

    }, [currentFont]);

    const changeFont = (font) => {
        setCurrentFont(font);
    };

    const resetFont = () => {
        setCurrentFont(DEFAULT_FONT);
    };

    return (
        <FontContext.Provider value={{ currentFont, changeFont, resetFont, DEFAULT_FONT }}>
            {children}
        </FontContext.Provider>
    );
};
