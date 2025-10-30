import { useState, useEffect } from 'react';
import AlertModal from './AlertModal';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export default function ShareButton({ post }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useThemeLanguage();

  const handleShare = (platform) => {
    const url = window.location.origin + `/post/${post._id}`;
    const text = `Confira este post no CodeConnect: ${post.content.substring(0, 100)}...`;
    
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url)
          .then(() => setShowAlert(true))
          .catch(() => console.error('Erro ao copiar link.'));
        setShowMenu(false);
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowMenu(false);
  };

  // Fechar automaticamente o alerta após 2s
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div style={styles.shareDropdown}>
      <button 
        style={styles.shareButton}
        onClick={() => setShowMenu(!showMenu)}
      >
        📤 {t('share')}
      </button>
      
      {showMenu && (
        <div style={styles.shareMenu}>
          <button onClick={() => handleShare('twitter')} style={styles.shareOption}>🐦 {t('twitter')}</button>
          <button onClick={() => handleShare('facebook')} style={styles.shareOption}>📘 {t('facebook')}</button>
          <button onClick={() => handleShare('linkedin')} style={styles.shareOption}>💼 {t('linkedin')}</button>
          <button onClick={() => handleShare('whatsapp')} style={styles.shareOption}>📱 {t('whatsapp')}</button>
          <button onClick={() => handleShare('copy')} style={styles.shareOption}>📋 {t('copy_link')}</button>
        </div>
      )}

      <AlertModal 
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message={t('link_copied')}
        title={t('success')}
        showCancel={false}
      />
    </div>
  );
}

const styles = {
  shareDropdown: {
    position: 'relative',
    display: 'inline-block',
  },
  shareButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background 0.2s',
  },
  shareMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 1000,
    minWidth: '150px',
  },
  shareOption: {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
  },
};
