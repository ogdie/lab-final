import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import TopicCard from "../../components/TopicCard";
import TopicModal from "@/components/TopicModal";
import { forumAPI } from "../../services/api";

const getStyles = (theme) => {
  const isDark = theme === "dark";
  const textPrimary = isDark ? "#e4e6eb" : "#1d2129";
  const textSecondary = isDark ? "#b0b3b8" : "#5e5e5e";
  const backgroundPrimary = isDark ? "#1d2226" : "#f3f2ef";
  const backgroundCard = isDark ? "#2c2f33" : "#ffffff";
  const borderSubtle = isDark ? "#3e4042" : "#d1d1d1";
  const blueAction = "#0a66c2";

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
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [theme, setTheme] = useState("light");

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
      description: "Discussão sobre desenvolvimento com foco em FullStack (Frontend e Backend).",
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
  }, [router]);

  const loadTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await forumAPI.getTopics();
      const backendTopics = Array.isArray(data) ? data : [];
      const byName = new Map();
      backendTopics.forEach((t) => {
        const key = (t?.name || "").toLowerCase();
        if (!byName.has(key)) byName.set(key, t);
      });
      const merged = [...byName.values()];
      defaultTopics.forEach((t) => {
        const key = (t?.name || "").toLowerCase();
        if (!byName.has(key)) merged.push(t);
      });
      setTopics(merged);
    } catch (err) {
      console.error("Error loading topics:", err);
      setTopics(defaultTopics);
      setError("Não foi possível carregar os tópicos do fórum. Exibindo dados padrão.");
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

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.layout}>
          <div style={styles.mainArea}>
            <p style={styles.loading}>Carregando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar user={user} />
      <div style={styles.layout}>
        {user && (
          <aside style={styles.sidebar}>
            <div style={styles.sidebarHeader} />
            <div style={styles.userCard}>
              <img
                src={user.profilePicture || "/default-avatar.svg"}
                alt={user.name}
                style={styles.avatar}
              />
              <h3 style={styles.cardTitle}>{user.name || "Usuário"}</h3>
              <p style={styles.cardSubtitle}>{user.title || "Desenvolvedor Júnior"}</p>
            </div>
            <div style={styles.statsSection}>
                <div style={styles.statItem}>
                    <span>Quem viu seu perfil</span>
                    <strong style={styles.statValue}>12</strong>
                </div>
                <div style={styles.statItem}>
                    <span>Visualizações do post</span>
                    <strong style={styles.statValue}>42</strong>
                </div>
                <div style={styles.statItem} onClick={() => router.push("/forum/ranking")}>
                    <span>⭐ XP no Fórum</span>
                    <strong style={styles.statValue}>{user.xp || 0}</strong>
                </div>
            </div>
            <div style={styles.userCardButtons}>
              <button
                style={styles.button}
                onClick={() => router.push("/forum/ranking")}
              >
                Ver Ranking
              </button>
            </div>
          </aside>
        )}

        <main style={styles.mainArea}>
            <div style={styles.createPostContainer}>
                <img
                    src={user?.profilePicture || "/default-avatar.svg"}
                    alt={user?.name || "Usuário"}
                    style={{ ...styles.avatar, width: "48px", height: "48px" }}
                />
                <div style={styles.createPostInput} onClick={() => setShowTopicModal(true)}>
                    Criar um novo tópico...
                </div>
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
      />

      <Footer />
    </div>
  );
}