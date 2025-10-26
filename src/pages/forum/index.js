import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { forumAPI } from '../../services/api';

export default function Forum() {
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/';
      return;
    }
    
    setUser(JSON.parse(userData));
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const data = await forumAPI.getTopics();
      setTopics(data);
    } catch (err) {
      console.error('Error loading topics:', err);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar user={user} />
      
      <div style={styles.content}>
        <h1 style={styles.title}>Fórum</h1>
        <p style={styles.subtitle}>Escolha um tópico para participar</p>
        
        <div style={styles.topics}>
          {topics.map(topic => (
            <div key={topic._id} style={styles.topicCard}>
              <h3>{topic.name}</h3>
              <p>{topic.description}</p>
              <div style={styles.meta}>
                <span>📝 {topic.category}</span>
                <span>💬 {topic.posts?.length || 0} posts</span>
              </div>
              <a 
                href={`/forum/topic?id=${topic._id}`}
                style={styles.link}
              >
                Ver Discussão →
              </a>
            </div>
          ))}
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
    flexDirection: 'column'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    flex: 1
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '2rem'
  },
  topics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem'
  },
  topicCard: {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem'
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#666'
  },
  link: {
    display: 'inline-block',
    marginTop: '1rem',
    color: '#2196F3',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};

