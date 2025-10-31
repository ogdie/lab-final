import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PostCard from '../../components/PostCard';
import BackButton from '../../components/BackButton';
import { postsAPI, usersAPI, forumAPI, commentsAPI } from '../../services/api';

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const backgroundPrimary = isDark ? '#1d2226' : '#f3f2ef';
  const backgroundCard = isDark ? '#2c2f33' : '#ffffff';
  const borderSubtle = isDark ? '#3e4042' : '#d1d1d1';

  return {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: backgroundPrimary,
    },
    main: {
      maxWidth: '760px',
      width: '100%',
      margin: '0 auto',
      padding: '1rem',
      flex: 1,
    },
    loading: {
      color: textPrimary,
      textAlign: 'center',
      padding: '2rem',
    },
    error: {
      color: '#d32f2f',
      textAlign: 'center',
      padding: '2rem',
    },
    backContainer: {
      margin: '12px 0',
    },
  };
};

export default function PostPage() {
  const router = useRouter();
  const { theme, t } = useThemeLanguage();
  const styles = getStyles(theme);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obter postId da URL
    const getPostId = () => {
      if (typeof window === 'undefined') return null;
      const path = window.location.pathname;
      const match = path.match(/\/post\/([^/]+)/);
      return match ? match[1] : null;
    };

    const postId = getPostId();
    if (!postId) {
      setError('Post ID não encontrado');
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

        let parsedUser = null;
        try {
          parsedUser = userData ? JSON.parse(userData) : null;
        } catch (e) {
          console.error('Invalid user data:', e);
        }

        if (!token || !parsedUser?._id) {
          router.push('/');
          return;
        }

        setUser(parsedUser);

        // Buscar o post
        const postData = await postsAPI.getById(postId);
        setPost(postData);

        // Se o post pertence a um tópico, buscar o tópico também
        if (postData.topic) {
          try {
            const topicData = await forumAPI.getTopic(postData.topic);
            setTopic(topicData);
          } catch (err) {
            console.error('Error loading topic:', err);
          }
        }
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Post não encontrado');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [router]);

  const handleLike = async (postId, userId) => {
    if (!postId || !userId) return;
    try {
      const updatedPost = await postsAPI.like(postId, userId);
      const normalizedLikes = (updatedPost.likes || []).map(id => String(id));
      setPost(prev => prev ? { ...prev, likes: normalizedLikes } : prev);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId, content, parentComment = null) => {
    if (!postId || !content?.trim() || !user?._id) return;
    try {
      await postsAPI.addComment(postId, { author: user._id, content, parentComment });
      // Recarregar o post
      const postData = await postsAPI.getById(postId);
      setPost(postData);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!commentId || !user?._id) return;
    try {
      const updatedComment = await commentsAPI.like(commentId, user._id);
      const normalizedLikes = (updatedComment.likes || []).map(id => String(id));
      setPost(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: (prev.comments || []).map(comment =>
            comment._id === commentId
              ? { ...comment, likes: normalizedLikes }
              : comment
          )
        };
      });
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const handleEditComment = async (commentId, updated) => {
    try {
      await commentsAPI.update(commentId, updated);
      const postId = post._id;
      const postData = await postsAPI.getById(postId);
      setPost(postData);
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsAPI.delete(commentId);
      const postId = post._id;
      const postData = await postsAPI.getById(postId);
      setPost(postData);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleEditPost = async (postId, updatedData) => {
    if (!postId || !user?._id) return;
    try {
      await postsAPI.update(postId, updatedData);
      const postData = await postsAPI.getById(postId);
      setPost(postData);
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = async () => {
      try {
        await postsAPI.delete(postId);
        // Redirecionar baseado no contexto
        if (topic) {
          router.push(`/forum/topic?id=${topic._id}`);
        } else {
          router.push('/home');
        }
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    };

    if (window.confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) {
      confirmDelete();
    }
  };

  const getBackUrl = () => {
    if (topic) {
      return `/forum/topic?id=${topic._id}`;
    }
    return '/home';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.main}>
          <p style={styles.loading}>{t('loading')}</p>
        </div>
        <Footer theme={theme} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.main}>
          <div style={styles.backContainer}>
            <BackButton to={getBackUrl()} />
          </div>
          <p style={styles.error}>{error || 'Post não encontrado'}</p>
        </div>
        <Footer theme={theme} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar user={user} />
      <main style={styles.main}>
        <div style={styles.backContainer}>
          <BackButton to={getBackUrl()} />
        </div>
        {topic && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: styles.backgroundCard, borderRadius: '8px', border: `1px solid ${styles.borderSubtle}` }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: styles.textPrimary }}>
              📁 {t('topic')}: <strong>{topic.name}</strong>
            </p>
          </div>
        )}
        <PostCard
          post={post}
          currentUser={user}
          onLike={handleLike}
          onComment={handleComment}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onLikeComment={handleLikeComment}
          onReplyComment={(commentId, content) => handleComment(post._id, content, commentId)}
          theme={theme}
          topicId={post.topic ? String(post.topic._id || post.topic) : null}
        />
      </main>
      <Footer theme={theme} />
    </div>
  );
}

