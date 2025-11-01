import { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { FaMedal, FaGraduationCap, FaRocket, FaTrophy, FaFileAlt, FaCheckCircle } from 'react-icons/fa';

// Ícones usando react-icons
const getIconByType = (type) => {
  switch (type) {
    case 'certification': return <FaMedal />;
    case 'course': return <FaGraduationCap />;
    case 'project': return <FaRocket />;
    case 'competition': return <FaTrophy />;
    case 'publication': return <FaFileAlt />;
    default: return <FaCheckCircle />;
  }
};

export default function AchievementCard({ achievement, theme = 'light' }) {
  const [imageError, setImageError] = useState(false);
  const { t, language } = useThemeLanguage();
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#606770';
  const background = isDark ? '#3e4042' : '#f6f8fa';
  const border = isDark ? '#4e5052' : '#dddfe2';

  // Labels traduzidos
  const getTypeLabel = (type) => {
    const key = `achievement_type_${type}`;
    return t(key) || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const locale = language === 'en' ? 'en-US' : 'pt-BR';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long'
    });
  };

  const showImage = achievement.image && !imageError;

  return (
    <div style={{
      background,
      border: `1px solid ${border}`,
      borderRadius: '8px',
      padding: '1.25rem',
      marginBottom: '1rem',
      display: 'flex',
      gap: '1rem'
    }}>
      {showImage ? (
        <img 
          src={achievement.image} 
          alt={achievement.title}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '8px',
            objectFit: 'cover',
            flexShrink: 0
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div style={{
          fontSize: '2rem',
          flexShrink: 0
        }}>
          {getIconByType(achievement.type)}
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.25rem'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: textPrimary,
            margin: 0
          }}>
            {achievement.title}
          </h3>
          <span style={{
            fontSize: '0.85rem',
            color: textSecondary,
            whiteSpace: 'nowrap'
          }}>
            {formatDate(achievement.date)}
          </span>
        </div>

        <p style={{
          fontSize: '0.9rem',
          color: textSecondary,
          margin: '0.25rem 0'
        }}>
          {getTypeLabel(achievement.type)}
        </p>

        {achievement.description && (
          <p style={{
            fontSize: '0.95rem',
            color: textPrimary,
            marginTop: '0.5rem',
            lineHeight: 1.4
          }}>
            {achievement.description}
          </p>
        )}

        {achievement.technologies && achievement.technologies.length > 0 && (
          <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {achievement.technologies.map((tech, i) => (
              <span
                key={i}
                style={{
                  background: isDark ? '#4e5052' : '#e7e7e7',
                  color: textPrimary,
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}