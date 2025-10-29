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
  const textSecondary = isDark ? "#b0b3b8" : "#606770";
  const backgroundPrimary = isDark ? "#18191a" : "#f0f2f5";
  const backgroundCard = isDark ? "#242526" : "white";
  const borderSubtle = isDark ? "#3e4042" : "#e0e0e0";
  const blueAction = "#0a66c2";
  const blueActionLight = isDark ? "#1d3e66" : "#e7f3ff";

  return {
    container: { minHeight: "100vh", display: "flex", flexDirection: "column", background: backgroundPrimary },
    layout: {
      display: "flex",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "1rem 0",
      flex: 1,
      gap: "2rem",
    },
    sidebar: {
      position: "sticky",
      top: "72px",
      width: "280px",
      padding: "12px 16px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      height: "calc(100vh - 72px - 2rem)",
      overflowY: "auto",
      zIndex: 10,
    },
    userCard: {
      background: backgroundCard,
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      border: `1px solid ${borderSubtle}`,
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    cardTitle: {
      fontSize: "1rem",
      fontWeight: "600",
      color: textPrimary,
      margin: 0,
      borderBottom: `1px solid ${borderSubtle}`,
      paddingBottom: "8px",
    },
    statItem: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "0.95rem",
      color: textSecondary,
    },
    statValue: {
      color: textPrimary,
      fontWeight: "bold",
    },
    userCardButtons: { display: "flex", flexDirection: "column", gap: "0.5rem" },
    button: {
      width: "100%",
      padding: "12px 16px",
      background: backgroundCard,
      border: `1px solid ${borderSubtle}`,
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      color: textPrimary,
      cursor: "pointer",
      transition: "background 0.2s",
    },
    mainArea: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      padding: "0 16px",
      maxWidth: "650px",
      margin: "0 auto",
    },
    title: { fontSize: "2rem", marginBottom: "0.5rem", color: textPrimary },
    subtitle: { fontSize: "1.1rem", color: textSecondary, marginBottom: "1rem" },
    topics: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "1rem",
    },
    loading: { textAlign: "center", padding: "2rem", fontSize: "1.2rem", color: textPrimary },
    error: { textAlign: "center", padding: "2rem", fontSize: "1.2rem", color: "#d32f2f" },
    empty: { textAlign: "center", padding: "2rem", color: textSecondary, fontStyle: "italic" },
  };
};

export default function Forum() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [theme, setTheme] = useState("light"); // Ajuste para dark/light se tiver context

  const styles = getStyles(theme);

  const defaultTopics = [
    { _id: "1", name: "Reports", description: "Discussão sobre relatórios", category: "Geral", posts: [] },
    { _id: "2", name: "FullStack", description: "Tudo sobre desenvolvimento FullStack", category: "Dev", posts: [] },
    { _id: "3", name: "C", description: "Programação em C", category: "Linguagem", posts: [] },
    { _id: "4", name: "Python", description: "Programação em Python", category: "Linguagem", posts: [] },
    { _id: "5", name: "Outros", description: "Tópicos diversos", category: "Geral", posts: [] },
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
      setTopics([...defaultTopics, ...backendTopics]);
    } catch (err) {
      console.error("Error loading topics:", err);
      setTopics(defaultTopics);
      setError("Não foi possível carregar os tópicos do fórum.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = (topic) => {
    setTopics([
      { _id: Math.random().toString(36).substr(2, 9), ...topic, posts: [], category: "Geral" },
      ...topics,
    ]);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.mainArea}>
          <p style={styles.loading}>Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar user={user} />

      <div style={styles.layout}>
        {/* Sidebar lateral esquerda */}
        <aside style={styles.sidebar}>
          {user && (
            <div style={styles.userCard}>
              <h3 style={styles.cardTitle}>Seu Desempenho</h3>
              <div style={styles.statItem}>
                <span>⭐ XP</span>
                <strong style={styles.statValue}>{user.xp || 0}</strong>
              </div>
              <div style={styles.userCardButtons}>
                <button style={styles.button} onClick={() => router.push("/forum/ranking")}>
                  Ver Ranking
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Área principal */}
        <main style={styles.mainArea}>
          <h1 style={styles.title}>Fórum</h1>
          <p style={styles.subtitle}>Escolha um tópico para participar</p>

          <div style={styles.topics}>
            {topics.length === 0 ? (
              <p style={styles.empty}>Nenhum tópico disponível no momento.</p>
            ) : (
              topics.map((topic) => <TopicCard key={topic._id || Math.random()} topic={topic} />)
            )}
          </div>

          {error && <p style={styles.error}>{error}</p>}
        </main>
      </div>

      <TopicModal isOpen={showTopicModal} onClose={() => setShowTopicModal(false)} onSubmit={handleCreateTopic} />

      <Footer />
    </div>
  );
}
