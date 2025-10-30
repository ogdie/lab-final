import { useThemeLanguage } from '../context/ThemeLanguageContext';

export default function FollowButton({ userId, currentUser, onFollow }) {
  const isFollowing = currentUser?.following?.includes(userId);
  const { t } = useThemeLanguage();

  const handleFollow = () => {
    if (onFollow) {
      onFollow(userId);
    }
  };

  return (
    <button 
      onClick={handleFollow}
      style={{
        ...styles.button,
        background: isFollowing ? '#4CAF50' : '#2196F3',
        color: 'white'
      }}
    >
      {isFollowing ? t('unfollow') : t('follow')}
    </button>
  );
}

const styles = {
  button: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    transition: 'background 0.2s'
  }
};

