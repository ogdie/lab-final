import { useEffect, useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { notificationsAPI, usersAPI } from '../services/api';

export default function Notificacoes({ userId, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const { t, theme } = useThemeLanguage();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll(userId);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching notifications (notificationsAPI):', err?.message || err);
      // Fallback para rota alternativa, caso o backend exponha por usuário
      try {
        const byUser = await usersAPI.getNotifications(userId);
        setNotifications(Array.isArray(byUser) ? byUser : []);
      } catch (err2) {
        console.error('Error fetching notifications (usersAPI):', err2?.message || err2);
      }
    }
  };

  const markAsRead = async (id) => {
    try {
      if (!id) return;
      await notificationsAPI.markAsRead(id);
      // Atualiza localmente para resposta rápida
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      // Revalida do servidor
      fetchNotifications();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const styles = getStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>{t('notifications')}</h3>
        <button onClick={onClose} style={styles.closeButton}>✖</button>
      </div>
      
      <div style={styles.list}>
        {notifications.map((notif) => (
          <div 
            key={notif._id}
            style={{ ...styles.item, opacity: notif.read ? 0.6 : 1 }}
            onClick={() => markAsRead(notif._id)}
          >
            <div style={styles.icon}>
              {notif.type === 'like' && '❤️'}
              {notif.type === 'comment' && '💬'}
              {notif.type === 'connection_request' && '🔔'}
              {notif.type === 'connection_accepted' && '✅'}
            </div>
            <div style={styles.content}>
              <p style={styles.text}>
                <strong>{notif.from?.name}</strong> {
                  notif.type === 'like' && t('likes_post')
                }
                {notif.type === 'comment' && ` ${t('comments_post')}`}
                {notif.type === 'connection_request' && ` ${t('connection_request')}`}
                {notif.type === 'connection_accepted' && ` ${t('connection_accepted')}`}
              </p>
              <small style={styles.date}>
                {new Date(notif.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const backgroundCard = isDark ? '#2c2f33' : 'white';
  const borderSubtle = isDark ? '#3e4042' : '#e0e0e0';
  const headerBg = isDark ? '#3a3b3c' : '#f8f9fa';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#666';

  return {
    container: {
      position: 'fixed',
      top: '60px',
      right: '1rem',
      width: '400px',
      maxHeight: '500px',
      background: backgroundCard,
      border: `1px solid ${borderSubtle}`,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 1000,
      overflow: 'hidden',
      color: textPrimary,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: `1px solid ${borderSubtle}`,
      background: headerBg,
      color: textPrimary,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: textSecondary,
    },
    list: {
      maxHeight: '400px',
      overflowY: 'auto'
    },
    item: {
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      borderBottom: `1px solid ${borderSubtle}`,
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    icon: {
      fontSize: '1.5rem'
    },
    content: {
      flex: 1
    },
    text: {
      margin: 0,
      fontSize: '0.9rem',
      color: textPrimary,
    },
    date: {
      color: textSecondary,
      fontSize: '0.8rem'
    }
  };
};

