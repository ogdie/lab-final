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

  useEffect(() => {
    if (currentUser?._id && otherUser?._id) {
      fetchMessages();
      
      // Polling para atualizar mensagens em tempo real (a cada 2 segundos)
      const interval = setInterval(() => {
        fetchMessages();
      }, 2000);
      
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, otherUser?._id]);

  useEffect(() => {
    // Quando o componente monta ou muda de conversa, marcar mensagens como lidas
    if (currentUser?._id && otherUser?._id && messages.length > 0) {
      markMessagesAsRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, otherUser?._id, messages.length]);

  const markMessagesAsRead = async () => {
    if (!currentUser?._id || !otherUser?._id) return;
    try {
      // Verificar se há mensagens não lidas
      const hasUnread = messages.some(msg => !msg.read && msg.sender._id === otherUser._id);
      if (!hasUnread) return;

      // Marcar como lidas no backend
      await chatAPI.markAsRead(otherUser._id, currentUser._id);
      
      // Atualizar estado local
      setMessages(prev => prev.map(msg => 
        msg.sender._id === otherUser._id && !msg.read 
          ? { ...msg, read: true }
          : msg
      ));

      // Notificar componente pai para atualizar lista de conversas
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
      
      // Verificar se há novas mensagens comparando com as existentes
      setMessages(prevMessages => {
        // Se não há mensagens anteriores, retornar as novas
        if (prevMessages.length === 0) return newMessages;
        
        // Verificar se há novas mensagens comparando IDs
        const prevIds = new Set(prevMessages.map(m => m._id?.toString()));
        const hasNewMessages = newMessages.some(m => !prevIds.has(m._id?.toString()));
        
        // Se há novas mensagens, atualizar
        if (hasNewMessages || newMessages.length !== prevMessages.length) {
          return newMessages;
        }
        
        // Se não há mudanças, manter o estado anterior (evita re-renders desnecessários)
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
      // Notificar o componente pai para atualizar a lista de conversas
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

  const handleDeleteMessage = async (messageId) => {
    try {
      await fetch(`/api/chat/messages/${messageId}`, { method: 'DELETE' });
      setMessages(prev => prev.filter(m => m._id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0, color: styles.textPrimary }}>{otherUser?.name || t('user')}</h3>
        <button onClick={handleDeleteConversation} style={styles.deleteConvButton}>🗑️</button>
      </div>
      <div style={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              ...styles.message,
              alignSelf: msg.sender._id === currentUser._id ? 'flex-end' : 'flex-start',
              background: msg.sender._id === currentUser._id ? '#4F46E5' : styles.messageOtherBg,
              color: msg.sender._id === currentUser._id ? 'white' : styles.messageOtherColor
            }}
          >
            <span>{msg.content}</span>
            {msg.sender._id === currentUser._id && (
              <button onClick={() => handleDeleteMessage(msg._id)} style={styles.deleteMsgButton}>
                <FaTimes />
              </button>
            )}
          </div>
        ))}
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
      background: '#4F46E5',
      color: 'white',
      border: 'none',
      borderRadius: '0 4px 4px 0',
      cursor: 'pointer'
    },
    textPrimary,
    textSecondary,
  };
};


