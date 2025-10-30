import { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
// Modal component for editing a post
export default function EditPostModal({ isOpen, onClose, post, onSave, onDelete }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const { t } = useThemeLanguage();

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

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{t('edit_post')}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder={t('what_are_you_thinking')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
            rows={5}
            required
          />
          <input
            type="text"
            placeholder={t('image_url_optional')}
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={styles.input}
          />
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              {t('cancel')}
            </button>
            <button type="submit" style={styles.submitButton}>
              {t('save')}
            </button>
          </div>
        </form>
        <button onClick={handleDelete} style={styles.deleteButton}>
          {t('delete_post')}
        </button>
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
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical',
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    marginBottom: '1rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    background: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    marginTop: '1.5rem',
    padding: '0.75rem',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
  },
};