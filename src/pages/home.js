import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import Notificacoes from '../components/Notificacoes';
import ChatModal from '../components/ChatModal';
import AlertModal from '../components/AlertModal';
import { postsAPI, usersAPI } from '../services/api';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ 
    isOpen: false, 
    message: '', 
    title: 'Aviso',
    onConfirm: null,
    showCancel: false
  });

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

    setUser(parsedUser);
    loadPosts();
  }, [router]);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postsAPI.getAll();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (data) => {
    if (!user?._id) return;
    try {
      await postsAPI.create({ ...data, author: user._id });
      loadPosts();
    } catch (err) {
      showAlert({ 
        message: 'Erro ao criar post: ' + (err.message || 'Erro desconhecido'), 
        title: 'Erro' 
      });
    }
  };

  const handleLike = async (postId, userId) => {
    if (!postId || !userId) return;
    try {
      await postsAPI.like(postId, userId);
      loadPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId, content) => {
    if (!postId || !content?.trim() || !user?._id) return;
    try {
      await postsAPI.addComment(postId, { author: user._id, content });
      loadPosts();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleEditPost = async (postId, updatedData) => {
    if (!postId || !user?._id) return;
    try {
      await postsAPI.update(postId, updatedData);
      loadPosts();
    } catch (err) {
      showAlert({ 
        message: 'Erro ao atualizar post: ' + (err.message || 'Erro desconhecido'), 
        title: 'Erro' 
      });
    }
  };

  const handleDeletePost = (postId) => {
    const confirmDelete = async () => {
      try {
        await postsAPI.delete(postId);
        loadPosts();
        showAlert({ 
          message: 'Post excluído com sucesso.', 
          title: 'Sucesso!' 
        });
      } catch (err) {
        showAlert({ 
          message: 'Erro ao excluir post: ' + (err.message || 'Erro desconhecido'), 
          title: 'Erro' 
        });
      }
    };

    showAlert({
      title: 'Excluir post?',
      message: 'Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.',
      showCancel: true,
      onConfirm: confirmDelete
    });
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

  const showAlert = ({ message, title = 'Aviso', onConfirm = null, showCancel = false }) => {
    setAlert({ isOpen: true, message, title, onConfirm, showCancel });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={user} onSearch={handleSearch} onNotificationsClick={() => setShowNotifications(!showNotifications)} />
        <div style={styles.mainArea}>
          <p style={styles.loading}>Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Navbar user={user} onSearch={handleSearch} onNotificationsClick={() => setShowNotifications(!showNotifications)} />
        <div style={styles.mainArea}>
          <p style={styles.error}>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar
        user={user}
        onSearch={handleSearch}
        onNotificationsClick={() => setShowNotifications(!showNotifications)}
      />

      {showNotifications && (
        <Notificacoes userId={user?._id} onClose={() => setShowNotifications(false)} />
      )}

      {showSearchResults && (
        <div style={styles.searchResults}>
          <div style={styles.searchHeader}>
            <h3>Resultados da busca</h3>
            <button onClick={handleCloseSearch} style={styles.closeButton}>
              ✖
            </button>
          </div>
          {searchResults.length === 0 ? (
            <p style={styles.noResults}>Nenhum usuário encontrado</p>
          ) : (
            searchResults.map((userResult) => (
              <div key={userResult._id} style={styles.userResult}>
                <img
                  src={userResult.profilePicture || '/default-avatar.svg'}
                  alt={userResult.name || 'Usuário'}
                  style={styles.resultAvatar}
                />
                <div style={styles.resultInfo}>
                  <h4>{userResult.name || 'Nome indisponível'}</h4>
                  <p>{userResult.email || 'Email indisponível'}</p>
                  <p>⭐ {userResult.xp || 0} XP</p>
                </div>
                <button
                  onClick={() => router.push(`/profile?id=${userResult._id}`)}
                  style={styles.viewProfileButton}
                >
                  Ver Perfil
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {showChatModal && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          currentUser={user}
          otherUser={selectedUser}
        />
      )}

      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSubmit={handleCreatePost}
      />

      <aside style={styles.sidebar}>
        <div style={styles.profileCard}>
          <img
            src={user?.profilePicture || '/default-avatar.svg'}
            alt={user?.name || 'Você'}
            style={styles.sidebarAvatar}
          />
          <div style={styles.sidebarInfo}>
            <div style={styles.sidebarName}>{user?.name || 'Usuário'}</div>
            <div style={styles.sidebarEmail}>{user?.email || ''}</div>
          </div>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          style={styles.createPostButton}
        >
          <span style={styles.createPostIcon}>+</span>
          <span>Publicar</span>
        </button>

        <div style={styles.statsCard}>
          <h3 style={styles.statsTitle}>Seu desempenho</h3>
          <div style={styles.statItem}>
            <span>⭐ XP</span>
            <strong>{user?.xp || 0}</strong>
          </div>
          <div style={styles.statItem}>
            <span>👥 Seguidores</span>
            <strong>{user?.followers?.length || 0}</strong>
          </div>
          <div style={styles.statItem}>
            <span>↗️ Seguindo</span>
            <strong>{user?.following?.length || 0}</strong>
          </div>
        </div>
      </aside>

      <main style={styles.mainArea}>
        {posts.length === 0 ? (
          <div style={styles.emptyFeedCard}>
            <p style={styles.emptyFeedText}>Nenhum post no feed ainda.</p>
            <p style={styles.emptyFeedHint}>Siga outros usuários para ver conteúdo aqui.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id || Math.random()} style={styles.postWrapper}>
              <PostCard
                post={post}
                currentUser={user}
                onLike={handleLike}
                onComment={handleComment}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            </div>
          ))
        )}
      </main>

      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        message={alert.message}
        title={alert.title}
        onConfirm={alert.onConfirm}
        showCancel={alert.showCancel}
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
    backgroundColor: '#f0f2f5',
  },
  sidebar: {
    position: 'fixed',
    top: '72px',
    left: '0',
    width: '280px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    backgroundColor: '#f0f2f5',
    height: 'calc(100vh - 72px)',
    overflowY: 'auto',
    zIndex: 10,
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  sidebarAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  sidebarInfo: {
    flex: 1,
  },
  sidebarName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#000',
    margin: 0,
  },
  sidebarEmail: {
    fontSize: '0.875rem',
    color: '#65676b',
    margin: 0,
  },
  createPostButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '12px',
    padding: '14px 16px',
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#65676b',
    cursor: 'pointer',
  },
  createPostIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#e7f3ff',
    color: '#1877f2',
    fontWeight: 'bold',
    fontSize: '1.25rem',
  },
  statsCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  statsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#000',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '0.95rem',
    color: '#65676b',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px',
    marginLeft: '280px',
    gap: '24px',
  },
  postWrapper: {
    width: '600px',
    maxWidth: '100%',
  },
  emptyFeedCard: {
    width: '600px',
    maxWidth: '100%',
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  emptyFeedText: {
    fontSize: '1.1rem',
    color: '#000',
    margin: 0,
    marginBottom: '0.5rem',
  },
  emptyFeedHint: {
    fontSize: '0.95rem',
    color: '#65676b',
    margin: 0,
  },
  searchResults: {
    position: 'fixed',
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    width: '90%',
    maxWidth: '500px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  searchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0',
    background: '#f8f9fa',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#666',
  },
  noResults: {
    padding: '2rem',
    textAlign: 'center',
    color: '#666',
  },
  userResult: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid #f0f0f0',
  },
  resultAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  resultInfo: {
    flex: 1,
  },
  viewProfileButton: {
    padding: '0.5rem 1rem',
    background: '#1877f2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
    color: '#d32f2f',
  },
};