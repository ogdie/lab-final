import { useEffect, useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import AlertModal from './ui/AlertModal';
import { chatAPI } from '../services/api';
import { FaTimes } from 'react-icons/fa';

export default function ChatPane({ currentUser, otherUser, onConversationDeleted, onMessageSent, onMessagesRead }) {
  const { t, theme } = useThemeLanguage();
  const styles = getStyles(theme);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [alert, setAlert] = useState({ isOpen: false, message: '', title: 'Aviso', onConfirm: null, showCancel: false });
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  useEffect(() => {
    if (currentUser?._id && otherUser?._id) {
      fetchMessages();
      setSelectedMessageId(null);
      

      const interval = setInterval(() => {
        fetchMessages();
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [currentUser?._id, otherUser?._id]);

  useEffect(() => {
    if (currentUser?._id && otherUser?._id && messages.length > 0) {
      markMessagesAsRead();
    }
  }, [currentUser?._id, otherUser?._id, messages.length]);

  const markMessagesAsRead = async () => {
    if (!currentUser?._id || !otherUser?._id) return;
    try {
      const hasUnread = messages.some(msg => !msg.read && msg.sender._id === otherUser._id);
      if (!hasUnread) return;

      await chatAPI.markAsRead(otherUser._id, currentUser._id);
      
      setMessages(prev => prev.map(msg => 
        msg.sender._id === otherUser._id && !msg.read 
          ? { ...msg, read: true }
          : msg
      ));

      if (typeof onMessagesRead === 'function') {
        onMessagesRead();
      }
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const fetchMessages = async () => {
    if (!currentUser?._id || !otherUser?._id) return;
    try {
      const res = await fetch(`/api/chat/${otherUser._id}/messages?currentUserId=${currentUser._id}`);
      const data = await res.json();
      const newMessages = Array.isArray(data) ? data : [];
      
      setMessages(prevMessages => {
        if (prevMessages.length === 0) return newMessages;
        
        const prevIds = new Set(prevMessages.map(m => m._id?.toString()));
        const newIds = new Set(newMessages.map(m => m._id?.toString()));
        
        const hasNewMessages = newMessages.some(m => !prevIds.has(m._id?.toString()));
        const hasRemovedMessages = prevMessages.some(m => !newIds.has(m._id?.toString()));
        
        if (hasNewMessages || hasRemovedMessages || newMessages.length !== prevMessages.length) {
          return newMessages;
        }
        
        return prevMessages;
      });
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const res = await fetch(`/api/chat/${otherUser._id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: currentUser._id, content: newMessage })
      });
      const message = await res.json();
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
      if (typeof onMessageSent === 'function') {
        onMessageSent(otherUser, message);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleDeleteConversation = async () => {
    const confirmDelete = async () => {
      try {
        await fetch(`/api/chat/${otherUser._id}?currentUserId=${currentUser._id}`, { method: 'DELETE' });
        setMessages([]);
        if (typeof onConversationDeleted === 'function') onConversationDeleted(otherUser._id);
      } catch (err) {
        console.error('Error deleting conversation:', err);
      }
    };
    setAlert({
      isOpen: true,
      message: 'Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.',
      title: 'Excluir conversa?',
      onConfirm: confirmDelete,
      showCancel: true,
    });
  };

  const handleDeleteMessage = async (e, messageId) => {
    e.stopPropagation();
    if (!currentUser?._id) return;
    try {
      const response = await fetch(`/api/chat/messages/${messageId}?currentUserId=${currentUser._id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao deletar mensagem');
      }
      
      setMessages(prev => prev.filter(m => {
        const msgId = m._id?.toString();
        const deleteId = messageId?.toString();
        return msgId !== deleteId;
      }));
      
      if (selectedMessageId === messageId) {
        setSelectedMessageId(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handleMessageClick = (messageId) => {
    if (selectedMessageId === messageId) {
      setSelectedMessageId(null);
    } else {
      setSelectedMessageId(messageId);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0, color: styles.textPrimary }}>{otherUser?.name || t('user')}</h3>
        <button onClick={handleDeleteConversation} style={styles.deleteConvButton}>🗑️</button>
      </div>
      <div 
        style={styles.messages}
        onClick={(e) => {

          if (e.target === e.currentTarget || e.target.closest('form')) {
            setSelectedMessageId(null);
          }
        }}
      >
        {messages.map((msg) => {
          const isSelected = selectedMessageId === msg._id;
          const isOwnMessage = msg.sender._id === currentUser._id;
          return (
            <div
              key={msg._id}
              onClick={() => isOwnMessage && handleMessageClick(msg._id)}
              style={{
                ...styles.message,
                alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                background: isOwnMessage 
                  ? (isSelected ? '#9d68f7' : '#8B5CF6') 
                  : styles.messageOtherBg,
                color: isOwnMessage ? 'white' : styles.messageOtherColor,
                cursor: isOwnMessage ? 'pointer' : 'default',
                opacity: isSelected ? 0.95 : 1,
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              <span>{msg.content}</span>
              {isOwnMessage && isSelected && (
                <button 
                  onClick={(e) => handleDeleteMessage(e, msg._id)} 
                  style={styles.deleteMsgButton}
                  title={t('delete') || 'Deletar'}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSend} style={styles.form}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('type_a_message')}
          style={styles.input}
        />
        <button type="submit" style={styles.sendButton}>{t('send')}</button>
      </form>

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        title={alert.title}
        onConfirm={alert.onConfirm}
        showCancel={alert.showCancel}
      />
    </div>
  );
}

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#606770';
  const backgroundCard = isDark ? '#2c2f33' : 'white';
  const borderSubtle = isDark ? '#3e4042' : '#e0e0e0';
  const backgroundSecondary = isDark ? '#3a3b3c' : '#f8f9fa';

  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 160px)',
      border: `1px solid ${borderSubtle}`,
      borderRadius: 8,
      overflow: 'hidden',
      background: backgroundCard,
    },
    header: {
      padding: '0.75rem 1rem',
      borderBottom: `1px solid ${borderSubtle}`,
      background: backgroundSecondary,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    messages: {
      flex: 1,
      padding: '1rem',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      background: backgroundCard,
    },
    message: {
      padding: '0.6rem 0.8rem',
      borderRadius: 8,
      maxWidth: '70%',
      display: 'inline-flex',
      gap: '8px',
      alignItems: 'center',
    },
    messageOtherBg: isDark ? '#3e4042' : '#f0f0f0',
    messageOtherColor: isDark ? '#e4e6eb' : '#1d2129',
    deleteConvButton: {
      border: `1px solid ${borderSubtle}`,
      background: backgroundCard,
      borderRadius: 6,
      cursor: 'pointer',
      padding: '4px 8px',
      color: textPrimary,
    },
    deleteMsgButton: {
      background: 'transparent',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer'
    },
    form: {
      display: 'flex',
      padding: '0.75rem',
      borderTop: `1px solid ${borderSubtle}`,
      background: backgroundCard,
    },
    input: {
      flex: 1,
      padding: '0.6rem 0.8rem',
      border: `1px solid ${borderSubtle}`,
      borderRadius: '4px 0 0 4px',
      background: backgroundCard,
      color: textPrimary,
    },
    sendButton: {
      padding: '0.6rem 1rem',
      background: '#8B5CF6',
      color: 'white',
      border: 'none',
      borderRadius: '0 4px 4px 0',
      cursor: 'pointer'
    },
    textPrimary,
    textSecondary,
  };
};