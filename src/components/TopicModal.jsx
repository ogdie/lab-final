import { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export default function TopicModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { t } = useThemeLanguage();

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
          <button style={{ ...styles.button, ...styles.cancel }} onClick={onClose}>
            {t('cancel')}
          </button>
          <button style={{ ...styles.button, ...styles.confirm }} onClick={handleSubmit}>
            {t('create')}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
  },
  input: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  cancel: {
    background: '#e0e0e0',
    color: '#333',
  },
  confirm: {
    background: '#4F46E5',
    color: 'white',
  },
};
