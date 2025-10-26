import { useState } from 'react';

export default function ShareButton({ post }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleShare = (platform) => {
    const url = window.location.origin + `/post/${post._id}`;
    const text = `Confira este post no CodeConnect: ${post.content.substring(0, 100)}...`;
    
    let shareUrl = '';
    
    switch(platform) {
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
        navigator.clipboard.writeText(url);
        alert('Link copiado para a área de transferência!');
        setShowMenu(false);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowMenu(false);
  };

  return (
    <div style={styles.shareDropdown}>
      <button 
        style={styles.shareButton}
        onClick={() => setShowMenu(!showMenu)}
      >
        📤 Compartilhar
      </button>
      
      {showMenu && (
        <div style={styles.shareMenu}>
          <button onClick={() => handleShare('twitter')} style={styles.shareOption}>
            🐦 Twitter
          </button>
          <button onClick={() => handleShare('facebook')} style={styles.shareOption}>
            📘 Facebook
          </button>
          <button onClick={() => handleShare('linkedin')} style={styles.shareOption}>
            💼 LinkedIn
          </button>
          <button onClick={() => handleShare('whatsapp')} style={styles.shareOption}>
            📱 WhatsApp
          </button>
          <button onClick={() => handleShare('copy')} style={styles.shareOption}>
            📋 Copiar Link
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  shareDropdown: {
    position: 'relative',
    display: 'inline-block'
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
    transition: 'background 0.2s'
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
    minWidth: '150px'
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
    transition: 'background 0.2s'
  }
};

