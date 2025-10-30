import { useThemeLanguage } from '../context/ThemeLanguageContext';

export default function AlertModal({ 
  isOpen, 
  onClose, 
  message, 
  title,
  onConfirm,
  showCancel = false,
  confirmText,
  cancelText
}) {
  if (!isOpen) return null;
  const { t } = useThemeLanguage();
  const finalTitle = title || t('warning');
  const finalConfirm = confirmText || t('confirm');
  const finalCancel = cancelText || t('cancel');

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{finalTitle}</h2>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttonContainer}>
          {showCancel && (
            <button onClick={onClose} style={{ ...styles.button, ...styles.cancelButton }}>
              {finalCancel}
            </button>
          )}
          <button 
            onClick={handleConfirm} 
            style={showCancel ? { ...styles.button, ...styles.confirmButton } : styles.button}
          >
            {showCancel ? finalConfirm : t('close')}
          </button>
        </div>
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
    zIndex: 2000
  },
  modal: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#333'
  },
  message: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '1.5rem',
    lineHeight: '1.5'
  },
  buttonContainer: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center'
  },
  button: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    flex: 1
  },
  cancelButton: {
    background: '#e0e0e0',
    color: '#333'
  },
  confirmButton: {
    background: '#2196F3',
    color: 'white'
  }
};