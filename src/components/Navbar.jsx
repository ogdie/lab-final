'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useThemeLanguage } from '../context/ThemeLanguageContext'; 
import ConnectionNotification from './ConnectionNotification';
import CodemiaLogo from './CodemiaLogo'; 

const getStyles = (theme) => {
    const isDark = theme === 'dark';
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    const textSecondary = isDark ? '#b0b3b8' : '#606770';
    const backgroundNavbar = isDark ? '#202124' : 'white';
    const borderNavbar = isDark ? '#3e4042' : '#e0e0e0';
    const backgroundSearch = isDark ? '#3a3b3c' : '#eef3f8';
    const blueAction = '#0a66c2';
    const logoColor = isDark ? textPrimary : blueAction; 

    return {
        navbar: {
            backgroundColor: backgroundNavbar,
            borderBottom: `1px solid ${borderNavbar}`,
            padding: '0.4rem 0', 
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem'
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            height: '50px', 
            textDecoration: 'none',
            color: logoColor 
        },
        svgLogoStyle: { // ESTILOS AGRESSIVOS DE DIMENSIONAMENTO PARA O SVG INLINE
            height: '120px',
            width: '200px', 
            display: 'block',
        },
        searchContainer: {
            flex: 1,
            maxWidth: '400px',
            margin: '0 2rem',
            position: 'relative'
        },
        searchInput: {
            width: '100%',
            padding: '0.5rem 1rem',
            border: isDark ? 'none' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            paddingRight: '2rem',
            backgroundColor: backgroundSearch,
            color: textPrimary,
        },
        clearButton: {
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: textSecondary,
        },
        rightSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        },
        iconButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.4rem',
            position: 'relative',
            padding: '0.5rem',
            color: textSecondary,
            transition: 'color 0.2s',
        },
        badge: {
            position: 'absolute',
            top: 0,
            right: 0,
            background: '#f44336',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: textPrimary,
        },
        avatar: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover'
        },
        logoutButton: {
            padding: '0.4rem 0.8rem',
            background: isDark ? '#5c0000' : '#d32f2f', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
        }
    };
};

export default function Navbar({ user, onSearch = () => {}, onNotificationsClick }) {
    const { theme } = useThemeLanguage();
    const styles = getStyles(theme);

    const [searchTerm, setSearchTerm] = useState('');
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [showConnectionNotifications, setShowConnectionNotifications] = useState(false); 

    // Lógica para alternar a visibilidade das notificações
    const handleNotificationsClick = () => {
        setShowConnectionNotifications(prev => !prev);
        if (onNotificationsClick) {
            onNotificationsClick();
        }
    };
    
    // Busca ao digitar (debounce curto)
    useEffect(() => {
        const term = searchTerm.trim();
        const id = setTimeout(() => {
            if (term) {
                onSearch(term);
            }
        }, 250);
        return () => clearTimeout(id);
    }, [searchTerm, onSearch]);

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                {/* USA O NOVO COMPONENTE */}
                <Link href="/home" style={styles.logo}>
                    <CodemiaLogo style={styles.svgLogoStyle} />
                </Link>

                {/* Search Bar */}
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Buscar posts e usuários..."
                        aria-label="Buscar posts e usuários"
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchTerm(value);
                            if (value.trim() === '') {
                                onSearch('');
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const q = searchTerm.trim();
                                onSearch(q);
                            }
                        }}
                    />
                    {searchTerm && (
                        <>
                            <button
                                style={{ ...styles.clearButton, right: '2rem' }}
                                onClick={() => {
                                    const q = searchTerm.trim();
                                    onSearch(q);
                                }}
                                aria-label="Executar busca"
                                title="Buscar"
                            >
                                🔍
                            </button>
                            <button
                                style={styles.clearButton}
                                onClick={() => {
                                    setSearchTerm('');
                                    onSearch('');
                                }}
                                aria-label="Limpar busca"
                                title="Limpar"
                            >
                                ✖️
                            </button>
                        </>
                    )}
                </div>

                {/* Ícones e Perfil */}
                <div style={styles.rightSection}>
                    {/* Botão de Notificações com badge */}
                    <button 
                        style={styles.iconButton}
                        onClick={handleNotificationsClick} 
                        title="Notificações de Conexão"
                    >
                        🔔 {notificationsCount > 0 && <span style={styles.badge}>{notificationsCount}</span>}
                    </button>
                    
                    {/* Outros Ícones */}
                    <Link href="/chat" style={styles.iconButton} title="Chat">💬</Link>
                    <Link href="/forum" style={styles.iconButton} title="Fórum">📢</Link>
                    <Link href="/settings" style={styles.iconButton} title="Configurações">⚙️</Link>

                    {/* Informações do Usuário (Avatar e Nome) */}
                    {user && (
                        <Link href={`/profile?id=${user._id}`} style={styles.userInfo} title="Meu perfil">
                            <img 
                                src={user.profilePicture || '/default-avatar.svg'} 
                                alt={user.name}
                                style={styles.avatar}
                            />
                            <span>{user.name}</span>
                        </Link>
                    )}
                    
                    {/* Botão de Sair */}
                    {user && (
                        <button 
                            onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/';
                            }}
                            style={styles.logoutButton}
                            title="Sair"
                        >
                            Sair
                        </button>
                    )}
                </div>
            </div>

            {/* Componente de Notificações de Conexão */}
            {showConnectionNotifications && (
                <ConnectionNotification 
                    userId={user?._id} 
                    onClose={() => setShowConnectionNotifications(false)} 
                />
            )}
        </nav>
    );
}