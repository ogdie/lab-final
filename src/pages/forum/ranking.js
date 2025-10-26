import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { rankingAPI } from '../../services/api';

export default function Ranking() {
  const [user, setUser] = useState(null);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/';
      return;
    }
    
    setUser(JSON.parse(userData));
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      const data = await rankingAPI.getRanking();
      setRanking(data);
    } catch (err) {
      console.error('Error loading ranking:', err);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar user={user} />
      
      <div style={styles.content}>
        <h1 style={styles.title}>🏆 Ranking de XP</h1>
        
        <div style={styles.ranking}>
          {ranking.slice(0, 10).map((user, index) => (
            <div key={user._id} style={styles.item}>
              <div style={styles.position}>
                {index + 1}º
              </div>
              <img 
                src={user.profilePicture || '/default-avatar.svg'} 
                alt={user.name}
                style={styles.avatar}
              />
              <div style={styles.info}>
                <div style={styles.name}>{user.name}</div>
                <div style={styles.type}>{user.userType}</div>
              </div>
              <div style={styles.xp}>
                ⭐ {user.xp} XP
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    flex: 1
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  ranking: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1rem'
  },
  position: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2196F3',
    minWidth: '50px'
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
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  type: {
    fontSize: '0.9rem',
    color: '#666'
  },
  xp: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#FF9800'
  }
};

