import { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useRouter } from 'next/navigation';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import ChatPane from '../components/ChatPane';
import { chatAPI, usersAPI } from '../services/api';
import { FaStar } from 'react-icons/fa';

export default function Chat() {
  const router = useRouter();
  const { t, theme } = useThemeLanguage();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchPaused, setSearchPaused] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  // Notificar que o chat foi visitado sempre que a página for montada ou atualizada
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Disparar evento imediatamente
      window.dispatchEvent(new CustomEvent('chatVisited', { detail: { timestamp: Date.now() } }));
      
      // Também tentar atualizar via broadcast channel se disponível
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('chat-visited');
        channel.postMessage({ type: 'chatVisited', timestamp: Date.now() });
        channel.close();
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    let parsedUser = null;
    try {
      parsedUser = userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Invalid user data in localStorage:', e);
    }

    if (!token || !parsedUser?._id) {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    loadConversations(parsedUser._id);

    // Abrir conversa direto via query param ?userId=
    try {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get('userId');
      if (targetId) {
        usersAPI.getById(targetId).then((u) => {
          if (u && u._id) {
            setSelectedUser(u);
          }
        }).catch(() => {});
      }
    } catch {}

    // Polling para atualizar conversas em tempo real (a cada 3 segundos)
    const interval = setInterval(() => {
      if (parsedUser._id) {
        loadConversations(parsedUser._id, true); // skipLoading = true para não afetar o estado de loading
      }
    }, 3000);

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [router]);

  const loadConversations = async (userId, skipLoading = false) => {
    if (!userId) return;
    if (!skipLoading) {
      setError(null);
    }
    try {
      const data = await chatAPI.getConversations(userId);
      setConversations(prevConversations => {
        const newConversations = Array.isArray(data) ? data : [];
        
        // Se está carregando pela primeira vez, definir loading como false
        if (!skipLoading && loading) {
          setTimeout(() => setLoading(false), 0);
        }
        
        return newConversations;
      });
    } catch (err) {
      console.error('Error loading conversations:', err);
      if (!skipLoading) {
        setError('Não foi possível carregar as conversas.');
        setLoading(false);
      }
    }
  };

  const handleOpenChat = async (otherUser) => {
    if (!otherUser?._id) return;
    setSelectedUser(otherUser);
    
    // Marcar mensagens como lidas ao abrir a conversa
    if (user?._id) {
      try {
        const { chatAPI } = await import('../services/api');
        await chatAPI.markAsRead(otherUser._id, user._id);
        // Recarregar conversas para atualizar o badge
        await loadConversations(user._id);
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    }
  };

  const handleMessagesRead = async () => {
    // Recarregar conversas quando mensagens são marcadas como lidas
    if (user?._id) {
      await loadConversations(user._id);
    }
  };


  const handleSearch = async (query) => {
    if (!query?.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchPaused(false);
      setLastSearchQuery('');
      return;
    }

    // Se a pesquisa está pausada e a query não mudou, não fazer nada
    if (searchPaused && query === lastSearchQuery) {
      return;
    }

    // Se a query mudou, reativar a pesquisa
    if (query !== lastSearchQuery) {
      setSearchPaused(false);
    }

    try {
      const users = await usersAPI.searchUsers(query);
      setSearchResults(Array.isArray(users) ? users : []);
      setShowSearchResults(true);
      setLastSearchQuery(query);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    }
  };

  const handleCloseSearch = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchPaused(true); // Pausar a pesquisa para evitar reabertura automática
  };

  const styles = getStyles(theme);

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar 
          user={user} 
          onSearch={handleSearch}
        />
        <div style={styles.content}>
          <p style={styles.loading}>{t('loading')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Navbar 
          user={user} 
          onSearch={handleSearch}
        />
        <div style={styles.content}>
          <p style={styles.error}>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <Navbar 
        user={user} 
        onSearch={handleSearch}
      />

      {showSearchResults && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 999 
            }}
            onClick={handleCloseSearch}
          />
          <div 
            style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', background: theme === 'dark' ? '#2c2f33' : 'white', border: `1px solid #8B5CF6`, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', zIndex: 1001, width: '90%', maxWidth: '500px', maxHeight: '400px', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: `1px solid ${theme === 'dark' ? '#3e4042' : '#e0e0e0'}`, background: theme === 'dark' ? '#3a3b3c' : '#f8f9fa' }}>
              <h3 style={{ color: theme === 'dark' ? '#e4e6eb' : '#1d2129', margin: 0 }}>{t('search_results')}</h3>
              <button onClick={handleCloseSearch} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: theme === 'dark' ? '#b0b3b8' : '#666' }}>
                ✖
              </button>
            </div>
            {searchResults.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: theme === 'dark' ? '#b0b3b8' : '#666' }}>{t('no_users_found')}</p>
            ) : (
              searchResults.map((userResult) => (
                <div key={userResult._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: `1px solid ${theme === 'dark' ? '#3e4042' : '#f0f0f0'}` }}>
                  <img
                    src={userResult.profilePicture || '/default-avatar.svg'}
                    alt={userResult.name || 'Usuário'}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, color: theme === 'dark' ? '#e4e6eb' : '#1d2129' }}>{userResult.name || t('user')}</h4>
                    <p style={{ margin: '0.25rem 0', color: theme === 'dark' ? '#b0b3b8' : '#666' }}>{userResult.email || t('user')}</p>
                    <p style={{ margin: '2px 0', color: theme === 'dark' ? '#b0b3b8' : '#606770', fontSize: '0.85rem' }}>
                      <FaStar /> {userResult.xp || 0} XP
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/profile?id=${userResult._id}`)}
                    style={{ padding: '0.5rem 1rem', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}
                  >
                    {t('view_profile')}
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <div style={{ display: 'flex', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ width: '320px', padding: '1rem', borderRight: `1px solid ${theme === 'dark' ? '#3e4042' : '#e0e0e0'}` }}>
          <h2 style={{ marginTop: 0, color: theme === 'dark' ? '#e4e6eb' : '#1d2129' }}>{t('messages_title')}</h2>
          <div style={styles.conversations}>
            {conversations.length === 0 ? (
              <p style={styles.empty}>{t('no_conversations')}</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.user?._id || conv._id || Math.random()}
                  onClick={() => handleOpenChat(conv.user)}
                  style={styles.conversationItem}
                >
                  <img
                    src={conv.user?.profilePicture || '/default-avatar.svg'}
                    alt={conv.user?.name || 'Usuário'}
                    style={styles.avatar}
                  />
                  <div style={styles.info}>
                    <h3 style={styles.name}>
                      {conv.user?.name || 'Usuário desconhecido'}
                    </h3>
                    <p style={styles.lastMessage}>
                      {conv.lastMessage?.content || t('no_messages')}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <span style={styles.badge}>{conv.unread}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div style={{ flex: 1, padding: '1rem' }}>
          {selectedUser ? (
            <ChatPane
              currentUser={user}
              otherUser={selectedUser}
              onConversationDeleted={(otherId) => {
                setConversations(prev => prev.filter(c => (c.user?._id || '') !== otherId));
                setSelectedUser(null);
              }}
              onMessageSent={(otherUser, message) => {
                // Recarregar as conversas para garantir que a nova conversa apareça na lista
                if (user?._id) {
                  loadConversations(user._id);
                }
              }}
              onMessagesRead={handleMessagesRead}
            />
          ) : (
            <p style={styles.empty}>{t('click_to_open_chat')}</p>
          )}
        </div>
      </div>



      <Footer />
    </div>
  );
}
const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const backgroundCard = isDark ? '#2c2f33' : 'white';
  const borderSubtle = isDark ? '#3e4042' : '#e0e0e0';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#666';
  const backgroundPrimary = isDark ? '#1d2226' : '#f3f2ef';
  
  return {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: backgroundPrimary,
      color: textPrimary,
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      flex: 1,
    },
    conversations: {
      marginTop: '2rem',
    },
    empty: {
      textAlign: 'center',
      color: textSecondary,
      padding: '2rem',
      fontSize: '1.1rem',
    },
    conversationItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      background: backgroundCard,
      border: `1px solid ${borderSubtle}`,
      borderRadius: '8px',
      marginBottom: '1rem',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    conversationItemHover: {
      background: isDark ? '#3a3b3c' : '#f5f5f5',
    },
    avatar: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    info: {
      flex: 1,
    },
    name: {
      margin: 0,
      fontSize: '1.1rem',
      marginBottom: '0.25rem',
      color: textPrimary,
    },
    lastMessage: {
      margin: 0,
      color: textSecondary,
      fontSize: '0.9rem',
    },
    badge: {
      background: '#8B5CF6',
      color: 'white',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.8rem',
      fontWeight: 'bold',
    },
    loading: {
      textAlign: 'center',
      padding: '2rem',
      fontSize: '1.1rem',
      color: textSecondary,
    },
    error: {
      textAlign: 'center',
      padding: '2rem',
      fontSize: '1.1rem',
      color: '#d32f2f',
    },
  };
};
