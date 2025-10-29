import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditProfileModal from '../components/EditProfileModal';
import FollowButton from '../components/FollowButton';
import AlertModal from '../components/AlertModal';
import Notificacoes from '../components/Notificacoes';
import { usersAPI } from '../services/api';

export default function Profile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: '', title: 'Aviso' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

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

    setCurrentUser(parsedUser);

    const userId = searchParams?.get('id') || parsedUser._id;
    if (userId) {
      loadUser(userId);
    } else {
      setError('ID de usuário inválido.');
      setLoading(false);
    }
  }, [searchParams]);

  const loadUser = async (userId) => {
    try {
      const data = await usersAPI.getById(userId);
      if (!data?._id) throw new Error('Usuário não encontrado.');
      setUser(data);
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Não foi possível carregar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (formData) => {
    if (!user?._id) return;
    try {
      await usersAPI.editProfile(user._id, formData);
      const updatedUser = await usersAPI.getById(user._id);
      await loadUser(user._id);
      
      // Se estiver editando o próprio perfil, atualizar o currentUser e localStorage
      if (currentUser && currentUser._id === user._id && updatedUser) {
        const updatedCurrentUser = { ...currentUser, ...updatedUser };
        setCurrentUser(updatedCurrentUser);
        localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
      }
      
      setAlert({
        isOpen: true,
        message: 'Perfil atualizado com sucesso!',
        title: 'Sucesso!',
      });
    } catch (err) {
      setAlert({
        isOpen: true,
        message: err.message || 'Erro ao atualizar perfil.',
        title: 'Erro ao atualizar perfil',
      });
    }
  };

  const handleFollow = async (userId) => {
    if (!userId || !currentUser?._id) return;
    try {
      const resp = await usersAPI.toggleFollow(userId, currentUser._id);
      // Atualiza o perfil que está sendo visualizado
      await loadUser(userId);
      // Atualiza o currentUser (seguindo) e persiste
      const freshCurrent = await usersAPI.getById(currentUser._id);
      setCurrentUser(freshCurrent);
      localStorage.setItem('user', JSON.stringify(freshCurrent));
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleConnect = async (userId) => {
    if (!userId || !currentUser?._id) return;
    try {
      // Placeholder: substitua pelo serviço real quando implementado
      console.log('Conectar com usuário:', userId);
      // Ex: await usersAPI.connect(currentUser._id, userId);
    } catch (err) {
      console.error('Error connecting user:', err);
    }
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, message: '', title: 'Aviso' });
  };

  const handleSearch = async (query) => {
    if (!query?.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const users = await usersAPI.searchUsers(query);
      setSearchResults(Array.isArray(users) ? users : []);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    }
  };

  const handleCloseSearch = () => {
    setShowSearchResults(false);
    setSearchResults([]);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar 
          user={currentUser} 
          onSearch={handleSearch}
          onNotificationsClick={() => setShowNotifications(!showNotifications)}
        />
        <div style={styles.content}>
          <p style={styles.loadingText}>Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Navbar 
          user={currentUser} 
          onSearch={handleSearch}
          onNotificationsClick={() => setShowNotifications(!showNotifications)}
        />
        <div style={styles.content}>
          <p style={styles.error}>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <Navbar 
          user={currentUser} 
          onSearch={handleSearch}
          onNotificationsClick={() => setShowNotifications(!showNotifications)}
        />
        <div style={styles.content}>
          <p style={styles.error}>Usuário não encontrado.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar 
        user={currentUser} 
        onSearch={handleSearch}
        onNotificationsClick={() => setShowNotifications(!showNotifications)}
      />

      {showNotifications && (
        <Notificacoes userId={currentUser?._id} onClose={() => setShowNotifications(false)} />
      )}

      {showSearchResults && (
        <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', zIndex: 1000, width: '90%', maxWidth: '500px', maxHeight: '400px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e0e0e0', background: '#f8f9fa' }}>
            <h3>Resultados da busca</h3>
            <button onClick={handleCloseSearch} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}>
              ✖
            </button>
          </div>
          {searchResults.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Nenhum usuário encontrado</p>
          ) : (
            searchResults.map((userResult) => (
              <div key={userResult._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                <img
                  src={userResult.profilePicture || '/default-avatar.svg'}
                  alt={userResult.name || 'Usuário'}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h4>{userResult.name || 'Nome indisponível'}</h4>
                  <p>{userResult.email || 'Email indisponível'}</p>
                  <p>⭐ {userResult.xp || 0} XP</p>
                </div>
                <button
                  onClick={() => router.push(`/profile?id=${userResult._id}`)}
                  style={{ padding: '0.5rem 1rem', background: '#1877f2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}
                >
                  Ver Perfil
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div style={styles.profileHeader}>
        <img
          src={user.profilePicture || '/default-avatar.svg'}
          alt={user.name || 'Usuário'}
          style={styles.profileImage}
        />
        <div style={styles.info}>
          <div style={styles.nameHeader}>
            <h1 style={styles.name}>{user.name || 'Nome indisponível'}</h1>
            {currentUser && currentUser._id === user._id && (
              <button onClick={() => setShowEditModal(true)} style={styles.editButton}>
                ✏️ Editar Perfil
              </button>
            )}
          </div>
          <p style={styles.email}>{user.email || 'Email indisponível'}</p>
          
          {user.userType && (
            <p style={styles.infoText}>
              <strong>Tipo:</strong> {user.userType}
            </p>
          )}
          
          {user.institution && (
            <p style={styles.infoText}>
              <strong>Instituição:</strong> {user.institution}
            </p>
          )}
          
          {user.birthDate && (
            <p style={styles.infoText}>
              <strong>Data de Nascimento:</strong> {new Date(user.birthDate).toLocaleDateString('pt-PT')}
            </p>
          )}
          
          <p style={styles.bio}>{user.bio || 'Sem bio'}</p>
          <div style={styles.stats}>
            <div>
              <strong>{user.xp || 0}</strong>
              <span>XP</span>
            </div>
            <div>
              <strong>{user.followers?.length || 0}</strong>
              <span>Seguidores</span>
            </div>
            <div>
              <strong>{user.following?.length || 0}</strong>
              <span>Seguindo</span>
            </div>
          </div>

          {currentUser && currentUser._id !== user._id && (
            <div style={styles.actions}>
              <FollowButton
                userId={user._id}
                currentUser={currentUser}
                onFollow={handleFollow}
              />
            </div>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={handleEditProfile}
      />

      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        message={alert.message}
        title={alert.title}
      />

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
  loadingText: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#d32f2f',
  },
  profileHeader: {
    display: 'flex',
    gap: '2rem',
    padding: '2rem',
    background: 'white',
    borderBottom: '1px solid #e0e0e0',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #2196F3',
  },
  info: {
    flex: 1,
  },
  nameHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  editButton: {
    padding: '0.5rem 1rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  name: {
    fontSize: '2rem',
    margin: 0,
    marginBottom: '0.5rem',
  },
  email: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
    marginBottom: '0.5rem',
  },
  infoText: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
    marginBottom: '0.5rem',
  },
  bio: {
    fontSize: '1rem',
    margin: '1rem 0',
  },
  stats: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1rem',
  },
};