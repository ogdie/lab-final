import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/';
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setCurrentUser(parsedUser);
    
    const userId = router.query.id || parsedUser._id;
    loadUser(userId);
    loadUserPosts(userId);
  }, [router.query]);

  const loadUser = async (userId) => {
    try {
      const data = await usersAPI.getById(userId);
      setUser(data);
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const loadUserPosts = async (userId) => {
    try {
      const data = await usersAPI.getUserPosts(userId);
      setPosts(data);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  const handleEditProfile = async (formData) => {
    try {
      await usersAPI.editProfile(user._id, formData);
      loadUser(user._id);
      setAlert({ 
        isOpen: true, 
        message: 'Perfil atualizado com sucesso!', 
        title: 'Sucesso!' 
      });
    } catch (err) {
      setAlert({ 
        isOpen: true, 
        message: err.message || 'Erro ao atualizar perfil', 
        title: 'Erro ao atualizar perfil' 
      });
    }
  };

  const handleFollow = async (userId) => {
    try {
      // Implementar lógica de seguir
      console.log('Seguir usuário:', userId);
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleConnect = async (userId) => {
    try {
      // Implementar lógica de conectar
      console.log('Conectar com usuário:', userId);
    } catch (err) {
      console.error('Error connecting user:', err);
    }
  };

  if (!user) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div style={styles.container}>
      <Navbar user={currentUser} />
      
      <div style={styles.profileHeader}>
        <img 
          src={user.profilePicture || '/default-avatar.svg'} 
          alt={user.name}
          style={styles.profileImage}
        />
        <div style={styles.info}>
          <div style={styles.nameHeader}>
            <h1 style={styles.name}>{user.name}</h1>
            {currentUser && currentUser._id === user._id && (
              <button 
                onClick={() => setShowEditModal(true)}
                style={styles.editButton}
              >
                ✏️ Editar Perfil
              </button>
            )}
          </div>
          <p style={styles.email}>{user.email}</p>
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
          {posts.map(post => (
            <PostCard key={post._id} post={post} currentUser={currentUser} />
          ))}
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
        onClose={() => setAlert({ isOpen: false, message: '', title: 'Aviso' })}
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
    flexDirection: 'column'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem'
  },
  profileHeader: {
    display: 'flex',
    gap: '2rem',
    padding: '2rem',
    background: 'white',
    borderBottom: '1px solid #e0e0e0'
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #2196F3'
  },
  info: {
    flex: 1
  },
  nameHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem'
  },
  editButton: {
    padding: '0.5rem 1rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  name: {
    fontSize: '2rem',
    margin: 0,
    marginBottom: '0.5rem'
  },
  email: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
    marginBottom: '0.5rem'
  },
  bio: {
    fontSize: '1rem',
    margin: '1rem 0'
  },
  stats: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1rem'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  },
  posts: {
    flex: 1
  }
};

