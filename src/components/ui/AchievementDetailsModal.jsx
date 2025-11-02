import { useThemeLanguage } from '../../context/ThemeLanguageContext';
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

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#606770';
  const backgroundModal = isDark ? '#242526' : 'white';
  const borderInput = isDark ? '#3e4042' : '#ddd';
  const blueAction = '#8B5CF6';

  return {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      background: backgroundModal,
      borderRadius: '10px',
      padding: '2rem',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      border: isDark ? '1px solid #3e4042' : 'none',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: textPrimary,
      borderBottom: `1px solid ${borderInput}`,
      paddingBottom: '0.5rem',
      textAlign: 'center',
    },
    imageContainer: {
      width: '100%',
      marginBottom: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
    },
    image: {
      maxWidth: '100%',
      maxHeight: '300px',
      borderRadius: '8px',
      objectFit: 'contain',
      border: `1px solid ${borderInput}`,
    },
    iconContainer: {
      width: '100%',
      marginBottom: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      fontSize: '5rem',
      color: blueAction,
    },
    field: {
      marginBottom: '1.25rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.4rem',
      fontWeight: '600',
      color: textSecondary,
      fontSize: '0.9rem',
    },
    value: {
      color: textPrimary,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    technologiesContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    technologyTag: {
      background: isDark ? '#3e4042' : '#e7e7e7',
      color: textPrimary,
      padding: '0.4rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    closeButton: {
      padding: '0.6rem 1.2rem',
      background: blueAction,
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background 0.2s',
      width: '100%',
      marginTop: '1rem',
    },
    emptyText: {
      color: textSecondary,
      fontStyle: 'italic',
    },
  };
};

export default function AchievementDetailsModal({ isOpen, onClose, achievement, theme = 'light' }) {
  if (!isOpen || !achievement) return null;

  const styles = getStyles(theme);
  const { t, language } = useThemeLanguage();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const locale = language === 'en' ? 'en-US' : 'pt-BR';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeLabel = (type) => {
    const key = `achievement_type_${type}`;
    return t(key) || type;
  };

  const showImage = achievement.image;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{achievement.title}</h2>

        {/* Imagem ou Ícone */}
        {showImage ? (
          <div style={styles.imageContainer}>
            <img 
              src={achievement.image} 
              alt={achievement.title}
              style={styles.image}
            />
          </div>
        ) : (
          <div style={styles.iconContainer}>
            {getIconByType(achievement.type)}
          </div>
        )}

        {/* Tipo */}
        <div style={styles.field}>
          <span style={styles.label}>{t('achievement_type_label') || 'Tipo'}</span>
          <div style={styles.value}>{getTypeLabel(achievement.type)}</div>
        </div>

        {/* Data */}
        {achievement.date && (
          <div style={styles.field}>
            <span style={styles.label}>{t('achievement_date_label') || 'Data'}</span>
            <div style={styles.value}>{formatDate(achievement.date)}</div>
          </div>
        )}

        {/* Descrição */}
        {achievement.description && (
          <div style={styles.field}>
            <span style={styles.label}>{t('achievement_description_label') || 'Descrição'}</span>
            <div style={styles.value}>{achievement.description}</div>
          </div>
        )}

        {/* Tecnologias */}
        {achievement.technologies && Array.isArray(achievement.technologies) && achievement.technologies.length > 0 && (
          <div style={styles.field}>
            <span style={styles.label}>{t('technologies_tools_label') || 'Tecnologias ou Ferramentas'}</span>
            <div style={styles.technologiesContainer}>
              {achievement.technologies.map((tech, index) => (
                <span key={index} style={styles.technologyTag}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botão de fechar */}
        <button 
          onClick={onClose} 
          style={styles.closeButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#9d68f7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#8B5CF6';
          }}
        >
          {t('close') || 'Fechar'}
        </button>
      </div>
    </div>
  );
}

