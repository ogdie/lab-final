'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
// 1. IMPORTAR O HOOK DO CONTEXTO GLOBAL
import { useThemeLanguage } from '../context/ThemeLanguageContext'; 

import ConnectionNotification from './ConnectionNotification';

// --- FUNÇÃO DE ESTILO DINÂMICO ---
const getStyles = (theme) => {
    const isDark = theme === 'dark';
    // Paleta de cores (Consistente com o Settings.js)
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    const textSecondary = isDark ? '#b0b3b8' : '#606770';
    const backgroundNavbar = isDark ? '#202124' : 'white'; // Fundo da Navbar
    const borderNavbar = isDark ? '#3e4042' : '#e0e0e0'; // Borda e separadores
    const backgroundSearch = isDark ? '#3a3b3c' : '#eef3f8'; // Fundo da Busca (LinkedIn)
    const blueAction = '#0a66c2'; // Azul de ação

    return {
        // Estilo principal da Navbar
        navbar: {
            backgroundColor: backgroundNavbar,
            borderBottom: `1px solid ${borderNavbar}`,
            padding: '0.75rem 0', // Um pouco mais compacto
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
        // Logo (Cor primária)
        logo: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: blueAction, // Logo com cor de destaque
            textDecoration: 'none'
        },
        searchContainer: {
            flex: 1,
            maxWidth: '400px', // Um pouco menor
            margin: '0 2rem'
        },
        // Campo de Busca
        searchInput: {
            width: '100%',
            padding: '0.5rem 1rem',
            border: isDark ? 'none' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            paddingRight: '2rem',
            backgroundColor: backgroundSearch, // Fundo cinza claro/escuro
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
        // Botões de Ícones
        iconButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.4rem', // Ícones um pouco maiores
            position: 'relative',
            padding: '0.5rem',
            color: textSecondary, // Cor dos ícones
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
        // Informações do Usuário
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: textPrimary, // Cor do texto
        },
        avatar: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover'
        },
        // Botão de Logout
        logoutButton: {
            padding: '0.4rem 0.8rem', // Mais compacto
            background: isDark ? '#5c0000' : '#d32f2f', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
        }
    };
};
// --- FIM DA FUNÇÃO DE ESTILO DINÂMICO ---


export default function Navbar({ user, onSearch = () => {}, onNotificationsClick }) {
    // 2. OBTER O TEMA DO CONTEXTO
    const { theme } = useThemeLanguage();
    const styles = getStyles(theme);

    const [searchTerm, setSearchTerm] = useState('');
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [showConnectionNotifications, setShowConnectionNotifications] = useState(false);

    // Debounce e Notificações (Lógica inalterada)
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm.trim()) {
                onSearch(searchTerm.trim());
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, onSearch]);

    useEffect(() => {
        if (user?._id) {
            const fetchCount = async () => {
                // ... (Sua lógica de fetch de notificação permanece a mesma)
            };
            fetchCount();
            const interval = setInterval(fetchCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <Link href="/home" style={styles.logo}>CodeConnect</Link>
                
                <div style={{ ...styles.searchContainer, position: 'relative' }}>
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
                    />
                    {searchTerm && (
                        <button
                            style={styles.clearButton}
                            onClick={() => {
                                setSearchTerm('');
                                onSearch('');
                            }}
                            aria-label="Limpar busca"
                        >
                            ✖️
                        </button>
                    )}
                </div>

                <div style={styles.rightSection}>
                    {/* Botões de Ícones */}
                    <button 
                        style={styles.iconButton}
                        onClick={onNotificationsClick}
                        title="Notificações"
                    >
                        🔔 {notificationsCount > 0 && <span style={styles.badge}>{notificationsCount}</span>}
                    </button>
                    
                    <Link href="/chat" style={styles.iconButton} title="Chat">
                        💬
                    </Link>

                    <Link href="/forum" style={styles.iconButton} title="Fórum">
                        📢
                    </Link>

                    <Link href="/settings" style={styles.iconButton} title="Configurações">
                        ⚙️
                    </Link>

                    {/* Informações do Usuário */}
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
                    
                    {/* Botão de Logout */}
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
            
            {showConnectionNotifications && (
                <ConnectionNotification 
                    userId={user?._id} 
                    onClose={() => setShowConnectionNotifications(false)} 
                />
            )}
        </nav>
    );
}