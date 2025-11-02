import { useState, useEffect } from 'react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

export default function TopicModal({ isOpen, onClose, onSubmit, theme = 'light' }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { t } = useThemeLanguage();
  const styles = getStyles(theme);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name, description });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{t('create_new_topic')}</h2>
        <input
          type="text"
          placeholder={t('topic_name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder={t('description_optional')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />
        <div style={styles.buttons}>
          <button style={styles.cancelButton} onClick={onClose}>
            {t('cancel')}
          </button>
          <button style={styles.confirmButton} onClick={handleSubmit}>
            {t('create')}
          </button>
        </div>
      </div>
    </div>
  );
}

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#606770';
  const backgroundModal = isDark ? '#242526' : 'white';
  const borderInput = isDark ? '#3e4042' : '#ddd';
  const blueAction = '#8B5CF6';
  const purpleBorder = '#8B5CF6';
  const grayCancel = isDark ? '#474a4d' : '#e7e7e7';

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
      zIndex: 2000,
    },
    modal: {
      background: backgroundModal,
      borderRadius: '10px',
      padding: '2rem',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      border: `1px solid ${purpleBorder}`,
    },
    title: {
      margin: 0,
      fontSize: '1.5rem',
      fontWeight: '600',
      color: textPrimary,
      borderBottom: `1px solid ${borderInput}`,
      paddingBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '6px',
      border: `1px solid ${borderInput}`,
      fontSize: '1rem',
      backgroundColor: backgroundModal,
      color: textPrimary,
      boxSizing: 'border-box',
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.5rem',
      marginTop: '1rem',
    },
    cancelButton: {
      padding: '0.6rem 1.2rem',
      background: grayCancel,
      color: isDark ? textPrimary : '#333',
      border: isDark ? `1px solid ${borderInput}` : 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background 0.2s',
    },
    confirmButton: {
      padding: '0.6rem 1.2rem',
      background: blueAction,
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background 0.2s',
    },
  };
};
