import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PostCard from "../../components/PostCard";
import { forumAPI, postsAPI, usersAPI } from "../../services/api";

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#606770';
  const backgroundPrimary = isDark ? '#18191a' : '#f0f2f5';
  const backgroundCard = isDark ? '#242526' : 'white';
  const borderSubtle = isDark ? '#3e4042' : '#e0e0e0';
  const blueAction = '#0a66c2';
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
  const [theme, setTheme] = useState('light');
  const styles = getStyles(theme);
  const [user, setUser] = useState(null);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
      await forumAPI.addReply(topicId, { author: user._id, content });
      setShowModal(false);
      setTitle('');
      setDescription('');
      await loadTopic();
      await refreshUser();
    } catch (err) {
      setError('Não foi possível criar o tópico.');
    }
  };

  const handleLike = async (postId) => {
    if (!user?._id) return;
    try {
      await postsAPI.like(postId, user._id);
      await loadTopic();
    } catch {}
  };

  const handleComment = async (postId, content) => {
    if (!user?._id || !content?.trim()) return;
    try {
      await postsAPI.addComment(postId, { author: user._id, content });
      await loadTopic();
      await refreshUser();
    } catch {}
  };

  const handleEditPost = async (postId, updatedData) => {
    try {
      await postsAPI.update(postId, updatedData);
      await loadTopic();
    } catch {}
  };

  const handleDeletePost = async (postId) => {
    try {
      await postsAPI.delete(postId);
      await loadTopic();
      await refreshUser();
    } catch {}
  };

  return (
    <div style={styles.container}>
      <Navbar user={user} />
      <main style={styles.main}>
        {loading && <div style={styles.loading}>Carregando...</div>}
        {!loading && error && <div style={styles.error}>{error}</div>}
        {!loading && topic && (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>{topic.name}</h1>
              <button style={styles.createBtn} onClick={() => setShowModal(true)}>Criar novo tópico</button>
            </div>
            {topic.description && <div style={styles.card}>{topic.description}</div>}

            {Array.isArray(topic.posts) && topic.posts.length > 0 ? (
              topic.posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={user}
                  onLike={handleLike}
                  onComment={handleComment}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                  theme={theme}
                />
              ))
            ) : (
              <div style={styles.card}>Nenhuma discussão ainda. Seja o primeiro a criar!</div>
            )}
          </>
        )}
      </main>
      <Footer />

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Criar Novo Tópico</h2>
            <label style={styles.label}>Título</label>
            <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Digite o título" />
            <label style={styles.label}>Descrição</label>
            <textarea style={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Escreva a descrição (opcional)" />
            <div style={styles.actions}>
              <button style={styles.cancel} onClick={() => setShowModal(false)}>Cancelar</button>
              <button style={styles.save} onClick={handleCreateThread}>Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


