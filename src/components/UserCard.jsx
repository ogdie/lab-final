import FollowButton from './FollowButton';
import ConnectButton from './ConnectButton';

export default function UserCard({ user, currentUser, onFollow, onConnect }) {
  const isFollowing = currentUser?.following?.includes(user._id);
  const isConnected = currentUser?.connections?.includes(user._id);

  return (
    <div style={styles.card}>
      <img 
        src={user.profilePicture || '/default-avatar.svg'} 
        alt={user.name}
        style={styles.avatar}
      />
      <div style={styles.info}>
        <h3 style={styles.name}>{user.name}</h3>
        <p style={styles.email}>{user.email}</p>
        <p style={styles.bio}>{user.bio}</p>
        <div style={styles.xp}>
          ⭐ {user.xp || 0} XP | {user.userType}
        </div>
        
        {currentUser && user._id !== currentUser._id && (
          <div style={styles.actions}>
            <ConnectButton 
              userId={user._id}
              currentUser={currentUser}
              onConnect={onConnect}
            />
            <FollowButton 
              userId={user._id}
              currentUser={currentUser}
              onFollow={onFollow}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    gap: '1rem',
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem'
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: '1.1rem',
    margin: 0,
    marginBottom: '0.25rem'
  },
  email: {
    fontSize: '0.9rem',
    color: '#666',
    margin: 0,
    marginBottom: '0.5rem'
  },
  bio: {
    fontSize: '0.9rem',
    color: '#333',
    margin: 0,
    marginBottom: '0.5rem'
  },
  xp: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.5rem'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem'
  }
};

