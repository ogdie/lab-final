import { useEffect, useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import AlertModal from './AlertModal';

export default function ChatPane({ currentUser, otherUser, onConversationDeleted }) {
  const { t } = useThemeLanguage();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [alert, setAlert] = useState({ isOpen: false, message: '', title: 'Aviso', onConfirm: null, showCancel: false });

  useEffect(() => {
    if (currentUser?._id && otherUser?._id) {
      fetchMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, otherUser?._id]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${otherUser._id}/messages?currentUserId=${currentUser._id}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
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
        <h3 style={{ margin: 0 }}>{otherUser?.name || t('user')}</h3>
        <button onClick={handleDeleteConversation} style={styles.deleteConvButton}>🗑️</button>
      </div>
      <div style={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              ...styles.message,
              alignSelf: msg.sender._id === currentUser._id ? 'flex-end' : 'flex-start',
              background: msg.sender._id === currentUser._id ? '#4F46E5' : '#f0f0f0',
              color: msg.sender._id === currentUser._id ? 'white' : 'black'
            }}
          >
            <span>{msg.content}</span>
            {msg.sender._id === currentUser._id && (
              <button onClick={() => handleDeleteMessage(msg._id)} style={styles.deleteMsgButton}>✖</button>
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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 160px)',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #e0e0e0',
    background: '#f8f9fa',
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
    background: 'white',
  },
  message: {
    padding: '0.6rem 0.8rem',
    borderRadius: 8,
    maxWidth: '70%',
    display: 'inline-flex',
    gap: '8px',
    alignItems: 'center',
  },
  deleteConvButton: {
    border: '1px solid #e0e0e0',
    background: 'white',
    borderRadius: 6,
    cursor: 'pointer',
    padding: '4px 8px'
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
    borderTop: '1px solid #e0e0e0',
    background: 'white',
  },
  input: {
    flex: 1,
    padding: '0.6rem 0.8rem',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px'
  },
  sendButton: {
    padding: '0.6rem 1rem',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer'
  }
};


