'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConnectionNotification from './ConnectionNotification';

export default function Navbar({ user, onSearch = () => {}, onNotificationsClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [showConnectionNotifications, setShowConnectionNotifications] = useState(false);

  // Debounce para busca
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim()) {
        onSearch(searchTerm.trim());
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  // Contagem de notificações
  useEffect(() => {
    if (user?._id) {
      const fetchCount = async () => {
        try {
          const res = await fetch(`/api/users/${user._id}/notifications`);
          const data = await res.json();
          const unread = data.filter(n => !n.read).length;
          setNotificationsCount(unread);
        } catch (err) {
          console.error('Error fetching notifications:', err);
        }
      };
      fetchCount();
      const interval = setInterval(fetchCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link href="/home" style={styles.logo}>CodeConnect</Link>
        
        <div style={{ ...styles.searchContainer, position: 'relative' }}>
          <input
            type="text"
            placeholder="Buscar posts e usuários..."
            aria-label="Buscar posts e usuários"
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              if (value.trim() === '') {
                onSearch(''); // limpa resultados quando não há texto
              }
            }}
          />
          {searchTerm && (
            <button
              style={styles.clearButton}
              onClick={() => {
                setSearchTerm('');
                onSearch(''); // limpa resultados ao clicar no X
              }}
              aria-label="Limpar busca"
            >
              ✖️
            </button>
          )}
        </div>

        <div style={styles.rightSection}>
          <button 
            style={styles.iconButton}
            onClick={onNotificationsClick}
            title="Notificações"
          >
            🔔 {notificationsCount > 0 && <span style={styles.badge}>{notificationsCount}</span>}
          </button>
          
          <Link href="/chat" style={styles.iconButton} title="Chat">
            💬
          </Link>

          <Link href="/forum" style={styles.iconButton} title="Fórum">
            📢
          </Link>

          <Link href="/settings" style={styles.iconButton} title="Configurações">
            ⚙️
          </Link>

          {user && (
            <Link href={`/profile?id=${user._id}`} style={styles.userInfo} title="Meu perfil">
              <img 
                src={user.profilePicture || '/default-avatar.svg'} 
                alt={user.name}
                style={styles.avatar}
              />
              <span>{user.name}</span>
            </Link>
          )}
          
          {user && (
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
              style={styles.logoutButton}
              title="Sair"
            >
              Sair
            </button>
          )}
        </div>
      </div>
      
      {showConnectionNotifications && (
        <ConnectionNotification 
          userId={user?._id} 
          onClose={() => setShowConnectionNotifications(false)} 
        />
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    textDecoration: 'none'
  },
  searchContainer: {
    flex: 1,
    maxWidth: '500px',
    margin: '0 2rem'
  },
  searchInput: {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '1rem',
    paddingRight: '2rem'
  },
  clearButton: {
    position: 'absolute',
    right: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    position: 'relative',
    padding: '0.5rem'
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    background: '#f44336',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: '#333'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
