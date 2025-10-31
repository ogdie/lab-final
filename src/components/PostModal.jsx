import { useState } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              {t('image_optional') || 'Imagem (opcional)'}
            </label>
            <ImageUpload
              value={image}
              onChange={setImage}
              placeholder={t('select_image') || "Selecione uma imagem do computador"}
              theme={theme}
            />
            {!image && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                Ou{' '}
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

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1rem'
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical',
    marginBottom: '1rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    marginBottom: '1rem'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    background: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

