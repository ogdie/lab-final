import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/ui/Navbar';
import BackButton from '../../components/ui/BackButton';
import Footer from '../../components/ui/Footer';
import { rankingAPI, usersAPI } from '../../services/api';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

export default function Ranking() {
  const router = useRouter();
  const { t, theme } = useThemeLanguage();
  const [user, setUser] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [infoHover, setInfoHover] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchPaused, setSearchPaused] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

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
      setError(t('error_loading_ranking') || 'Não foi possível carregar o ranking.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query?.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchPaused(false);
      setLastSearchQuery('');
      return;
    }

    if (searchPaused && query === lastSearchQuery) return;
    if (query !== lastSearchQuery) setSearchPaused(false);

    try {
      const users = await usersAPI.searchUsers(query);
      setSearchResults(Array.isArray(users) ? users : []);
      setShowSearchResults(true);
      setLastSearchQuery(query);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    }
  };

  const handleCloseSearch = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchPaused(true);
  };

  const styles = getStyles(theme);

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.content}>
          <p style={styles.loading}>{t('loading')}</p>
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
      <Navbar user={user} onSearch={handleSearch} />

      <div style={styles.content}>
        <div style={{ marginBottom: '12px' }}>
          <BackButton to="/forum" />
        </div>

        {showSearchResults && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
              onClick={handleCloseSearch}
            />
            <div
              style={{ ...styles.searchResults, zIndex: 1001 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.searchHeader}>
                <h3 style={{ margin: 0 }}>{t('search_results')}</h3>
                <button onClick={handleCloseSearch} style={styles.closeButton}>✖</button>
              </div>
              {searchResults.length === 0 ? (
                <p style={{ padding: '1rem' }}>{t('no_users_found')}</p>
              ) : (
                searchResults.map((u) => (
                  <div key={u._id} style={styles.userResult}>
                    <img
                      src={u.profilePicture || '/default-avatar.svg'}
                      alt={u.name}
                      style={styles.resultAvatar}
                    />
                    <div style={styles.resultInfo}>
                      <h4 style={{ margin: 0 }}>{u.name}</h4>
                      <p style={{ margin: '2px 0 0 0', color: '#606770', fontSize: '0.85rem' }}>{u.email}</p>
                    </div>
                    <button
                      onClick={() => router.push(`/profile?id=${u._id}`)}
                      style={styles.viewProfileButton}
                    >
                      {t('view_profile')}
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        <h1 style={styles.title}>🏆 {t('xp')} {t('ranking_title')}</h1>

        <div
          style={{
            ...styles.infoBox,
            ...(infoHover ? styles.infoBoxHover : null),
          }}
          onMouseEnter={() => setInfoHover(true)}
          onMouseLeave={() => setInfoHover(false)}
        >
          <p style={styles.infoText}>{t('ranking_info_text')}</p>
        </div>

        {top10.length === 0 ? (
          <p style={styles.empty}>{t('no_users_in_ranking')}</p>
        ) : (
          <div style={styles.ranking}>
            {top10.map((rankedUser, index) => (
              <div key={rankedUser._id || `rank-${index}`} style={styles.item}>
                <div style={styles.position}>{index + 1}º</div>
                <img
                  src={rankedUser.profilePicture || '/default-avatar.svg'}
                  alt={rankedUser.name || t('user')}
                  style={styles.avatar}
                />
                <div style={styles.info}>
                  <div style={styles.name}>
                    {rankedUser.name || t('name_unavailable')}
                  </div>
                  <div style={styles.type}>
                    {(() => {
                      const type = (rankedUser.userType || '').toString().toLowerCase();
                      if (type === 'estudante' || type === 'student') return t('user_type_student');
                      if (type === 'professor' || type === 'teacher') return t('user_type_professor');
                      if (type === 'recrutador' || type === 'recruiter') return t('user_type_recruiter');
                      return t('user_type_undefined');
                    })()}
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

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#666';
  const backgroundPrimary = isDark ? '#1d2226' : '#f3f2ef';
  const backgroundCard = isDark ? '#2c2f33' : 'white';
  const borderSubtle = isDark ? '#3e4042' : '#e0e0e0';
  const blueAction = '#8B5CF6';

  return {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: backgroundPrimary,
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      flex: 1,
      color: textPrimary,
    },
    searchResults: {
      position: 'fixed',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: backgroundCard,
      border: `1px solid ${borderSubtle}`,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      width: '90%',
      maxWidth: '500px',
      maxHeight: '400px',
      overflowY: 'auto',
      color: textPrimary,
    },
    searchHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: `1px solid ${borderSubtle}`,
      background: isDark ? '#3a3b3c' : '#f8f9fa',
      color: textPrimary,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer',
      color: textSecondary,
    },
    userResult: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      borderBottom: `1px solid ${borderSubtle}`,
    },
    resultInfo: { flex: 1 },
    resultAvatar: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' },
    viewProfileButton: {
      padding: '0.5rem 1rem',
      background: '#4F46E5',
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1rem',
      textAlign: 'center',
      color: textPrimary,
    },
    infoBox: {
      background: backgroundCard,
      border: `1px solid ${borderSubtle}`,
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1.5rem',
      textAlign: 'center',
      transition: 'background 150ms ease, border-color 150ms ease',
    },
    infoBoxHover: {
      background: isDark ? '#314255' : '#e7f3ff',
      borderColor: isDark ? '#3e5a78' : '#b3d4ff',
    },
    infoText: {
      margin: 0,
      fontSize: '1rem',
      color: textPrimary,
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
      background: backgroundCard,
      border: `1px solid ${borderSubtle}`,
      borderRadius: '8px',
      padding: '1rem',
    },
    position: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: blueAction,
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
      color: textPrimary,
    },
    type: {
      fontSize: '0.9rem',
      color: textSecondary,
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
      color: textSecondary,
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
      color: textSecondary,
      fontStyle: 'italic',
    },
  };
};
