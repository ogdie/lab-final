import { useState } from 'react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import MentionTextarea from './MentionTextarea';
import ImageUpload from './ImageUpload';

export default function PostModal({ isOpen, onClose, onSubmit, theme = 'light' }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const { t } = useThemeLanguage();

  // Limpar campos quando o modal fecha
  if (!isOpen) {
    if (content || image) {
      setContent('');
      setImage('');
    }
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({ content, image });
      setContent('');
      setImage('');
      onClose();
    }
  };

  const handleClose = () => {
    setContent('');
    setImage('');
    onClose();
  };

  const isDark = theme === 'dark';
  const styles = getStyles(theme);

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{t('create_post')}</h2>
        
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
            <button type="button" onClick={handleClose} style={styles.cancelButton}>
              {t('cancel')}
            </button>
            <button type="submit" style={styles.submitButton}>
              {t('publish')}
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
  const backgroundModal = isDark ? '#242526' : 'white';
  const borderInput = isDark ? '#3e4042' : '#ddd';
  const blueAction = '#8B5CF6';
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
      zIndex: 1000
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
    },
    textarea: {
      width: '100%',
      padding: '1rem',
      border: `1px solid ${borderInput}`,
      borderRadius: '6px',
      fontSize: '1rem',
      resize: 'vertical',
      marginBottom: '1rem',
      backgroundColor: backgroundModal,
      color: textPrimary,
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: `1px solid ${borderInput}`,
      borderRadius: '6px',
      fontSize: '1rem',
      marginBottom: '1rem',
      backgroundColor: backgroundModal,
      color: textPrimary,
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem',
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
    submitButton: {
      padding: '0.6rem 1.2rem',
      background: blueAction,
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background 0.2s',
    }
  };
};

