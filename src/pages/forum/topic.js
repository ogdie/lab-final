import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/ui/Navbar";
import Footer from "../../components/ui/Footer";
import PostCard from "../../components/PostCard";
import AlertModal from "../../components/ui/AlertModal";
import MentionTextarea from "../../components/ui/MentionTextarea";
import ImageUpload from "../../components/ui/ImageUpload";
import { forumAPI, postsAPI, usersAPI, commentsAPI } from "../../services/api";
import { useThemeLanguage } from "../../context/ThemeLanguageContext";
import BackButton from "../../components/ui/BackButton";
import { FaTimes } from 'react-icons/fa';

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#606770';
  const backgroundPrimary = isDark ? '#1d2226' : '#f0f2f5';
  const backgroundCard = isDark ? '#242526' : 'white';
  const borderSubtle = isDark ? '#42423eff' : '#e0e0e0';
  const blueAction = '#8B5CF6';
  return {
    container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: backgroundPrimary },
    main: { maxWidth: '760px', width: '100%', margin: '0 auto', padding: '1rem', flex: 1 },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 0' },
    title: { fontSize: '1.75rem', fontWeight: 700, color: textPrimary },
    createBtn: { padding: '0.6rem 1rem', background: blueAction, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 },
    card: { background: backgroundCard, border: `1px solid ${borderSubtle}`, borderRadius: 8, padding: '1rem', marginBottom: '1rem' },
    loading: { color: textPrimary, textAlign: 'center', padding: '2rem' },
    error: { color: '#d32f2f', textAlign: 'center', padding: '1rem' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
    modal: { background: backgroundCard, border: `1px solid ${borderSubtle}`, borderRadius: 8, padding: '1.25rem', width: '90%', maxWidth: 520 },
    label: { display: 'block', marginBottom: 6, color: textSecondary },
    input: { width: '100%', padding: '0.75rem', border: `1px solid ${borderSubtle}`, borderRadius: 6, marginBottom: '0.75rem', background: backgroundCard, color: textPrimary },
    textarea: { width: '100%', padding: '0.75rem', border: `1px solid ${borderSubtle}`, borderRadius: 6, minHeight: 120, background: backgroundCard, color: textPrimary },
    actions: { display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' },
    cancel: { padding: '0.6rem 1rem', background: isDark ? '#474a4d' : '#e7e7e7', color: textPrimary, border: 'none', borderRadius: 6, cursor: 'pointer' },
    save: { padding: '0.6rem 1rem', background: blueAction, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 },
  };
};

export default function TopicPage() {
  const router = useRouter();
  const { theme, t } = useThemeLanguage();
  const styles = getStyles(theme);
  const [user, setUser] = useState(null);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: '', title: 'Aviso', onConfirm: null, showCancel: false });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchPaused, setSearchPaused] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  const topicId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const qp = new URLSearchParams(window.location.search);
    return qp.get('id') || '';
  }, []);
  const topicName = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const qp = new URLSearchParams(window.location.search);
    return qp.get('name') || '';
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let parsedUser = null;
    try { parsedUser = userData ? JSON.parse(userData) : null; } catch {}
    if (!token || !parsedUser?._id) {
      return;
    }
    setUser(parsedUser);
  }, []);

  const refreshUser = async () => {
    try {
      if (!user?._id) return;
      const fresh = await usersAPI.getById(user._id);
      if (fresh && fresh._id) {
        setUser(fresh);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(fresh));
        }
      }
    } catch {}
  };

  const loadTopic = async () => {
    setLoading(true);
    setError(null);
    try {
      if (topicId) {
        const t = await forumAPI.getTopic(topicId);
        setTopic(t);
      } else {
        throw new Error('no-id');
      }
    } catch (err) {
      // Se vier apenas o nome (tópicos padrão), criaremos o tópico sob demanda
      if (topicName) {
        try {
          const name = topicName;
          const lower = name.toLowerCase();
          const category = lower.includes('python') ? 'Python'
            : lower === 'c' ? 'C'
            : 'Outros';
          const created = await forumAPI.createTopic({ name, description: '', category });
          if (created && created._id) {
            const t = await forumAPI.getTopic(created._id);
            setTopic(t);
          } else {
            setError('Não foi possível carregar o tópico.');
          }
        } catch (e) {
          setError('Não foi possível carregar o tópico.');
        }
      } else {
        setError('Não foi possível carregar o tópico.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  const handleCreateThread = async () => {
    if (!user?._id || !title.trim()) return;
    const content = description ? `${title.trim()}\n\n${description.trim()}` : title.trim();
    try {
      await forumAPI.addReply(topicId, { author: user._id, content, image: image || undefined });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setImage('');
      await loadTopic();
      await refreshUser();
    } catch (err) {
      setError('Não foi possível criar o tópico.');
    }
  };

  const handleLike = async (postId) => {
    if (!user?._id) return;
    try {
      const updatedPost = await postsAPI.like(postId, user._id);
      // Atualizar apenas o post específico no estado, sem recarregar todo o tópico
      // Normalizar likes para strings para garantir compatibilidade
      const normalizedLikes = (updatedPost.likes || []).map(id => String(id));
      setTopic((prev) => {
        if (!prev) return prev;
        const updatedPosts = (prev.posts || []).map((p) =>
          p._id === postId ? { ...p, likes: normalizedLikes } : p
        );
        return { ...prev, posts: updatedPosts };
      });
    } catch {}
  };

  const handleComment = async (postId, content, parentComment = null) => {
    if (!user?._id || !content?.trim()) return;
    try {
      const newComment = await postsAPI.addComment(postId, { author: user._id, content: content.trim(), parentComment });
      
      // Atualização otimista - atualizar apenas o post específico no estado, sem recarregar todo o tópico
      // Isso mantém o scroll no lugar, como nas curtidas
      setTopic((prev) => {
        if (!prev) return prev;
        const updatedPosts = (prev.posts || []).map((post) => {
          if (post._id === postId) {
            // Garantir que o novo comentário tem a estrutura correta
            const commentWithDefaults = {
              ...newComment,
              likes: newComment.likes || [],
              createdAt: newComment.createdAt || new Date().toISOString(),
              parentComment: parentComment || null
            };
            const updatedComments = [...(post.comments || []), commentWithDefaults];
            return { ...post, comments: updatedComments };
          }
          return post;
        });
        return { ...prev, posts: updatedPosts };
      });
      
      await refreshUser();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!commentId || !user?._id) return;
    try {
      const updatedComment = await commentsAPI.like(commentId, user._id);
      // Atualizar apenas o comentário específico no estado, sem recarregar todo o tópico
      const normalizedLikes = (updatedComment.likes || []).map(id => String(id));
      setTopic((prev) => {
        if (!prev) return prev;
        const updatedPosts = (prev.posts || []).map((post) => ({
          ...post,
          comments: (post.comments || []).map((comment) =>
            comment._id === commentId
              ? { ...comment, likes: normalizedLikes }
              : comment
          )
        }));
        return { ...prev, posts: updatedPosts };
      });
    } catch {}
  };

  const handleEditComment = async (commentId, updated) => {
    try {
      await commentsAPI.update(commentId, updated);
      await loadTopic();
    } catch {}
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsAPI.delete(commentId);
      await loadTopic();
    } catch {}
  };

  const handleEditPost = async (postId, updatedData) => {
    try {
      await postsAPI.update(postId, updatedData);
      await loadTopic();
    } catch {}
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = async () => {
      try {
        await postsAPI.delete(postId);
        await loadTopic();
        await refreshUser();
      } catch {}
    };
    setAlert({
      isOpen: true,
      message: 'Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.',
      title: 'Excluir post?',
      onConfirm: confirmDelete,
      showCancel: true,
    });
  };

  const handleSearch = async (query) => {
    if (!query?.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchPaused(false);
      setLastSearchQuery('');
      return;
    }

    // Se a pesquisa está pausada e a query não mudou, não fazer nada
    if (searchPaused && query === lastSearchQuery) {
      return;
    }

    // Se a query mudou, reativar a pesquisa
    if (query !== lastSearchQuery) {
      setSearchPaused(false);
    }

    try {
      const users = await usersAPI.searchUsers(query);
      setSearchResults(Array.isArray(users) ? users : []);
      setShowSearchResults(true);
      setLastSearchQuery(query);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    }
  };

  const handleCloseSearch = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchPaused(true); // Pausar a pesquisa para evitar reabertura automática
  };

  return (
    <div style={styles.container}>
      <Navbar user={user} onSearch={handleSearch} />
      <main style={styles.main}>
        <div style={{ margin: '12px 0' }}>
          <BackButton to="/forum" />
        </div>
        {showSearchResults && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <div 
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                zIndex: 999 // Lower than search modal
              }}
              onClick={handleCloseSearch}
            />
            <div 
              style={{ 
                position: 'fixed', 
                top: 80, 
                left: '50%', 
                transform: 'translateX(-50%)', 
                zIndex: 1001, // Higher than overlay
                width: '90%', 
                maxWidth: 500, 
                maxHeight: 400, 
                overflowY: 'auto', 
                background: theme === 'dark' ? '#2c2f33' : '#fff', 
                border: `1px solid ${theme === 'dark' ? '#3e4042' : '#e0e0e0'}`, 
                borderRadius: 8, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem', 
                borderBottom: `1px solid ${theme === 'dark' ? '#3e4042' : '#e0e0e0'}`, 
                background: theme === 'dark' ? '#3a3b3c' : '#f8f9fa' 
              }}>
                <h3 style={{ margin: 0, color: theme === 'dark' ? '#e4e6eb' : '#1d2129' }}>
                  {t('search_results') || 'Resultados da pesquisa'}
                </h3>
                <button 
                  onClick={handleCloseSearch} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '1.2rem', 
                    cursor: 'pointer', 
                    color: theme === 'dark' ? '#b0b3b8' : '#606770' 
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              {searchResults.length === 0 ? (
                <p style={{ padding: '1rem', color: theme === 'dark' ? '#b0b3b8' : '#606770' }}>
                  {t('no_users_found') || 'Nenhum usuário encontrado.'}
                </p>
              ) : (
                searchResults.map((u) => (
                  <div 
                    key={u._id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem', 
                      padding: '1rem', 
                      borderBottom: `1px solid ${theme === 'dark' ? '#3e4042' : '#e0e0e0'}` 
                    }}
                  >
                    <img 
                      src={u.profilePicture || '/default-avatar.svg'} 
                      alt={u.name} 
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, color: theme === 'dark' ? '#e4e6eb' : '#1d2129' }}>
                        {u.name}
                      </h4>
                      <p style={{ margin: '2px 0 0 0', color: theme === 'dark' ? '#b0b3b8' : '#606770', fontSize: '0.85rem' }}>
                        {u.email}
                      </p>
                    </div>
                    <button 
                      onClick={() => router.push(`/profile?id=${u._id}`)} 
                      style={{ 
                        padding: '0.5rem 1rem', 
                        background: '#4F46E5', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 24, 
                        cursor: 'pointer', 
                        fontSize: '0.9rem', 
                        fontWeight: 600 
                      }}
                    >
                      {t('view_profile') || 'Ver perfil'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        {loading && <div style={styles.loading}>{t('loading')}</div>}
        {!loading && error && <div style={styles.error}>{error}</div>}
        {!loading && topic && (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>{topic.name}</h1>
              <button style={styles.createBtn} onClick={() => setShowModal(true)}>{t('create_new_thread')}</button>
            </div>
            {topic.description && <div style={styles.card}>{topic.description}</div>}

            {Array.isArray(topic.posts) && topic.posts.length > 0 ? (
              topic.posts
                .map((post) => ({
                  ...post,
                  createdAt: post?.createdAt || post?.created_at || post?.date || Date.now(),
                }))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((post) => (
                <PostCard
                  key={post._id}
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
                  topicId={topicId}
                />
              ))
            ) : (
              <div style={styles.card}>{t('no_discussions')}</div>
            )}
          </>
        )}
      </main>
      <Footer />

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        title={alert.title}
        onConfirm={alert.onConfirm}
        showCancel={alert.showCancel}
      />

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>{t('create_new_thread')}</h2>
            <label style={styles.label}>{t('thread_title')}</label>
            <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('thread_title_placeholder')} />
            <label style={styles.label}>{t('thread_description')}</label>
            <MentionTextarea 
              style={styles.textarea} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder={t('thread_desc_placeholder')}
              theme={theme}
            />
            <label style={styles.label}>{t('image_optional') || 'Imagem (opcional)'}</label>
            <ImageUpload
              value={image}
              onChange={setImage}
              placeholder={t('select_image') || "Selecione uma imagem do computador"}
              theme={theme}
            />
            <div style={styles.actions}>
              <button style={styles.cancel} onClick={() => setShowModal(false)}>{t('cancel')}</button>
              <button style={styles.save} onClick={handleCreateThread}>{t('create')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


