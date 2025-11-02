import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';

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
        background: isFollowing ? '#4CAF50' : '#8B5CF6',
        color: 'white'
      }}
    >
      {isFollowing ? (
        <>
          <FaUserMinus style={{ marginRight: '6px' }} />
          {t('unfollow')}
        </>
      ) : (
        <>
          <FaUserPlus style={{ marginRight: '6px' }} />
          {t('follow')}
        </>
      )}
    </button>
  );
}

const styles = {
  button: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '24px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'background 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

