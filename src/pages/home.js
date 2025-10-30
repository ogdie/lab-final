import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeLanguage } from '../context/ThemeLanguageContext'; 

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import ChatModal from '../components/ChatModal';
import AlertModal from '../components/AlertModal';
import { postsAPI, usersAPI } from '../services/api';

const getStyles = (theme) => {
    const isDark = theme === 'dark';
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    const textSecondary = isDark ? '#b0b3b8' : '#606770';
    const backgroundPrimary = isDark ? '#1d2226' : '#f3f2ef'; // Fundo do LinkedIn
    const backgroundCard = isDark ? '#2c2f33' : '#ffffff';
    const borderSubtle = isDark ? '#3e4042' : '#d1d1d1';
    const blueAction = '#4F46E5';
    const blueActionLight = isDark ? '#4F46E5' : '#e7f3ff';
    const colorError = isDark ? '#ff7979' : '#d32f2f';
    const linkedInShadow = "0 0 0 1px rgb(0 0 0 / 15%), 0 2px 3px rgb(0 0 0 / 20%)"; // Sombra discreta do LinkedIn

    return {
        container: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: backgroundPrimary, 
        },
        mainLayout: {
            display: 'flex',
            maxWidth: '1200px',
            margin: '0 auto',
            flex: 1,
            width: '100%',
            padding: '16px 24px',
            gap: '24px',
            alignItems: 'flex-start',
        },
        sidebar: {
            position: 'sticky',
            top: '72px',
            width: '260px', 
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px', 
            height: 'calc(100vh - 72px - 32px)',
            overflowY: 'auto',
            zIndex: 10,
        },
        sidebarHeader: {
            height: '54px',
            background: blueAction,
            marginBottom: '-32px',
            borderRadius: '12px 12px 0 0',
        },
        profileCard: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: backgroundCard,
            borderRadius: '12px',
            boxShadow: linkedInShadow,
            border: `1px solid ${borderSubtle}`,
            overflow: 'hidden',
        },
        profileCardContent: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 16px 16px 16px',
            width: '100%',
            cursor: 'pointer',
        },
        sidebarAvatar: {
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: `2px solid ${backgroundCard}`,
        },
        sidebarName: {
            fontSize: '1rem',
            fontWeight: '600',
            color: textPrimary,
            margin: '8px 0 4px 0',
        },
        sidebarEmail: {
            fontSize: '0.875rem',
            color: textSecondary,
            margin: 0,
            textAlign: 'center',
        },
        statsSection: {
            padding: '12px 16px',
            borderTop: `1px solid ${borderSubtle}`,
            width: '100%',
        },
        statItem: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.9rem',
            color: textSecondary,
            width: '100%',
            padding: '4px 0',
        },
        statValue: {
            color: blueAction, 
            fontWeight: 'bold',
        },
        createPostButton: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
            padding: '12px 16px',
            background: backgroundCard,
            border: `1px solid ${borderSubtle}`,
            borderRadius: '8px', 
            fontSize: '1rem',
            fontWeight: '600',
            color: textPrimary,
            cursor: 'pointer',
            transition: 'background 0.2s',
            boxShadow: linkedInShadow,
        },
        mainArea: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px', 
            padding: '0 16px',
            maxWidth: '560px', 
            margin: '0', 
        },
        postWrapper: {
            width: '100%',
        },
        emptyFeedCard: {
            width: '100%',
            background: backgroundCard,
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: linkedInShadow,
            border: `1px solid ${borderSubtle}`,
        },
        emptyFeedText: {
            fontSize: '1.1rem',
            color: textPrimary,
            margin: 0,
            marginBottom: '0.5rem',
        },
        emptyFeedHint: {
            fontSize: '0.95rem',
            color: textSecondary,
            margin: 0,
        },
        loading: {
            textAlign: 'center',
            padding: '2rem',
            fontSize: '1.1rem',
            color: textPrimary,
        },
        error: {
            textAlign: 'center',
            padding: '2rem',
            fontSize: '1.1rem',
            color: colorError,
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
        userResult: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            borderBottom: `1px solid ${borderSubtle}`,
            color: textPrimary,
        },
        resultInfo: {
            flex: 1,
        },
        resultAvatar: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
        },
        viewProfileButton: {
            padding: '0.5rem 1rem',
            background: blueAction,
            color: 'white',
            border: 'none',
            borderRadius: '24px', 
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
        },
        closeButton: {
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: textSecondary,
        },
    };
};

export default function Home() {
    const router = useRouter();
    const { theme, t } = useThemeLanguage(); 
    const styles = getStyles(theme);

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({ 
        isOpen: false, 
        message: '', 
        title: 'Aviso',
        onConfirm: null,
        showCancel: false
    });

    const loadPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await postsAPI.getAll();
            setPosts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error loading posts:', err);
            setError('Não foi possível carregar os posts.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (data) => {
        if (!user?._id) return;
        try {
            await postsAPI.create({ ...data, author: user._id });
            loadPosts();
        } catch (err) {
            showAlert({ 
                message: 'Erro ao criar post: ' + (err.message || 'Erro desconhecido'), 
                title: 'Erro' 
            });
        }
    };

    const handleLike = async (postId, userId) => {
        if (!postId || !userId) return;
        try {
            await postsAPI.like(postId, userId);
            loadPosts();
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleComment = async (postId, content) => {
        if (!postId || !content?.trim() || !user?._id) return;
        try {
            await postsAPI.addComment(postId, { author: user._id, content });
            loadPosts();
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleEditPost = async (postId, updatedData) => {
        if (!postId || !user?._id) return;
        try {
            await postsAPI.update(postId, updatedData);
            loadPosts();
        } catch (err) {
            showAlert({ 
                message: 'Erro ao atualizar post: ' + (err.message || 'Erro desconhecido'), 
                title: 'Erro' 
            });
        }
    };

    const handleDeletePost = (postId) => {
        const confirmDelete = async () => {
            try {
                await postsAPI.delete(postId);
                loadPosts();
                showAlert({ 
                    message: 'Post excluído com sucesso.', 
                    title: 'Sucesso!' 
                });
            } catch (err) {
                showAlert({ 
                    message: 'Erro ao excluir post: ' + (err.message || 'Erro desconhecido'), 
                    title: 'Erro' 
                });
            }
        };

        showAlert({
            title: 'Excluir post?',
            message: 'Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.',
            showCancel: true,
            onConfirm: confirmDelete
        });
    };

    const handleSearch = async (query) => {
        if (!query?.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        try {
            const users = await usersAPI.searchUsers(query);
            setSearchResults(Array.isArray(users) ? users : []);
            setShowSearchResults(true);
        } catch (err) {
            console.error('Error searching users:', err);
            setSearchResults([]);
        }
    };

    const handleCloseSearch = () => {
        setShowSearchResults(false);
        setSearchResults([]);
    };

    const showAlert = ({ message, title = 'Aviso', onConfirm = null, showCancel = false }) => {
        setAlert({ isOpen: true, message, title, onConfirm, showCancel });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isOpen: false }));
    };
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        let parsedUser = null;
        try { parsedUser = userData ? JSON.parse(userData) : null; } catch (e) { console.error('Invalid user data:', e); }

        if (!token || !parsedUser?._id) { router.push('/'); return; }

        setUser(parsedUser);
        loadPosts();
    }, [router]);

    useEffect(() => {
        const handleStorageChange = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                } catch (e) {
                    console.error('Invalid user data:', e);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(() => {
            handleStorageChange();
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    if (loading) {
        return (
            <div style={styles.container}>
                <Navbar user={user} onSearch={handleSearch} />
                <div style={styles.mainArea}>
                    <p style={styles.loading}>{t('loading')}</p>
                </div>
                <Footer theme={theme} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <Navbar user={user} onSearch={handleSearch} />
                <div style={styles.mainArea}>
                    <p style={styles.error}>{t('error_loading_posts')}</p>
                </div>
                <Footer theme={theme} />
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Navbar
                user={user}
                onSearch={handleSearch}
            />

            {showSearchResults && (
                <div style={styles.searchResults}>
                    <div style={styles.searchHeader}>
                        <h3 style={{color: styles.textPrimary}}>{t('search_results')}</h3>
                        <button onClick={handleCloseSearch} style={styles.closeButton}>
                            ✖
                        </button>
                    </div>
                    {searchResults.length === 0 ? (
                        <p style={{padding: '1rem', color: styles.textSecondary}}>{t('no_users_found')}</p>
                    ) : (
                        searchResults.map((userResult) => (
                            <div key={userResult._id} style={styles.userResult}>
                                <img
                                    src={userResult.profilePicture || '/default-avatar.svg'}
                                    alt={userResult.name || 'Usuário'}
                                    style={styles.resultAvatar}
                                />
                                <div style={styles.resultInfo}>
                                    <h4 style={{color: styles.textPrimary, margin: 0}}>{userResult.name || 'Nome indisponível'}</h4>
                                    <p style={{color: styles.textSecondary, margin: '2px 0 0 0', fontSize: '0.85rem'}}>{userResult.email || 'Email indisponível'}</p>
                                </div>
                                <button
                                    onClick={() => router.push(`/profile?id=${userResult._id}`)}
                                    style={styles.viewProfileButton}
                                >
                                    {t('view_profile')}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
            {showChatModal && (
                <ChatModal
                    isOpen={showChatModal}
                    onClose={() => setShowChatModal(false)}
                    currentUser={user}
                    otherUser={selectedUser}
                    theme={theme}
                />
            )}
            <PostModal
                isOpen={showPostModal}
                onClose={() => setShowPostModal(false)}
                onSubmit={handleCreatePost}
                theme={theme}
            />

            <div style={styles.mainLayout}>
                <aside style={styles.sidebar}>
                    <div style={styles.profileCard} onClick={() => router.push(`/profile?id=${user?._id}`)}>
                        <div style={styles.sidebarHeader} />
                        <div style={styles.profileCardContent}>
                            <img
                                src={user?.profilePicture || '/default-avatar.svg'}
                                alt={user?.name || 'Você'}
                                style={styles.sidebarAvatar}
                            />
                            <div style={styles.sidebarName}>{user?.name || 'Usuário'}</div>
                            <div style={styles.sidebarEmail}>{user?.title || user?.email || 'Bem-vindo(a)'}</div>
                        </div>
                        <div style={styles.statsSection}>
                            <div style={styles.statItem}>
                                <span>👥 {t('connections')}</span>
                                <strong style={styles.statValue}>{user?.followers?.length || 0}</strong>
                            </div>
                            <div style={styles.statItem}>
                                <span>⭐ XP</span>
                                <strong style={styles.statValue}>{user?.xp || 0}</strong>
                            </div>
                        </div>
                    </div>

                    <div 
                        onClick={() => setShowPostModal(true)} 
                        style={styles.createPostButton}
                    >
                        <span style={{...styles.sidebarAvatar, width: '32px', height: '32px'}}>+</span>
                        <span>{t('start_post')}</span>
                    </div>

                    {/* Você pode adicionar mais cards laterais aqui, como "Grupos" ou "Sugestões" */}

                </aside>

                <main style={styles.mainArea}>
                    {posts.length === 0 ? (
                        <div style={styles.emptyFeedCard}>
                            <p style={styles.emptyFeedText}>{t('empty_feed')}</p>
                            <p style={styles.emptyFeedHint}>{t('empty_feed_hint')}</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id || Math.random()} style={styles.postWrapper}>
                                <PostCard
                                    post={post}
                                    currentUser={user}
                                    onLike={handleLike}
                                    onComment={handleComment}
                                    onEdit={handleEditPost}
                                    onDelete={handleDeletePost}
                                    theme={theme}
                                />
                            </div>
                        ))
                    )}
                </main>
            </div>

            <AlertModal
                isOpen={alert.isOpen}
                onClose={closeAlert}
                message={alert.message}
                title={alert.title}
                onConfirm={alert.onConfirm}
                showCancel={alert.showCancel}
                theme={theme}
            />

            <Footer theme={theme} />
        </div>
    );
}