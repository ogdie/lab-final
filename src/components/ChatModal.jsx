import { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export default function ChatModal({ isOpen, onClose, currentUser, otherUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { t } = useThemeLanguage();

  useEffect(() => {
    if (isOpen && otherUser?._id) {
      fetchMessages();
    }
  }, [isOpen, otherUser]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${otherUser._id}/messages?currentUserId=${currentUser._id}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        const res = await fetch(`/api/chat/${otherUser._id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sender: currentUser._id, content: newMessage })
        });
        const message = await res.json();
        setMessages([...messages, message]);
        setNewMessage('');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3>{otherUser?.name}</h3>
          <button onClick={onClose} style={styles.closeButton}>✖</button>
        </div>
        
        <div style={styles.messages}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                ...styles.message,
                alignSelf: msg.sender._id === currentUser._id ? 'flex-end' : 'flex-start',
                background: msg.sender._id === currentUser._id ? '#2196F3' : '#f0f0f0',
                color: msg.sender._id === currentUser._id ? 'white' : 'black'
              }}
            >
              {msg.content}
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
          <button type="submit" style={styles.sendButton}>
            {t('send')}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    height: '80vh',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  messages: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  message: {
    padding: '0.75rem',
    borderRadius: '8px',
    maxWidth: '80%'
  },
  form: {
    display: 'flex',
    padding: '1rem',
    borderTop: '1px solid #e0e0e0'
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px'
  },
  sendButton: {
    padding: '0.75rem 1.5rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer'
  }
};

