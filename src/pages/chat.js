import { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatModal from '../components/ChatModal';
import { chatAPI, usersAPI } from '../services/api';

export default function Chat() {
  const router = useRouter();
  const { t } = useThemeLanguage();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

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
  }, [router]);

  const loadConversations = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatAPI.getConversations(userId);
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Não foi possível carregar as conversas.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (otherUser) => {
    if (!otherUser?._id) return;
    setSelectedUser(otherUser);
    setShowChatModal(true);
  };

  const handleCloseModal = () => {
    setShowChatModal(false);
    setSelectedUser(null);
  };

  const handleSearch = async (query) => {
    if (!query?.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const users = await usersAPI.searchUsers(query);
      setSearchResults(Array.isArray(users) ? users : []);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    }
  };

  const handleCloseSearch = () => {
    setShowSearchResults(false);
    setSearchResults([]);
  };

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
        <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', zIndex: 1000, width: '90%', maxWidth: '500px', maxHeight: '400px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e0e0e0', background: '#f8f9fa' }}>
            <h3>Resultados da busca</h3>
            <button onClick={handleCloseSearch} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}>
              ✖
            </button>
          </div>
          {searchResults.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Nenhum usuário encontrado</p>
          ) : (
            searchResults.map((userResult) => (
              <div key={userResult._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                <img
                  src={userResult.profilePicture || '/default-avatar.svg'}
                  alt={userResult.name || 'Usuário'}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h4>{userResult.name || 'Nome indisponível'}</h4>
                  <p>{userResult.email || 'Email indisponível'}</p>
                  <p>⭐ {userResult.xp || 0} XP</p>
                </div>
                <button
                  onClick={() => router.push(`/profile?id=${userResult._id}`)}
                  style={{ padding: '0.5rem 1rem', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}
                >
                  Ver Perfil
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div style={styles.content}>
        <h1>{t('messages_title')}</h1>

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

      {showChatModal && (
        <ChatModal
          isOpen={showChatModal}
          onClose={handleCloseModal}
          currentUser={user}
          otherUser={selectedUser}
        />
      )}

      <Footer />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
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
    color: '#666',
    padding: '2rem',
    fontSize: '1.1rem',
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
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
  },
  lastMessage: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem',
  },
  badge: {
    background: '#4F46E5',
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
    color: '#555',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
    color: '#d32f2f',
  },
};