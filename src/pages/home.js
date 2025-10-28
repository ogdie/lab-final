import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import Notificacoes from '../components/Notificacoes';
import ChatModal from '../components/ChatModal';
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
      alert('Erro ao criar post: ' + (err.message || 'Erro desconhecido'));
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
        <Navbar user={user} onSearch={handleSearch} onNotificationsClick={() => setShowNotifications(!showNotifications)} />
        <div style={styles.content}>
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
        <div style={styles.content}>
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

      <div style={styles.content}>
        <aside style={styles.sidebar}>
          <button
            onClick={() => setShowPostModal(true)}
            style={styles.createButton}
          >
            + Criar Post
          </button>

          <div style={styles.stats}>
            <h3>Estatísticas</h3>
            <p>XP: {user?.xp || 0}</p>
            <p>Seguidores: {user?.followers?.length || 0}</p>
            <p>Seguindo: {user?.following?.length || 0}</p>
          </div>
        </aside>

        <main style={styles.posts}>
          <h2 style={styles.feedTitle}>Feed</h2>
          {posts.length === 0 ? (
            <p style={styles.emptyFeed}>Nenhum post disponível.</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id || Math.random()}
                post={post}
                currentUser={user}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))
          )}
        </main>
      </div>

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
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    gap: '2rem',
    flex: 1,
  },
  sidebar: {
    width: '250px',
  },
  createButton: {
    width: '100%',
    padding: '1rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '2rem',
    fontWeight: 'bold',
  },
  stats: {
    background: 'white',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  posts: {
    flex: 1,
  },
  feedTitle: {
    marginBottom: '1rem',
  },
  searchResults: {
    position: 'fixed',
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
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
  emptyFeed: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: '2rem',
  },
};