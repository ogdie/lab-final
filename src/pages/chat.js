import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatModal from '../components/ChatModal';
import { chatAPI } from '../services/api';

export default function Chat() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.content}>
          <p style={styles.loading}>Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.content}>
          <p style={styles.error}>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar user={user} />

      <div style={styles.content}>
        <h1>Mensagens</h1>

        <div style={styles.conversations}>
          {conversations.length === 0 ? (
            <p style={styles.empty}>Nenhuma conversa ainda</p>
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
                    {conv.lastMessage?.content || 'Sem mensagens'}
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
    background: '#2196F3',
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