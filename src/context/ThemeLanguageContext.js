import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

// 1. Criação do Contexto
export const ThemeLanguageContext = createContext();

// Função de Estilo que já usamos no Settings.js
const applyGlobalStyles = (theme) => {
    const isDark = theme === 'dark';
    const backgroundPrimary = isDark ? '#18191a' : '#f0f2f5';
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    
    // Aplica o background e a cor de texto ao body para afetar toda a aplicação
    document.body.style.backgroundColor = backgroundPrimary;
    document.body.style.color = textPrimary;
};

// 2. Criação do Provedor (Provider)
export const ThemeLanguageProvider = ({ children }) => {
    const [theme, setThemeState] = useState('light');
    const [language, setLanguageState] = useState('pt');

    // Carrega tema e idioma salvos no localStorage na montagem
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedLanguage = localStorage.getItem('language') || 'pt';

        setThemeState(savedTheme);
        setLanguageState(savedLanguage);
        applyGlobalStyles(savedTheme);
    }, []);

    // Função global para mudar o tema
    const setTheme = useCallback((newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
        applyGlobalStyles(newTheme); // Aplica as cores globalmente
    }, []);

    // Função global para mudar o idioma
    const setLanguage = useCallback((newLang) => {
        setLanguageState(newLang);
        localStorage.setItem('language', newLang);
    }, []);

    // Objeto de valor fornecido ao contexto
    const contextValue = {
        theme,
        setTheme,
        language,
        setLanguage,
        isDark: theme === 'dark',
    };

    return (
        <ThemeLanguageContext.Provider value={contextValue}>
            {children}
        </ThemeLanguageContext.Provider>
    );
};

// 3. Hook Customizado para usar o Contexto facilmente
export const useThemeLanguage = () => {
    return useContext(ThemeLanguageContext);
};