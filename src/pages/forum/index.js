import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { forumAPI } from '../../services/api';

export default function Forum() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
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
    loadTopics();
  }, [router]);

  const loadTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await forumAPI.getTopics();
      setTopics(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading topics:', err);
      setError('Não foi possível carregar os tópicos do fórum.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
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
        <Navbar user={user} />
        <div style={styles.content}>
          <p style={styles.error}>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar user={user} />

      <div style={styles.content}>
        <h1 style={styles.title}>Fórum</h1>
        <p style={styles.subtitle}>Escolha um tópico para participar</p>

        <div style={styles.topics}>
          {topics.length === 0 ? (
            <p style={styles.empty}>Nenhum tópico disponível no momento.</p>
          ) : (
            topics.map((topic) => (
              <div key={topic._id || Math.random()} style={styles.topicCard}>
                <h3>{topic.name || 'Tópico sem nome'}</h3>
                <p>{topic.description || 'Sem descrição'}</p>
                <div style={styles.meta}>
                  <span>📝 {topic.category || 'Sem categoria'}</span>
                  <span>💬 {topic.posts?.length || 0} posts</span>
                </div>
                <a
                  href={`/forum/topic?id=${encodeURIComponent(topic._id)}`}
                  style={styles.link}
                >
                  Ver Discussão →
                </a>
              </div>
            ))
          )}
        </div>
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    flex: 1,
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '2rem',
  },
  topics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  },
  topicCard: {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#666',
  },
  link: {
    display: 'inline-block',
    marginTop: '1rem',
    color: '#2196F3',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  loading: {
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
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
    fontStyle: 'italic',
  },
};