import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { usersAPI } from '../../services/api';
import { FaTimes } from 'react-icons/fa';

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const purpleBorder = '#8B5CF6';
  return {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.2s ease-out',
    },
    modal: {
      background: isDark ? '#242526' : '#ffffff',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '80vh',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
      borderTop: `3px solid ${purpleBorder}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'slideUp 0.3s ease-out',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      borderBottom: `1px solid ${isDark ? '#3e4042' : '#e7e7e7'}`,
      position: 'relative',
    },
    headerTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: isDark ? '#e4e6eb' : '#1d2129',
      margin: 0,
    },
    closeButton: {
      position: 'absolute',
      right: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: isDark ? '#b0b3b8' : '#606770',
      padding: '0.25rem 0.5rem',
      lineHeight: 1,
    },
    content: {
      overflowY: 'auto',
      flex: 1,
    },
    userItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      borderBottom: `1px solid ${isDark ? '#3e4042' : '#e7e7e7'}`,
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    userItemHover: {
      background: isDark ? '#3a3b3c' : '#f0f0f0',
    },
    avatar: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      objectFit: 'cover',
      flexShrink: 0,
    },
    userInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    userName: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: isDark ? '#e4e6eb' : '#1d2129',
      margin: 0,
    },
    userEmail: {
      fontSize: '0.85rem',
      color: isDark ? '#b0b3b8' : '#606770',
      margin: 0,
    },
    emptyState: {
      padding: '2rem',
      textAlign: 'center',
      color: isDark ? '#b0b3b8' : '#606770',
    },
    loading: {
      padding: '2rem',
      textAlign: 'center',
      color: isDark ? '#b0b3b8' : '#606770',
    },
  };
};

export default function UsersListModal({ 
  isOpen, 
  onClose, 
  title, 
  userIds = [], 
  fetchUsers, 
  theme = 'light' 
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const router = useRouter();
  const { t } = useThemeLanguage();
  const styles = getStyles(theme);
  
  // Usar ref para manter referência estável da função fetchUsers
  const fetchUsersRef = useRef(fetchUsers);
  const userIdsRef = useRef(userIds);
  
  // Atualizar refs quando props mudarem
  useEffect(() => {
    fetchUsersRef.current = fetchUsers;
    userIdsRef.current = userIds;
  }, [fetchUsers, userIds]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      let userList = [];
      const currentFetchUsers = fetchUsersRef.current;
      const currentUserIds = userIdsRef.current;
      
      if (currentFetchUsers) {
        userList = await currentFetchUsers();
      } else if (currentUserIds.length > 0) {
        // Se não tiver função fetchUsers, buscar usuários pelos IDs
        const userPromises = currentUserIds.map(id => usersAPI.getById(id).catch(() => null));
        const results = await Promise.all(userPromises);
        userList = results.filter(u => u !== null);
      }
      setUsers(Array.isArray(userList) ? userList : []);
    } catch (err) {
      console.error('Error loading users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências - usa refs

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    } else {
      setUsers([]);
      setLoading(false);
    }
  }, [isOpen, loadUsers]); // Apenas isOpen como trigger principal

  const handleUserClick = (userId) => {
    if (userId) {
      router.push(`/profile?id=${userId}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={styles.overlay}
      onClick={onClose}
    >
      <div 
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
          <div style={styles.header}>
            <h3 style={styles.headerTitle}>{title}</h3>
            <button 
              onClick={onClose}
              style={styles.closeButton}
              aria-label="Fechar"
            >
              <FaTimes />
            </button>
          </div>
          
          <div style={styles.content}>
            {loading ? (
              <div style={styles.loading}>{t('loading') || 'Carregando...'}</div>
            ) : users.length === 0 ? (
              <div style={styles.emptyState}>
                {t('no_users') || 'Nenhum usuário encontrado'}
              </div>
            ) : (
              users.map((user, index) => (
                <div
                  key={user._id || index}
                  style={{
                    ...styles.userItem,
                    ...(hoveredIndex === index ? styles.userItemHover : {})
                  }}
                  onClick={() => handleUserClick(user._id)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <img
                    src={user.profilePicture || '/default-avatar.svg'}
                    alt={user.name || 'Usuário'}
                    style={styles.avatar}
                  />
                  <div style={styles.userInfo}>
                    <p style={styles.userName}>{user.name || 'Nome indisponível'}</p>
                    <p style={styles.userEmail}>{user.email || 'Email indisponível'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
  );
}

