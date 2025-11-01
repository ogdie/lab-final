'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../components/ui/Navbar';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import Footer from '../components/ui/Footer';
import EditProfileModal from '../components/ui/EditProfileModal';
import FollowButton from '../components/ui/FollowButton';
import AlertModal from '../components/ui/AlertModal';
import UsersListModal from '../components/ui/UsersListModal';
import { usersAPI } from '../services/api';
import AddAchievementModal from '../components/ui/AddAchievementModal';
import AchievementCard from '../components/AchievementCard';
import { FaTimes, FaEdit, FaTrophy, FaStar, FaShare, FaPaperPlane } from 'react-icons/fa';

// Função para estilos dinâmicos da página de perfil
const getPageStyles = (theme) => {
  const isDark = theme === 'dark';
  return {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: isDark ? '#1d2226' : '#f3f2ef',
      color: isDark ? '#e4e6eb' : '#1d2129',
    },
    content: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
      flex: 1,
    },
    profileHeader: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      padding: '2rem 0',
    },
    profileImage: {
      width: '144px',
      height: '144px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid #4F46E5',
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: '1.875rem',
      fontWeight: '600',
      margin: 0,
      color: isDark ? '#e4e6eb' : '#1d2129',
    },
    editButton: {
      padding: '0.5rem 1rem',
      background: '#4F46E5',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'background 0.2s',
    },
    email: {
      fontSize: '1rem',
      color: isDark ? '#b0b3b8' : '#606770',
      margin: '0 0 0.5rem 0',
    },
    infoText: {
      fontSize: '1rem',
      color: isDark ? '#b0b3b8' : '#606770',
      margin: '0 0 0.5rem 0',
    },
    bio: {
      fontSize: '1rem',
      color: isDark ? '#e4e6eb' : '#1d2129',
      margin: '1rem 0',
      lineHeight: 1.5,
    },
    stats: {
      display: 'flex',
      gap: '1.5rem',
      marginTop: '1rem',
      marginBottom: '1.5rem',
    },
    statsItem: {
      display: 'flex',
      flexDirection: 'column',
    },
    statsStrong: {
      fontWeight: '600',
      color: isDark ? '#e4e6eb' : '#1d2129',
    },
    statsSpan: {
      fontSize: '0.9rem',
      color: isDark ? '#b0b3b8' : '#606770',
    },
    achievementsSection: {
      marginTop: '2rem',
    },
    achievementsTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: isDark ? '#e4e6eb' : '#1d2129',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: `1px solid ${isDark ? '#3e4042' : '#e7e7e7'}`,
    },
    noAchievements: {
      marginTop: '2rem',
      textAlign: 'center',
      fontStyle: 'italic',
      color: isDark ? '#b0b3b8' : '#606770',
    },
    addAchievementLink: {
      background: 'none',
      border: 'none',
      color: '#4F46E5',
      cursor: 'pointer',
      marginLeft: '0.3rem',
      fontWeight: '600',
      fontSize: 'inherit',
    },
    loadingText: {
      textAlign: 'center',
      padding: '2rem',
      fontSize: '1.2rem',
      color: isDark ? '#b0b3b8' : '#666',
    },
    error: {
      textAlign: 'center',
      padding: '2rem',
      fontSize: '1.2rem',
      color: '#d32f2f',
    },
  };
};

export default function Profile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, theme, language } = useThemeLanguage();
  const isDark = theme === 'dark';
  const styles = getPageStyles(theme);

  // Função helper para traduzir userType
  const translateUserType = (userType) => {
    if (!userType) return userType;
    const typeMap = {
      'Estudante': 'user_type_student',
      'Professor': 'user_type_professor',
      'Recrutador': 'user_type_recruiter'
    };
    return t(typeMap[userType]) || userType;
  };

  // Função helper para traduzir institution
  const translateInstitution = (institution) => {
    if (!institution) return institution;
    if (institution === 'Outros') {
      return t('institution_others');
    }
    return institution;
  };

  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: '', title: 'Aviso' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchPaused, setSearchPaused] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

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

    setCurrentUser(parsedUser);
  }, []);

  // Separar useEffect para searchParams para evitar interferência na navegação
  useEffect(() => {
    if (!currentUser?._id) return;
    
    let userId;
    try {
      userId = searchParams?.get("id") || currentUser._id;
    } catch (e) {
      userId = currentUser._id;
    }
    
    if (userId) {
      loadUser(userId);
    } else {
      setError("ID de usuário inválido.");
      setLoading(false);
    }
    // Usar apenas currentUser._id como dependência para evitar loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id]);

  // Listener adicional para mudanças na URL (para navegação do Next.js)
  useEffect(() => {
    if (!currentUser?._id || typeof window === 'undefined') return;
    
    const checkUrlChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlUserId = params.get("id") || currentUser._id;
        // Só recarregar se o userId mudou
        if (urlUserId && urlUserId !== user?._id) {
          loadUser(urlUserId);
        }
      } catch (e) {
        // Ignorar erros
      }
    };
    
    // Verificar mudanças na URL periodicamente (fallback para Next.js router)
    const interval = setInterval(checkUrlChange, 300);
    
    // Listener para popstate (botões back/forward)
    window.addEventListener('popstate', checkUrlChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('popstate', checkUrlChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, user?._id]);

  const loadUser = async (userId) => {
    try {
      const data = await usersAPI.getById(userId);
      if (!data?._id) throw new Error("Usuário não encontrado.");
      setUser(data);
    } catch (err) {
      console.error("Error loading user:", err);
      setError("Não foi possível carregar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (formData) => {
    if (!user?._id) return;
    try {
      await usersAPI.editProfile(user._id, formData);
      const updatedUser = await usersAPI.getById(user._id);
      await loadUser(user._id);

      if (currentUser && currentUser._id === user._id && updatedUser) {
        const updatedCurrentUser = { ...currentUser, ...updatedUser };
        setCurrentUser(updatedCurrentUser);
        localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
      }

      setAlert({
        isOpen: true,
        message: "Perfil atualizado com sucesso!",
        title: "Sucesso!",
      });
    } catch (err) {
      setAlert({
        isOpen: true,
        message: err.message || "Erro ao atualizar perfil.",
        title: "Erro ao atualizar perfil",
      });
    }
  };

  const handleFollow = async (userId) => {
    if (!userId || !currentUser?._id) return;
    try {
      const resp = await usersAPI.toggleFollow(userId, currentUser._id);
      await loadUser(userId);
      const freshCurrent = await usersAPI.getById(currentUser._id);
      setCurrentUser(freshCurrent);
      localStorage.setItem("user", JSON.stringify(freshCurrent));
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, message: "", title: "Aviso" });
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
      console.error("Error searching users:", err);
      setSearchResults([]);
    }
  };

  const handleCloseSearch = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchPaused(true); // Pausar a pesquisa para evitar reabertura automática
  };

  const handleShareProfile = async () => {
    if (!user?._id) return;
    
    const profileUrl = `${window.location.origin}/profile?id=${user._id}`;
    
    try {
      await navigator.clipboard.writeText(profileUrl);
      setAlert({
        isOpen: true,
        message: t('profile_link_copied'),
        title: t('success'),
      });
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      setAlert({
        isOpen: true,
        message: 'Não foi possível copiar o link.',
        title: 'Erro',
      });
    }
  };

  const handleAddAchievement = async (formData) => {
    if (!user?._id) return;
    try {
      await usersAPI.addAchievement(user._id, formData);
      await loadUser(user._id);
      setAlert({
        isOpen: true,
        message: 'Conquista adicionada com sucesso!',
        title: 'Sucesso!',
      });
    } catch (err) {
      console.error('Erro ao adicionar conquista:', err);
      setAlert({
        isOpen: true,
        message: err.message || 'Não foi possível salvar a conquista.',
        title: 'Erro',
      });
    } finally {
      setShowAchievementModal(false);
    }
  };

  // Funções estáveis para os modais de seguidores/seguindo
  const fetchFollowers = useCallback(async () => {
    if (!user?._id) return [];
    try {
      return await usersAPI.getFollowers(user._id);
    } catch (err) {
      console.error('Error loading followers:', err);
      return [];
    }
  }, [user?._id]);

  const fetchFollowing = useCallback(async () => {
    if (!user?._id) return [];
    try {
      return await usersAPI.getFollowing(user._id);
    } catch (err) {
      console.error('Error loading following:', err);
      return [];
    }
  }, [user?._id]);

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={currentUser} onSearch={handleSearch} />
        <div style={styles.content}>
          <p style={styles.loadingText}>{t("loading")}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Navbar user={currentUser} onSearch={handleSearch} />
        <div style={styles.content}>
          <p style={styles.error}>{t("error_loading_profile")}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <Navbar user={currentUser} onSearch={handleSearch} />
        <div style={styles.content}>
          <p style={styles.error}>{t("user_not_found")}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar user={currentUser} onSearch={handleSearch} />

      {/* Modal de Busca */}
      {showSearchResults && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999, // Lower than search modal
            }}
            onClick={handleCloseSearch}
          />
          <div
            style={{
              position: "fixed",
              top: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              background: isDark ? "#2c2f33" : "#ffffff",
              border: `1px solid ${isDark ? "#3e4042" : "#e0e0e0"}`,
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1001, // Higher than overlay
              width: "90%",
              maxWidth: "500px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                borderBottom: `1px solid ${isDark ? "#3e4042" : "#e0e0e0"}`,
                background: isDark ? "#3a3b3c" : "#f8f9fa",
              }}
            >
              <h3 style={{ color: isDark ? "#e4e6eb" : "#1d2129", margin: 0 }}>
                {t('search_results') || 'Resultados da busca'}
              </h3>
              <button
                onClick={handleCloseSearch}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: isDark ? "#b0b3b8" : "#666",
                }}
              >
                <FaTimes />
              </button>
            </div>
            {searchResults.length === 0 ? (
              <p style={{ padding: "2rem", textAlign: "center", color: isDark ? "#b0b3b8" : "#666" }}>
                {t('no_users_found') || 'Nenhum usuário encontrado'}
              </p>
            ) : (
              searchResults.map((userResult) => (
                <div
                  key={userResult._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    borderBottom: `1px solid ${isDark ? "#3e4042" : "#f0f0f0"}`,
                  }}
                >
                  <img
                    src={userResult.profilePicture || "/default-avatar.svg"}
                    alt={userResult.name || "Usuário"}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: isDark ? "#e4e6eb" : "#1d2129", margin: 0 }}>
                      {userResult.name || "Nome indisponível"}
                    </h4>
                    <p style={{ color: isDark ? "#b0b3b8" : "#606770", margin: "2px 0", fontSize: "0.85rem" }}>
                      {userResult.email || "Email indisponível"}
                    </p>
                    <p style={{ color: isDark ? "#b0b3b8" : "#606770", margin: "2px 0", fontSize: "0.85rem" }}>
                      <FaStar /> {userResult.xp || 0} XP
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/profile?id=${userResult._id}`)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#4F46E5",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}
                  >
                    {t('view_profile') || 'Ver Perfil'}
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <div style={styles.content}>
        {isMobile ? (
          // 📱 Mobile: imagem acima, tudo em coluna
          <div style={styles.profileHeader}>
            <img
              src={user.profilePicture || "/default-avatar.svg"}
              alt={user.name || "Usuário"}
              style={styles.profileImage}
            />
            <div style={styles.info}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <h1 style={styles.name}>{user.name || "Nome indisponível"}</h1>
                <button
                  onClick={handleShareProfile}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: isDark ? '#b0b3b8' : '#606770',
                    fontSize: '1.2rem',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? '#3a3b3c' : '#f0f0f0';
                    e.currentTarget.style.color = '#4F46E5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = isDark ? '#b0b3b8' : '#606770';
                  }}
                  title={t('share')}
                >
                  <FaShare />
                </button>
              </div>
              {currentUser && currentUser._id === user._id && (
                <div style={{ display: "flex", gap: "0.75rem", margin: "0.75rem 0 1rem 0" }}>
                  <button onClick={() => setShowEditModal(true)} style={styles.editButton}>
                    <FaEdit /> {t("edit_profile")}
                  </button>
                  <button
                    onClick={() => setShowAchievementModal(true)}
                    style={{
                      ...styles.editButton,
                      background: "#8B5CF6",
                    }}
                  >
                    <FaTrophy /> {t('add_achievement')}
                  </button>
                </div>
              )}

              <p style={styles.email}>{user.email || "Email indisponível"}</p>
              {user.userType && (
                <p style={styles.infoText}>
                  <strong>{t('type_label')}</strong> {translateUserType(user.userType)}
                </p>
              )}
              {user.institution && (
                <p style={styles.infoText}>
                  <strong>{t('institution_label')}</strong> {translateInstitution(user.institution)}
                </p>
              )}
              {user.birthDate && (
                <p style={styles.infoText}>
                  <strong>{t('date_of_birth')}</strong>{" "}
                  {new Date(user.birthDate).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-PT')}
                </p>
              )}
              <p style={styles.bio}>{user.bio || t('no_bio')}</p>

              <div style={styles.stats}>
                <div style={styles.statsItem}>
                  <strong style={styles.statsStrong}>{user.xp || 0}</strong>
                  <span style={styles.statsSpan}>{t("xp")}</span>
                </div>
                <div 
                  style={{ ...styles.statsItem, cursor: 'pointer' }}
                  onClick={() => setShowFollowersModal(true)}
                >
                  <strong style={styles.statsStrong}>{user.followers?.length || 0}</strong>
                  <span style={styles.statsSpan}>{t("followers_label")}</span>
                </div>
                <div 
                  style={{ ...styles.statsItem, cursor: 'pointer' }}
                  onClick={() => setShowFollowingModal(true)}
                >
                  <strong style={styles.statsStrong}>{user.following?.length || 0}</strong>
                  <span style={styles.statsSpan}>{t("following_label")}</span>
                </div>
              </div>

          {currentUser && currentUser._id !== user._id && (
            <div style={{ marginTop: "1rem", display: 'flex', gap: '0.75rem' }}>
              <FollowButton
                userId={user._id}
                currentUser={currentUser}
                onFollow={handleFollow}
              />
              <button
                onClick={() => router.push(`/chat?userId=${user._id}`)}
                style={{ padding: '0.5rem 1rem', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <FaPaperPlane />
                Enviar mensagem
              </button>
            </div>
          )}

              {/* Conquistas */}
              {Array.isArray(user.achievements) && user.achievements.length > 0 && (
                <div style={styles.achievementsSection}>
                  <h2 style={styles.achievementsTitle}>{t('achievements')}</h2>
                  <div>
                    {user.achievements
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((ach) => (
                        <AchievementCard
                          key={ach._id || ach.title + ach.date}
                          achievement={ach}
                          theme={theme}
                        />
                      ))}
                  </div>
                </div>
              )}

              {currentUser &&
                currentUser._id === user._id &&
                (!user.achievements || user.achievements.length === 0) && (
                  <div style={styles.noAchievements}>
                    <p>
                      {t('no_achievements_yet')}
                      <button
                        onClick={() => setShowAchievementModal(true)}
                        style={styles.addAchievementLink}
                      >
                        {t('add_now')}
                      </button>
                    </p>
                  </div>
                )}
            </div>
          </div>
        ) : (
          // 💻 Desktop: alinhar imagem com nome na mesma linha visual
          <div style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
              <img
                src={user.profilePicture || "/default-avatar.svg"}
                alt={user.name || "Usuário"}
                style={{
                  width: '144px',
                  height: '144px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #4F46E5',
                  marginTop: '4px', // ajuste fino para alinhar com a linha do texto
                }}
              />
              <div style={{ flex: 1 }}>
                {/* Nome + botões na mesma linha */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <h1 style={styles.name}>{user.name || "Nome indisponível"}</h1>
                  <button
                    onClick={handleShareProfile}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isDark ? '#b0b3b8' : '#606770',
                      fontSize: '1.2rem',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '50%',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#3a3b3c' : '#f0f0f0';
                      e.currentTarget.style.color = '#4F46E5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = isDark ? '#b0b3b8' : '#606770';
                    }}
                    title={t('share')}
                  >
                    <FaShare />
                  </button>
                  {currentUser && currentUser._id === user._id && (
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button onClick={() => setShowEditModal(true)} style={styles.editButton}>
                        <FaEdit /> {t("edit_profile")}
                      </button>
                      <button
                        onClick={() => setShowAchievementModal(true)}
                        style={{
                          ...styles.editButton,
                          background: "#8B5CF6",
                        }}
                      >
                        <FaTrophy /> {t('add_achievement')}
                      </button>
                    </div>
                  )}
                </div>

                {/* Demais informações abaixo */}
                <p style={styles.email}>{user.email || "Email indisponível"}</p>
                {user.userType && (
                  <p style={styles.infoText}>
                    <strong>{t('type_label')}</strong> {translateUserType(user.userType)}
                  </p>
                )}
                {user.institution && (
                  <p style={styles.infoText}>
                    <strong>{t('institution_label')}</strong> {translateInstitution(user.institution)}
                  </p>
                )}
                {user.birthDate && (
                  <p style={styles.infoText}>
                    <strong>{t('date_of_birth')}</strong>{" "}
                    {new Date(user.birthDate).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-PT')}
                  </p>
                )}
                <p style={styles.bio}>{user.bio || t('no_bio')}</p>

                <div style={styles.stats}>
                  <div style={styles.statsItem}>
                    <strong style={styles.statsStrong}>{user.xp || 0}</strong>
                    <span style={styles.statsSpan}>{t("xp")}</span>
                  </div>
                  <div 
                    style={{ ...styles.statsItem, cursor: 'pointer' }}
                    onClick={() => setShowFollowersModal(true)}
                  >
                    <strong style={styles.statsStrong}>{user.followers?.length || 0}</strong>
                    <span style={styles.statsSpan}>{t("followers_label")}</span>
                  </div>
                  <div 
                    style={{ ...styles.statsItem, cursor: 'pointer' }}
                    onClick={() => setShowFollowingModal(true)}
                  >
                    <strong style={styles.statsStrong}>{user.following?.length || 0}</strong>
                    <span style={styles.statsSpan}>{t("following_label")}</span>
                  </div>
                </div>

                {currentUser && currentUser._id !== user._id && (
                  <div style={{ marginTop: "1rem", display: 'flex', gap: '0.75rem' }}>
                    <FollowButton
                      userId={user._id}
                      currentUser={currentUser}
                      onFollow={handleFollow}
                    />
                    <button
                      onClick={() => router.push(`/chat?userId=${user._id}`)}
                      style={{ padding: '0.5rem 1rem', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <FaPaperPlane />
                      {t('send_message')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Conquistas abaixo do bloco principal */}
            {Array.isArray(user.achievements) && user.achievements.length > 0 && (
              <div style={{ ...styles.achievementsSection, marginTop: '2rem' }}>
                <h2 style={styles.achievementsTitle}>Conquistas</h2>
                <div>
                  {user.achievements
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((ach) => (
                      <AchievementCard
                        key={ach._id || ach.title + ach.date}
                        achievement={ach}
                        theme={theme}
                      />
                    ))}
                </div>
              </div>
            )}

            {currentUser &&
              currentUser._id === user._id &&
              (!user.achievements || user.achievements.length === 0) && (
                <div style={{ ...styles.noAchievements, marginTop: '2rem' }}>
                  <p>
                    Você ainda não adicionou nenhuma conquista.
                    <button
                      onClick={() => setShowAchievementModal(true)}
                      style={styles.addAchievementLink}
                    >
                      Adicione agora
                    </button>
                  </p>
                </div>
              )}
          </div>
        )}
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={handleEditProfile}
        theme={theme}
      />
      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        message={alert.message}
        title={alert.title}
        theme={theme}
      />
      <AddAchievementModal
        isOpen={showAchievementModal}
        onClose={() => setShowAchievementModal(false)}
        onSave={handleAddAchievement}
        theme={theme}
      />

      <UsersListModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title={t('followers_label') || 'Seguidores'}
        fetchUsers={fetchFollowers}
        theme={theme}
      />

      <UsersListModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title={t('following_label') || 'Seguindo'}
        fetchUsers={fetchFollowing}
        theme={theme}
      />

      <Footer />
    </div>
  );
}