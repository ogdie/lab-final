import { useThemeLanguage } from '../../context/ThemeLanguageContext';

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#606770';
  const backgroundCard = isDark ? '#2c2f33' : '#ffffff';
  const borderSubtle = isDark ? '#3e4042' : '#d1d1d1';
  const blueAction = '#8B5CF6';

  return {
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
      background: backgroundCard,
      border: `1px solid ${borderSubtle}`,
      borderRadius: '8px',
      padding: '2rem',
      maxWidth: '400px',
      width: '90%',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    title: {
      fontSize: '1.5rem',
      marginBottom: '1rem',
      color: textPrimary
    },
    message: {
      fontSize: '1rem',
      color: textSecondary,
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
      borderRadius: '24px',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      flex: 1,
      background: blueAction,
      color: 'white',
      transition: 'background 0.2s'
    },
    cancelButton: {
      background: isDark ? '#474a4d' : '#e7e7e7',
      color: textPrimary
    },
    confirmButton: {
      background: blueAction,
      color: 'white'
    },
    deleteButton: {
      background: '#f44336',
      color: 'white'
    }
  };
};

export default function AlertModal({ 
  isOpen, 
  onClose, 
  message, 
  title,
  onConfirm,
  showCancel = false,
  confirmText,
  cancelText,
  isDelete = false,
  theme
}) {
  if (!isOpen) return null;
  const { t, theme: contextTheme } = useThemeLanguage();
  const appliedTheme = theme || contextTheme || 'light';
  const styles = getStyles(appliedTheme);
  
  const finalTitle = title || t('warning');
  const finalConfirm = confirmText || (isDelete ? (t('delete') || 'Deletar') : t('confirm'));
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
            style={showCancel 
              ? (isDelete 
                  ? { ...styles.button, ...styles.deleteButton } 
                  : { ...styles.button, ...styles.confirmButton })
              : styles.button}
          >
            {showCancel ? finalConfirm : t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}