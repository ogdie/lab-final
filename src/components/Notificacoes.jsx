import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { notificationsAPI, usersAPI } from '../services/api';
import { FaTimes, FaHeart, FaComment, FaBell, FaCheckCircle, FaBullhorn } from 'react-icons/fa';

export default function Notificacoes({ userId, onClose, onNotificationsUpdated }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const { t, theme } = useThemeLanguage();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      
      const interval = setInterval(() => {
        fetchNotifications();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && notifications.length > 0) {
      markAllAsRead();
    }
  }, [notifications.length]);

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      if (unreadNotifications.length === 0) return;

      await Promise.all(
        unreadNotifications.map(n => notificationsAPI.markAsRead(n._id))
      );
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      
      if (onNotificationsUpdated) {
        onNotificationsUpdated();
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll(userId);
      const notifications = Array.isArray(data) ? data.map(n => {
        if (n.relatedTopic && !n.relatedPost?.topic) {
          return {
            ...n,
            relatedPost: n.relatedPost ? { ...n.relatedPost, topic: n.relatedTopic } : n.relatedPost
          };
        }
        return n;
      }) : [];
      setNotifications(notifications);
    } catch (err) {
      console.error('Error fetching notifications (notificationsAPI):', err?.message || err);
      try {
        const byUser = await usersAPI.getNotifications(userId);
        const notifications = Array.isArray(byUser) ? byUser.map(n => {
          if (n.relatedTopic && !n.relatedPost?.topic) {
            return {
              ...n,
              relatedPost: n.relatedPost ? { ...n.relatedPost, topic: n.relatedTopic } : n.relatedPost
            };
          }
          return n;
        }) : [];
        setNotifications(notifications);
      } catch (err2) {
        console.error('Error fetching notifications (usersAPI):', err2?.message || err2);
      }
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.read) {
        await notificationsAPI.markAsRead(notif._id);
        setNotifications((prev) => prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n)));
      }

      if (notif.relatedPost) {
        const postId = notif.relatedPost._id || notif.relatedPost;
        router.push(`/post/${postId}`);
        if (onClose) onClose();
      } else if (notif.type === 'connection_request' || notif.type === 'connection_accepted' || notif.type === 'new_follower') {
        if (notif.from?._id) {
          router.push(`/profile?id=${notif.from._id}`);
          if (onClose) onClose();
        }
      }
    } catch (err) {
      console.error('Error handling notification click:', err);
    }
  };

  const styles = getStyles(theme);

  return (
    <>
      {/* Overlay para fechar ao clicar fora */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        onClick={onClose}
      />
      <div 
        style={styles.container}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <h3>{t('notifications')}</h3>
          <button onClick={onClose} style={styles.closeButton}>
            <FaTimes />
          </button>
        </div>
        
        <div style={styles.list}>
        {notifications.map((notif) => (
          <div 
            key={notif._id}
            style={{ ...styles.item, opacity: notif.read ? 0.6 : 1 }}
            onClick={() => handleNotificationClick(notif)}
          >
            {notif.type === 'new_follower' ? (
              <img
                src={notif.from?.profilePicture || '/default-avatar.svg'}
                alt={notif.from?.name || 'Usuário'}
                style={styles.profilePicture}
              />
            ) : (
              <div style={styles.icon}>
                {notif.type === 'like' && <FaHeart />}
                {notif.type === 'comment' && <FaComment />}
                {notif.type === 'connection_request' && <FaBell />}
                {notif.type === 'connection_accepted' && <FaCheckCircle />}
                {notif.type === 'mention' && <FaBullhorn />}
              </div>
            )}
            <div style={styles.content}>
              <p style={styles.text}>
                <strong>{notif.from?.name}</strong> {
                  notif.type === 'like' && (() => {

                    const isForum = notif.relatedTopic || (notif.relatedPost?.topic);
                    if (isForum) {
                      return notif.relatedComment 
                        ? ` ${t('likes_comment_forum') || 'curtiu seu comentário no fórum'}`
                        : ` ${t('likes_post_forum') || 'curtiu sua publicação no fórum'}`;
                    } else {
                      return notif.relatedComment 
                        ? ` ${t('likes_comment') || 'curtiu seu comentário'}`
                        : ` ${t('likes_post') || 'curtiu sua publicação'}`;
                    }
                  })()
                }
                {notif.type === 'comment' && (() => {

                  const isForum = notif.relatedTopic || (notif.relatedPost?.topic);
                  if (isForum) {
                    return notif.relatedComment 
                      ? ` ${t('replied_to_comment_forum') || 'respondeu seu comentário no fórum'}`
                      : ` ${t('comments_post_forum') || 'comentou em sua publicação no fórum'}`;
                  } else {
                    return notif.relatedComment 
                      ? ` ${t('replied_to_comment') || 'respondeu seu comentário'}`
                      : ` ${t('comments_post') || 'comentou em sua publicação'}`;
                  }
                })()}
                {notif.type === 'connection_request' && ` ${t('connection_request')}`}
                {notif.type === 'connection_accepted' && ` ${t('connection_accepted')}`}
                {notif.type === 'new_follower' && ` ${t('started_following_you') || 'está seguindo você'}`}
                {notif.type === 'mention' && (
                  notif.mentionType === 'comment' 
                    ? ` ${t('mentioned_you_comment') || 'te marcou em um comentário'}`
                    : ` ${t('mentioned_you_post') || 'te marcou em uma publicação'}`
                )}
              </p>
              <small style={styles.date}>
                {new Date(notif.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
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
      zIndex: 1001,
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
    profilePicture: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
      flexShrink: 0
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