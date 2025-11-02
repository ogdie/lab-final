import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/ui/Navbar";
import Footer from "../../components/ui/Footer";
import TopicCard from "../../components/TopicCard";
import TopicModal from "../../components/ui/TopicModal";
import { forumAPI, usersAPI } from "../../services/api";
import { useThemeLanguage } from "../../context/ThemeLanguageContext";

const getStyles = (theme) => {
  const isDark = theme === "dark";
  const textPrimary = isDark ? "#e4e6eb" : "#1d2129";
  const textSecondary = isDark ? "#b0b3b8" : "#5e5e5e";
  const backgroundPrimary = isDark ? "#1d2226" : "#f3f2ef";
  const backgroundCard = isDark ? "#2c2f33" : "#ffffff";
  const borderSubtle = isDark ? "#3e4042" : "#d1d1d1";
  const blueAction = "#8B5CF6";

  return {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: backgroundPrimary,
      fontFamily:
        "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    layout: {
      display: "flex",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "16px 0",
      flex: 1,
      gap: "24px",
      alignItems: "flex-start",
      width: "100%",
    },
    sidebar: {
      position: "sticky",
      top: "72px",
      width: "240px",
      flexShrink: 0,
      background: backgroundCard,
      borderRadius: "12px",
      boxShadow: "0 0 0 1px rgb(0 0 0 / 15%), 0 2px 3px rgb(0 0 0 / 20%)",
      border: `1px solid ${borderSubtle}`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      zIndex: 10,
    },
    sidebarHeader: {
      height: "54px",
      background: blueAction,
      marginBottom: "-32px",
    },
    userCard: {
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
    },
    avatar: {
      width: "72px",
      height: "72px",
      borderRadius: "50%",
      objectFit: "cover",
      border: `2px solid ${backgroundCard}`,
    },
    cardTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: textPrimary,
      margin: "4px 0 0 0",
    },
    cardSubtitle: {
      fontSize: "0.9rem",
      color: textSecondary,
      margin: "0 0 16px 0",
    },
    statsSection: {
      padding: "12px 16px",
      borderTop: `1px solid ${borderSubtle}`,
      width: "100%",
    },
    statItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "0.9rem",
      color: textSecondary,
      width: "100%",
      padding: "4px 0",
      cursor: "pointer",
    },
    statValue: {
      color: blueAction,
      fontWeight: "bold",
    },
    userCardButtons: {
      padding: "12px 16px",
      borderTop: `1px solid ${borderSubtle}`,
      width: "100%",
    },
    button: {
      width: "100%",
      padding: "8px 16px",
      background: backgroundCard,
      border: `1px solid ${blueAction}`,
      borderRadius: "24px",
      fontSize: "1rem",
      fontWeight: "600",
      color: blueAction,
      cursor: "pointer",
      transition: "background 0.2s, border-color 0.2s",
      marginBottom: "8px",
    },
    mainArea: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      maxWidth: "560px",
    },
    title: {
      fontSize: "1.5rem",
      color: textPrimary,
      fontWeight: "600",
      margin: "0 0 8px 0",
    },
    subtitle: {
      fontSize: "1rem",
      color: textSecondary,
      margin: "0 0 16px 0",
    },
    createPostContainer: {
      background: backgroundCard,
      borderRadius: "12px",
      boxShadow: "0 0 0 1px rgb(0 0 0 / 15%), 0 2px 3px rgb(0 0 0 / 20%)",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      border: `1px solid ${borderSubtle}`,
    },
    createPostInput: {
      flex: 1,
      padding: "10px 16px",
      borderRadius: "24px",
      border: `1px solid ${textSecondary}`,
      color: textPrimary,
      cursor: "pointer",
    },
    topics: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    searchResults: {
      position: "fixed",
      top: "80px",
      left: "50%",
      transform: "translateX(-50%)",
      background: backgroundCard,
      border: `1px solid ${borderSubtle}`,
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      zIndex: 1000,
      width: "90%",
      maxWidth: "500px",
      maxHeight: "400px",
      overflowY: "auto",
    },
    searchHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      borderBottom: `1px solid ${borderSubtle}`,
      background: isDark ? "#3a3b3c" : "#f8f9fa",
      color: textPrimary,
    },
    userResult: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem",
      borderBottom: `1px solid ${borderSubtle}`,
      color: textPrimary,
    },
    resultInfo: { flex: 1 },
    resultAvatar: { width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" },
    viewProfileButton: {
      padding: "0.5rem 1rem",
      background: blueAction,
      color: "white",
      border: "none",
      borderRadius: "24px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "600",
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "1.2rem",
      cursor: "pointer",
      color: textSecondary,
    },
    loading: {
      textAlign: "center",
      padding: "2rem",
      fontSize: "1.2rem",
      color: textPrimary,
    },
    error: {
      textAlign: "center",
      padding: "1rem",
      fontSize: "1rem",
      color: "#d32f2f",
      background: `${backgroundCard}80`,
      borderRadius: "8px",
    },
    empty: {
      textAlign: "center",
      padding: "2rem",
      color: textSecondary,
      fontStyle: "italic",
      background: backgroundCard,
      borderRadius: "12px",
      boxShadow: "0 0 0 1px rgb(0 0 0 / 15%), 0 2px 3px rgb(0 0 0 / 20%)",
    },
  };
};

export default function Forum() {
  const router = useRouter();
  const { t, theme, language } = useThemeLanguage();
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchPaused, setSearchPaused] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  const styles = getStyles(theme);

  const defaultTopics = [
    {
      _id: "1",
      name: "Reports",
      description: "Discussão sobre relatórios e métricas de desempenho.",
      category: "Geral",
      posts: [],
    },
    {
      _id: "2",
      name: "FullStack",
      description:
        "Discussão sobre desenvolvimento com foco em FullStack (Frontend e Backend).",
      category: "Dev",
      posts: [],
    },
    {
      _id: "3",
      name: "C",
      description: "Programação em C: dúvidas, projetos e boas práticas.",
      category: "Linguagem",
      posts: [],
    },
    {
      _id: "4",
      name: "Python",
      description: "Comunidade Python: Data Science, Web, Automação e mais.",
      category: "Linguagem",
      posts: [],
    },
    {
      _id: "5",
      name: "Outros",
      description: "Tópicos diversos que não se encaixam em outras categorias.",
      category: "Geral",
      posts: [],
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    let parsedUser = null;
    try {
      parsedUser = userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error("Invalid user data in localStorage:", e);
    }

    if (!token || !parsedUser?._id) {
      router.push("/");
      return;
    }

    setUser(parsedUser);
    loadTopics();
  }, [router, t]);

  const loadTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await forumAPI.getTopics();
      const backendTopics = Array.isArray(data) ? data : [];
      const byName = new Map();
      
      // Mapa com descrições traduzidas
      const topicDescriptions = {
        'reports': t('topic_reports_desc'),
        'fullstack': t('topic_fullstack_desc'),
        'c': t('topic_c_desc'),
        'python': t('topic_python_desc'),
        'outros': t('topic_others_desc'),
        'others': t('topic_others_desc')
      };
      
      backendTopics.forEach((t) => {
        const key = (t?.name || "").toLowerCase();
        if (!byName.has(key)) {
          // Aplicar descrição traduzida se disponível
          if (topicDescriptions[key]) {
            t.description = topicDescriptions[key];
          }
          byName.set(key, t);
        }
      });
      
      const merged = [...byName.values()];
      defaultTopics.forEach((t) => {
        const key = (t?.name || "").toLowerCase();
        if (!byName.has(key)) {
          // Aplicar descrição traduzida
          if (topicDescriptions[key]) {
            t.description = topicDescriptions[key];
          }
          merged.push(t);
        }
      });
      
      // Garantir que Reports seja sempre o primeiro
      const reportsIndex = merged.findIndex(t => (t?.name || "").toLowerCase() === "reports");
      if (reportsIndex > 0) {
        const reportsTopic = merged.splice(reportsIndex, 1)[0];
        merged.unshift(reportsTopic);
      }
      
      setTopics(merged);
    } catch (err) {
      console.error("Error loading topics:", err);
      // Aplicar traduções aos defaultTopics também em caso de erro
      const translatedDefaults = defaultTopics.map(t => {
        const key = (t?.name || "").toLowerCase();
        const topicDescriptions = {
          'reports': t('topic_reports_desc'),
          'fullstack': t('topic_fullstack_desc'),
          'c': t('topic_c_desc'),
          'python': t('topic_python_desc'),
          'outros': t('topic_others_desc'),
          'others': t('topic_others_desc')
        };
        if (topicDescriptions[key]) {
          return { ...t, description: topicDescriptions[key] };
        }
        return t;
      });
      setTopics(translatedDefaults);
      setError(
        "Não foi possível carregar os tópicos do fórum. Exibindo dados padrão."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = (topic) => {
    setTopics([
      {
        _id: Math.random().toString(36).substr(2, 9),
        ...topic,
        posts: [],
        category: "Geral",
      },
      ...topics,
    ]);
  };

  const handleSearch = async (query) => {
    if (!query?.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchPaused(false);
      setLastSearchQuery('');
      return;
    }

    // Se a pesquisa está pausada e a query não mudou, não fazer nada
    if (searchPaused && query === lastSearchQuery) {
      return;
    }

    // Se a query mudou, reativar a pesquisa
    if (query !== lastSearchQuery) {
      setSearchPaused(false);
    }

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
    setSearchPaused(true); // Pausar a pesquisa para evitar reabertura automática
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.layout}>
          <div style={styles.mainArea}>
            <p style={styles.loading}>{t('loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar user={user} onSearch={handleSearch} />
      <div style={styles.layout}>
        {showSearchResults && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <div 
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                zIndex: 999 
              }}
              onClick={handleCloseSearch}
            />
            <div 
              style={{...styles.searchResults, zIndex: 1001}}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.searchHeader}>
                <h3 style={{ margin: 0 }}>{t('search_results')}</h3>
                <button onClick={handleCloseSearch} style={styles.closeButton}>✖</button>
              </div>
              {searchResults.length === 0 ? (
                <p style={{ padding: '1rem', color: styles.subtitle.color }}>{t('no_users_found')}</p>
              ) : (
                searchResults.map((u) => (
                  <div key={u._id} style={styles.userResult}>
                    <img src={u.profilePicture || '/default-avatar.svg'} alt={u.name} style={styles.resultAvatar} />
                    <div style={styles.resultInfo}>
                      <h4 style={{ margin: 0, color: styles.title.color }}>{u.name}</h4>
                      <p style={{ margin: '2px 0 0 0', color: styles.subtitle.color, fontSize: '0.85rem' }}>{u.email}</p>
                    </div>
                    <button onClick={() => router.push(`/profile?id=${u._id}`)} style={styles.viewProfileButton}>{t('view_profile')}</button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        {user && (
          <aside style={styles.sidebar}>
            <div style={styles.sidebarHeader} />
            <div style={styles.userCard}>
              <img
                src={user.profilePicture || "/default-avatar.svg"}
                alt={user.name}
                style={styles.avatar}
              />
              <h3 style={styles.cardTitle}>{user.name || t('user')}</h3>
              <p style={styles.cardSubtitle}>
                {user.title || 'Developer'}
              </p>
            </div>
            <div style={styles.statsSection}>
              <div style={styles.statItem}>
                <span>{language === 'pt' ? 'Quem viu seu perfil' : 'Who viewed your profile'}</span>
                <strong style={styles.statValue}>12</strong>
              </div>
              <div style={styles.statItem}>
                <span>{language === 'pt' ? 'Visualizações do post' : 'Post views'}</span>
                <strong style={styles.statValue}>42</strong>
              </div>
              <div
                style={styles.statItem}
                onClick={() => router.push("/forum/ranking")}
              >
                <span>⭐ {t('xp')} {language === 'pt' ? 'no Fórum' : 'in the Forum'}</span>
                <strong style={styles.statValue}>{user.xp || 0}</strong>
              </div>
            </div>
            <div style={styles.userCardButtons}>
              <button
                style={styles.button}
                onClick={() => router.push("/forum/ranking")}
              >
                {language === 'pt' ? 'Ir para Ranking' : 'Go to Ranking'}
              </button>
            </div>
          </aside>
        )}

        <main style={styles.mainArea}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              style={styles.button}
              onClick={() => setShowTopicModal(true)}
            >
              {t('create_new_topic')}
            </button>
          </div>

          {error && <p style={styles.error}>⚠️ {error}</p>}
          <h1 style={styles.title}>Tópicos Populares</h1>
          <div style={styles.topics}>
            {topics.length === 0 ? (
              <p style={styles.empty}>Nenhum tópico disponível no momento.</p>
            ) : (
              topics.map((topic) => (
                <TopicCard key={topic._id || Math.random()} topic={topic} />
              ))
            )}
          </div>
        </main>
        {/* Espaço para um feed lateral de "Sugestões para você" ou "Trending" no futuro, mantendo o layout LinkedIn de 3 colunas em telas grandes, mas só implementamos 2 colunas aqui (Sidebar + MainArea) */}
      </div>

      <TopicModal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        onSubmit={handleCreateTopic}
        theme={theme}
      />

      <Footer />
    </div>
  );
}
