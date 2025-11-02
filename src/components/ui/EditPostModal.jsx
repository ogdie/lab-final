import { useState, useEffect } from 'react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import MentionTextarea from './MentionTextarea';
import ImageUpload from './ImageUpload';
// Modal component for editing a post
export default function EditPostModal({ isOpen, onClose, post, onSave, onDelete, theme: propTheme }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const { t, theme: contextTheme } = useThemeLanguage();
  const theme = propTheme || contextTheme || 'light';

  useEffect(() => {
    if (isOpen) {
      setContent(post.content || '');
      setImage(post.image || '');
    }
  }, [isOpen, post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSave({ content: content.trim(), image });
    }
  };

  const handleDelete = () => {
  if (onDelete && typeof onDelete === 'function') {
    onDelete(post._id);
  }
};

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const styles = getStyles(theme);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{t('edit_post')}</h2>
        <form onSubmit={handleSubmit}>
          <MentionTextarea
            placeholder={t('what_are_you_thinking')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
            rows={5}
            theme={theme}
            required
          />
          <div style={{ marginBottom: '1rem' }}>
            <ImageUpload
              value={image}
              onChange={setImage}
              placeholder={t('select_image') || "Selecione uma imagem do computador"}
              theme={theme}
            />
            {!image && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: isDark ? '#b0b3b8' : '#666' }}>
                {t('or')}{' '}
                <input
                  type="text"
                  placeholder={t('image_url_optional') || 'Cole uma URL de imagem'}
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  style={{
                    ...styles.input,
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    padding: '0.5rem'
                  }}
                />
              </div>
            )}
          </div>
          <div style={styles.actions}>
            <button type="submit" style={styles.submitButton}>
              {t('save')}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              {t('cancel')}
            </button>
            <button type="button" onClick={handleDelete} style={styles.deleteButton}>
              {t('delete_post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#606770';
  const backgroundCard = isDark ? '#2c2f33' : '#ffffff';
  const borderSubtle = isDark ? '#3e4042' : '#e0e0e0';
  const blueAction = '#8B5CF6';
  const purpleBorder = '#8B5CF6';

  return {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      background: backgroundCard,
      borderRadius: '8px',
      padding: '1.5rem',
      maxWidth: '480px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${purpleBorder}`,
    },
    title: {
      fontSize: '1.5rem',
      marginBottom: '1rem',
      color: textPrimary,
      marginTop: 0,
    },
    textarea: {
      width: '100%',
      padding: '1rem',
      border: `1px solid ${borderSubtle}`,
      borderRadius: '8px',
      fontSize: '1rem',
      resize: 'vertical',
      marginBottom: '1rem',
      background: isDark ? '#3a3b3c' : '#f0f2f5',
      color: textPrimary,
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: `1px solid ${borderSubtle}`,
      borderRadius: '8px',
      fontSize: '1rem',
      marginBottom: '1rem',
      background: isDark ? '#3a3b3c' : '#f0f2f5',
      color: textPrimary,
    },
    actions: {
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'flex-start',
      marginTop: '1rem',
      flexWrap: 'wrap',
    },
    cancelButton: {
      padding: '0.6rem 1rem',
      background: isDark ? '#474a4d' : '#e7e7e7',
      color: textPrimary,
      border: 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
    },
    submitButton: {
      padding: '0.6rem 1rem',
      background: blueAction,
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
    },
    deleteButton: {
      padding: '0.6rem 1rem',
      background: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      width: 'auto',
    },
  };
};