import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatModal from '../components/ChatModal';
import { chatAPI } from '../services/api';

export default function Chat() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/';
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadConversations(parsedUser._id);
  }, []);

  const loadConversations = async (userId) => {
    try {
      const data = await chatAPI.getConversations(userId);
      setConversations(data);
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const handleOpenChat = (otherUser) => {
    setSelectedUser(otherUser);
    setShowChatModal(true);
  };

  return (
    <div style={styles.container}>
      <Navbar user={user} />
      
      <div style={styles.content}>
        <h1>Mensagens</h1>
        
        <div style={styles.conversations}>
          {conversations.length === 0 ? (
            <p style={styles.empty}>Nenhuma conversa ainda</p>
          ) : (
            conversations.map((conv, index) => (
              <div 
                key={index}
                onClick={() => handleOpenChat(conv.user)}
                style={styles.conversationItem}
              >
                <img 
                  src={conv.user.profilePicture || '/default-avatar.svg'} 
                  alt={conv.user.name}
                  style={styles.avatar}
                />
                <div style={styles.info}>
                  <h3 style={styles.name}>{conv.user.name}</h3>
                  <p style={styles.lastMessage}>{conv.lastMessage.content}</p>
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
          onClose={() => setShowChatModal(false)}
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
    flexDirection: 'column'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    flex: 1
  },
  conversations: {
    marginTop: '2rem'
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem',
    fontSize: '1.1rem'
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
    transition: 'background 0.2s'
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  info: {
    flex: 1
  },
  name: {
    margin: 0,
    fontSize: '1.1rem',
    marginBottom: '0.25rem'
  },
  lastMessage: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem'
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
    fontWeight: 'bold'
  }
};

