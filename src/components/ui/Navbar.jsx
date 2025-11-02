'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useThemeLanguage } from '../../context/ThemeLanguageContext'; 
import Notificacoes from '../Notificacoes';
import CodemiaLogo from './CodemiaLogo';
import { FaBell, FaComments, FaBullhorn, FaCog, FaSearch, FaTimes } from 'react-icons/fa'; 

const getStyles = (theme) => {
    const isDark = theme === 'dark';
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    const textSecondary = isDark ? '#b0b3b8' : '#606770';
    const backgroundNavbar = isDark ? '#202124' : 'white';
    const borderNavbar = isDark ? '#3e4042' : '#e0e0e0';
    const backgroundSearch = isDark ? '#3a3b3c' : '#eef3f8';
    const blueAction = '#8B5CF6';
    const logoColor = blueAction; // Sempre usa #8B5CF6 

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
            color: blueAction, // Garante que a logo sempre use #8B5CF6
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
            borderRadius: '24px',
            cursor: 'pointer',
            fontWeight: '600',
        }
    };
};

export default function Navbar({ user, onSearch = () => {}, onNotificationsClick }) {
    const { theme, t } = useThemeLanguage();
    const styles = getStyles(theme);

    const [searchTerm, setSearchTerm] = useState('');
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [showConnectionNotifications, setShowConnectionNotifications] = useState(false); 

    // Buscar notificações não lidas
    useEffect(() => {
        if (user?._id) {
            fetchUnreadNotifications();
            fetchUnreadMessages();
            // Polling para atualizar notificações a cada 5 segundos (tempo real)
            // Mensagens também são atualizadas a cada 5 segundos
            const notificationsInterval = setInterval(() => {
                fetchUnreadNotifications();
            }, 5000);
            
            const messagesInterval = setInterval(() => {
                fetchUnreadMessages();
            }, 5000);
            
            return () => {
                clearInterval(notificationsInterval);
                clearInterval(messagesInterval);
            };
        }
    }, [user?._id]);

    // Listener para atualizar contador quando entrar no chat
    useEffect(() => {
        const handleChatVisited = () => {
            // Zerar imediatamente
            setUnreadMessagesCount(0);
        };
        
        // Verificar se estamos na página de chat
        const checkChatPage = () => {
            if (typeof window !== 'undefined' && window.location.pathname === '/chat') {
                handleChatVisited();
            }
        };
        
        // Escutar evento customizado (prioridade alta)
        const eventHandler = (e) => {
            handleChatVisited();
        };
        window.addEventListener('chatVisited', eventHandler, true);
        
        // Escutar BroadcastChannel se disponível
        let broadcastChannel = null;
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            broadcastChannel = new BroadcastChannel('chat-visited');
            broadcastChannel.onmessage = (event) => {
                if (event.data.type === 'chatVisited') {
                    handleChatVisited();
                }
            };
        }
        
        // Verificar imediatamente ao montar
        checkChatPage();
        
        // Verificar periodicamente se estamos na página de chat (fallback mais frequente)
        const interval = setInterval(checkChatPage, 500);
        
        return () => {
            window.removeEventListener('chatVisited', eventHandler, true);
            clearInterval(interval);
            if (broadcastChannel) {
                broadcastChannel.close();
            }
        };
    }, []);

    const fetchUnreadNotifications = async () => {
        if (!user?._id) return;
        try {
            const { notificationsAPI } = await import('../../services/api');
            const notifications = await notificationsAPI.getAll(user._id);
            const unreadCount = Array.isArray(notifications) 
                ? notifications.filter(n => !n.read).length 
                : 0;
            setNotificationsCount(unreadCount);
        } catch (err) {
            console.error('Error fetching unread notifications:', err);
        }
    };

    const fetchUnreadMessages = async () => {
        if (!user?._id) return;
        try {
            const { chatAPI } = await import('../../services/api');
            const conversations = await chatAPI.getConversations(user._id);
            const totalUnread = Array.isArray(conversations)
                ? conversations.reduce((sum, conv) => sum + (conv.unread || 0), 0)
                : 0;
            setUnreadMessagesCount(totalUnread);
        } catch (err) {
            console.error('Error fetching unread messages:', err);
        }
    };

    // Lógica para alternar a visibilidade das notificações
    const handleNotificationsClick = async () => {
        const willShow = !showConnectionNotifications;
        setShowConnectionNotifications(willShow);
        
        // Se está abrindo, marcar todas como lidas
        if (willShow && user?._id && notificationsCount > 0) {
            try {
                const { notificationsAPI } = await import('../../services/api');
                const notifications = await notificationsAPI.getAll(user._id);
                const unreadNotifications = Array.isArray(notifications) 
                    ? notifications.filter(n => !n.read) 
                    : [];
                
                // Marcar todas como lidas
                await Promise.all(
                    unreadNotifications.map(n => notificationsAPI.markAsRead(n._id))
                );
                
                // Atualizar contador
                setNotificationsCount(0);
            } catch (err) {
                console.error('Error marking notifications as read:', err);
            }
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
                        placeholder={t('search_placeholder')}
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
                                <FaSearch />
                            </button>
                            <button
                                style={styles.clearButton}
                                onClick={() => {
                                    setSearchTerm('');
                                    onSearch('');
                                }}
                                aria-label={t('clear')}
                                title={t('clear')}
                            >
                                <FaTimes />
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
                        title={t('notifications')}
                    >
                        <FaBell /> 
                        {notificationsCount > 0 && (
                            <span style={{
                                ...styles.badge,
                                background: '#f44336',
                                width: notificationsCount > 99 ? '24px' : '20px',
                                height: notificationsCount > 99 ? '20px' : '20px',
                                borderRadius: notificationsCount > 99 ? '10px' : '50%',
                                fontSize: notificationsCount > 99 ? '0.7rem' : '0.75rem',
                                padding: notificationsCount > 99 ? '2px 6px' : '0'
                            }}>
                                {notificationsCount > 99 ? '99+' : notificationsCount}
                            </span>
                        )}
                    </button>
                    
                    {/* Outros Ícones */}
                    <Link href="/chat" style={styles.iconButton} title={t('chat')}>
                        <FaComments />
                        {unreadMessagesCount > 0 && (
                            <span style={{
                                ...styles.badge,
                                background: '#f44336',
                                width: unreadMessagesCount > 99 ? '24px' : '20px',
                                height: unreadMessagesCount > 99 ? '20px' : '20px',
                                borderRadius: unreadMessagesCount > 99 ? '10px' : '50%',
                                fontSize: unreadMessagesCount > 99 ? '0.7rem' : '0.75rem',
                                padding: unreadMessagesCount > 99 ? '2px 6px' : '0'
                            }}>
                                {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                            </span>
                        )}
                    </Link>
                    <Link href="/forum" style={styles.iconButton} title={t('forum')}>
                        <FaBullhorn />
                    </Link>
                    <Link href="/settings" style={styles.iconButton} title={t('settings')}>
                        <FaCog />
                    </Link>

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
                            title={t('logout')}
                        >
                            {t('logout')}
                        </button>
                    )}
                </div>
            </div>

            {/* Componente de Notificações de Conexão */}
            {showConnectionNotifications && (
                <Notificacoes 
                    userId={user?._id} 
                    onClose={() => {
                        setShowConnectionNotifications(false);
                        // Atualizar contador ao fechar
                        fetchUnreadNotifications();
                    }}
                    onNotificationsUpdated={fetchUnreadNotifications}
                />
            )}
        </nav>
    );
}