import { useThemeLanguage } from '../context/ThemeLanguageContext';

export default function TopicCard({ topic }) {
  const { t, theme } = useThemeLanguage();
  const isDark = theme === 'dark';
  const styles = getStyles(theme);
  return (
    <div style={styles.topicCard}>
      <h3>{topic.name || t('topic_no_name')}</h3>
      <p style={styles.desc}>{topic.description || t('no_description')}</p>

      <div style={styles.meta}>
        <span>💬 {topic.posts?.length || 0} {t('posts_label')}</span>
      </div>

      <a
        href={`/forum/topic?id=${encodeURIComponent(topic._id || '')}&name=${encodeURIComponent(topic.name || '')}`}
        style={styles.link}
      >
        {t('view_discussion')}
      </a>
    </div>
  );
}

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const backgroundCard = isDark ? '#2c2f33' : 'white';
  const borderSubtle = isDark ? '#3e4042' : '#e0e0e0';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#666';
  const blueAction = '#4F46E5';

  return {
    topicCard: {
      background: backgroundCard,
      border: `1px solid ${borderSubtle}`,
      borderRadius: '8px',
      padding: '1.5rem',
      color: textPrimary,
    },
    desc: {
      color: textSecondary,
      margin: 0,
      marginTop: '0.5rem',
    },
    meta: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
      fontSize: '0.9rem',
      color: textSecondary,
    },
    link: {
      display: 'inline-block',
      marginTop: '1rem',
      color: blueAction,
      textDecoration: 'none',
      fontWeight: 'bold',
    },
  };
};
