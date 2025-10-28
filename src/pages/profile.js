import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import FollowButton from '../components/FollowButton';
import ConnectButton from '../components/ConnectButton';
import AlertModal from '../components/AlertModal';
import { usersAPI } from '../services/api';

export default function Profile() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: '', title: 'Aviso' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    const userId = router.query?.id || parsedUser._id;
    if (userId) {
      loadUser(userId);
      loadUserPosts(userId);
    } else {
      setError('ID de usuário inválido.');
      setLoading(false);
    }
  }, [router, router.query]);

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

  const loadUserPosts = async (userId) => {
    try {
      const data = await usersAPI.getUserPosts(userId);
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading posts:', err);
      // Não interrompe a renderização do perfil
    }
  };

  const handleEditProfile = async (formData) => {
    if (!user?._id) return;
    try {
      await usersAPI.editProfile(user._id, formData);
      await loadUser(user._id);
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
      // Placeholder: substitua pelo serviço real quando implementado
      console.log('Seguir usuário:', userId);
      // Ex: await usersAPI.follow(currentUser._id, userId);
      // loadUser(userId); // para atualizar contagem de seguidores
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

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={currentUser} />
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
        <Navbar user={currentUser} />
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
        <Navbar user={currentUser} />
        <div style={styles.content}>
          <p style={styles.error}>Usuário não encontrado.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar user={currentUser} />

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
              <ConnectButton
                userId={user._id}
                currentUser={currentUser}
                onConnect={handleConnect}
              />
            </div>
          )}
        </div>
      </div>

      <div style={styles.content}>
        <main style={styles.posts}>
          <h2>Posts ({posts.length})</h2>
          {posts.length === 0 ? (
            <p style={styles.emptyPosts}>Nenhum post publicado.</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id || Math.random()}
                post={post}
                currentUser={currentUser}
              />
            ))
          )}
        </main>
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
  bio: {
    fontSize: '1rem',
    margin: '1rem 0',
  },
  stats: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1rem',
  },
  posts: {
    flex: 1,
  },
  emptyPosts: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: '1rem 0',
  },
};