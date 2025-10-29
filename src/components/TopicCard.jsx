export default function TopicCard({ topic }) {
  return (
    <div style={styles.topicCard}>
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
  );
}

const styles = {
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
};
