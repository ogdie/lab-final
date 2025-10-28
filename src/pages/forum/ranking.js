import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { rankingAPI } from '../../services/api';

export default function Ranking() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [infoHover, setInfoHover] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    let parsedUser = null;
    try {
      parsedUser = userData ? JSON.parse(userData) : null;
    } catch {}

    if (!token || !parsedUser?._id) {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    loadRanking();
  }, [router]);

  const loadRanking = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rankingAPI.getRanking();
      setRanking(Array.isArray(data) ? data : []);
    } catch {
      setError('Não foi possível carregar o ranking.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.content}>
          <p style={styles.loading}>Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.content}>
          <p style={styles.error}>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const top10 = ranking.slice(0, 10);

  return (
    <div style={styles.container}>
      <Navbar user={user} />

      <div style={styles.content}>
        <h1 style={styles.title}>🏆 Ranking de XP</h1>

        <div
          style={{
            ...styles.infoBox,
            ...(infoHover ? styles.infoBoxHover : null),
          }}
          onMouseEnter={() => setInfoHover(true)}
          onMouseLeave={() => setInfoHover(false)}
        >
          <p style={styles.infoText}>
            Ao final de cada mês, os participantes que alcançarem o topo do ranking receberão um prêmio exclusivo da Codemia!
            Participe, dê o seu melhor e conquiste recompensas especiais por sua dedicação e desempenho.
          </p>
        </div>

        {top10.length === 0 ? (
          <p style={styles.empty}>Nenhum usuário no ranking ainda.</p>
        ) : (
          <div style={styles.ranking}>
            {top10.map((rankedUser, index) => (
              <div key={rankedUser._id || `rank-${index}`} style={styles.item}>
                <div style={styles.position}>{index + 1}º</div>
                <img
                  src={rankedUser.profilePicture || '/default-avatar.svg'}
                  alt={rankedUser.name || 'Usuário'}
                  style={styles.avatar}
                />
                <div style={styles.info}>
                  <div style={styles.name}>
                    {rankedUser.name || 'Nome indisponível'}
                  </div>
                  <div style={styles.type}>
                    {rankedUser.userType || 'Tipo não definido'}
                  </div>
                </div>
                <div style={styles.xp}>⭐ {rankedUser.xp || 0} XP</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    flex: 1,
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  infoBox: {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    transition: 'background 150ms ease, border-color 150ms ease',
  },
  infoBoxHover: {
    background: '#e7f3ff',
    borderColor: '#b3d4ff',
  },
  infoText: {
    margin: 0,
    fontSize: '1rem',
    color: '#333',
    lineHeight: 1.5,
  },
  ranking: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1rem',
  },
  position: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2196F3',
    minWidth: '50px',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  type: {
    fontSize: '0.9rem',
    color: '#666',
  },
  xp: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#FF9800',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#d32f2f',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
    fontStyle: 'italic',
  },
};
