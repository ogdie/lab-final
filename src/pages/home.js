import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeLanguage } from '../context/ThemeLanguageContext'; 

import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import PostCard from '../components/PostCard';
import PostModal from '../components/ui/PostModal';
import AlertModal from '../components/ui/AlertModal';
import ArticlesSidebar from '../components/ui/ArticlesSidebar';
import { postsAPI, usersAPI, commentsAPI } from '../services/api';
import { FaTimes, FaUsers, FaUserPlus, FaStar } from 'react-icons/fa';
import { IoGameController } from 'react-icons/io5';

const getStyles = (theme) => {
    const isDark = theme === 'dark';
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    const textSecondary = isDark ? '#b0b3b8' : '#606770';
    const backgroundPrimary = isDark ? '#1d2226' : '#f3f2ef'; // Fundo do LinkedIn
    const backgroundCard = isDark ? '#2c2f33' : '#ffffff';
    const borderSubtle = isDark ? '#3e4042' : '#d1d1d1';
    const blueAction = '#8B5CF6';
    const blueActionLight = isDark ? '#8B5CF6' : '#e7f3ff';
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
            width: '240px',
            flexShrink: 0,
            background: backgroundCard,
            borderRadius: '12px',
            boxShadow: linkedInShadow,
            border: `1px solid ${blueAction}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            zIndex: 10,
        },
        sidebarHeader: {
            height: '54px',
            background: blueAction,
            marginBottom: '-32px',
        },
        userCard: {
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
        },
        avatar: {
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: `2px solid ${backgroundCard}`,
        },
        cardTitle: {
            fontSize: '1.2rem',
            fontWeight: '600',
            color: textPrimary,
            margin: '4px 0 0 0',
        },
        cardSubtitle: {
            fontSize: '0.9rem',
            color: textSecondary,
            margin: '0 0 16px 0',
        },
        statsSection: {
            padding: '12px 16px',
            borderTop: `1px solid ${borderSubtle}`,
            width: '100%',
        },
        statItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem',
            color: textSecondary,
            width: '100%',
            padding: '4px 0',
            cursor: 'pointer',
        },
        statValue: {
            color: blueAction,
            fontWeight: 'bold',
        },
        userCardButtons: {
            padding: '12px 16px',
            borderTop: `1px solid ${borderSubtle}`,
            width: '100%',
        },
        forumButton: {
            width: '100%',
            padding: '8px 16px',
            background: backgroundCard,
            border: `1px solid ${blueAction}`,
            borderRadius: '24px',
            fontSize: '1rem',
            fontWeight: '600',
            color: blueAction,
            cursor: 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
            marginBottom: '8px',
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
            border: `1px solid ${blueAction}`,
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
    const { theme, t, language } = useThemeLanguage(); 
    const styles = getStyles(theme);
    const isDark = theme === 'dark';
    const backgroundCard = isDark ? '#2c2f33' : '#ffffff';
    const blueAction = '#8B5CF6';

    const translateUserType = (userType) => {
        if (!userType) return null;
        const typeMap = {
            'Estudante': 'user_type_student',
            'Professor': 'user_type_professor',
            'Recrutador': 'user_type_recruiter'
        };
        return t(typeMap[userType]) || userType;
    };

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchPaused, setSearchPaused] = useState(false);
    const [lastSearchQuery, setLastSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({ 
        isOpen: false, 
        message: '', 
        title: 'Aviso',
        onConfirm: null,
        showCancel: false
    });
    
    const postsRef = useRef([]);

    const loadPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await postsAPI.getAll();
            const list = Array.isArray(data) ? data : [];
            const followingIds = user?.following?.map(id => String(id)) || [];
            const currentUserId = user?._id ? String(user._id) : null;
            
            const filteredList = list.filter(post => {
                const authorId = post.author?._id || post.author;
                const authorIdStr = authorId ? String(authorId) : null;
                
                return authorIdStr && (
                    authorIdStr === currentUserId || 
                    followingIds.includes(authorIdStr)
                );
            });
            
            filteredList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(filteredList);
            postsRef.current = filteredList; // Atualizar ref também
        } catch (err) {
            console.error('Error loading posts:', err);
            setError('Não foi possível carregar os posts.');
        } finally {
            setLoading(false);
        }
    }, [user?._id, user?.following]);

    const handleCreatePost = async (data) => {
        if (!user?._id) return;
        try {
            const created = await postsAPI.create({ ...data, author: user._id });
            const newPost = { ...(created || {}), author: created?.author || user };
            setPosts(prev => {
                const updated = [newPost, ...prev];
                postsRef.current = updated; // Atualizar ref também
                return updated;
            });
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
            const updatedPost = await postsAPI.like(postId, userId);
            const normalizedLikes = (updatedPost.likes || []).map(id => String(id));
            setPosts(prevPosts => 
                prevPosts.map(p => {
                    const currentPostId = p._id ? String(p._id) : null;
                    const targetPostId = postId ? String(postId) : null;
                    
                    if (currentPostId === targetPostId) {
                        const updatedPost = { 
                            ...p, 
                            likes: [...normalizedLikes]
                        };
                        postsRef.current = postsRef.current.map(p => 
                            String(p._id) === targetPostId ? updatedPost : p
                        );
                        return updatedPost;
                    }
                    return p;
                })
            );
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleComment = async (postId, content, parentComment = null) => {
        if (!postId || !content?.trim() || !user?._id) return;
        
        try {
            const newComment = await postsAPI.addComment(postId, { author: user._id, content, parentComment });
            setPosts(prevPosts => 
                prevPosts.map(post => {
                    const currentPostId = post._id ? String(post._id) : null;
                    const targetPostId = postId ? String(postId) : null;
                    
                    if (currentPostId === targetPostId) {
                        const commentWithDefaults = {
                            ...newComment,
                            author: newComment.author || user,
                            likes: newComment.likes || [],
                            createdAt: newComment.createdAt || new Date().toISOString()
                        };
                        const existingComments = post.comments || [];
                        const updatedComments = [...existingComments, commentWithDefaults];
                        const updatedPost = { 
                            ...post, 
                            comments: updatedComments // Sempre nova referência de array
                        };
                        postsRef.current = postsRef.current.map(p => 
                            String(p._id) === targetPostId ? updatedPost : p
                        );
                        return updatedPost;
                    }
                    return post;
                })
            );
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleLikeComment = async (commentId) => {
        if (!commentId || !user?._id) return;
        try {
            const updatedComment = await commentsAPI.like(commentId, user._id);
            const normalizedLikes = (updatedComment.likes || []).map(id => String(id));
            const commentIdStr = String(commentId);
            
            setPosts(prevPosts => 
                prevPosts.map(post => {
                    const hasMatchingComment = (post.comments || []).some(
                        c => String(c._id) === commentIdStr
                    );
                    
                    if (hasMatchingComment) {
                        return {
                            ...post,
                            comments: (post.comments || []).map(comment => {
                                const currentCommentId = comment._id ? String(comment._id) : null;
                                if (currentCommentId === commentIdStr) {
                                    return { ...comment, likes: [...normalizedLikes] }; // Nova referência
                                }
                                return comment;
                            })
                        };
                    }
                    return post;
                })
            );
        } catch (err) {
            console.error('Error liking comment:', err);
        }
    };

    const handleEditComment = async (commentId, updated) => {
        try {
            await commentsAPI.update(commentId, updated);
            loadPosts();
        } catch (err) {
            console.error('Error editing comment:', err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentsAPI.delete(commentId);
            loadPosts();
        } catch (err) {
            console.error('Error deleting comment:', err);
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
            setSearchPaused(false);
            setLastSearchQuery('');
            return;
        }

        if (searchPaused && query === lastSearchQuery) {
            return;
        }

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

    const showAlert = ({ message, title = 'Aviso', onConfirm = null, showCancel = false }) => {
        setAlert({ isOpen: true, message, title, onConfirm, showCancel });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isOpen: false }));
    };
    
    const loadCurrentUser = useCallback(async (userId) => {
        try {
            const freshUser = await usersAPI.getById(userId);
            if (freshUser?._id) {
                setUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));
            }
        } catch (err) {
            console.error('Error loading current user:', err);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        let parsedUser = null;
        try { parsedUser = userData ? JSON.parse(userData) : null; } catch (e) { console.error('Invalid user data:', e); }

        if (!token || !parsedUser?._id) { router.push('/'); return; }

        setUser(parsedUser);
        loadCurrentUser(parsedUser._id);
    }, [router, loadCurrentUser]);

    useEffect(() => {
        if (user?._id) {
            loadPosts();
        }
    }, [user?._id, JSON.stringify(user?.following?.sort() || [])]);

    useEffect(() => {
        postsRef.current = posts;
    }, [posts]);

    useEffect(() => {
        if (!user?._id) return;

        const updatePostsFromServer = async () => {
            const currentPosts = postsRef.current;
            if (currentPosts.length === 0) return;

            try {
                const updatePromises = currentPosts.map(async (currentPost) => {
                    try {
                        const updatedPost = await postsAPI.getById(currentPost._id);
                        if (!updatedPost) return currentPost;

                        const currentLikesCount = (currentPost.likes || []).length;
                        const updatedLikesCount = (updatedPost.likes || []).length;
                        const currentCommentsCount = (currentPost.comments || []).length;
                        const updatedCommentsCount = (updatedPost.comments || []).length;

                        if (
                            currentLikesCount !== updatedLikesCount ||
                            currentCommentsCount !== updatedCommentsCount
                        ) {
                            const normalizedLikes = (updatedPost.likes || []).map(id => String(id));
                            
                            const author = updatedPost.author || currentPost.author;
                            
                            return {
                                ...currentPost,
                                author: author,
                                likes: [...normalizedLikes],
                                comments: updatedPost.comments || currentPost.comments || []
                            };
                        }
                        
                        return currentPost;
                    } catch (err) {
                        console.error(`Error updating post ${currentPost._id}:`, err);
                        return currentPost;
                    }
                });

                const updatedPostsMap = new Map(
                    (await Promise.all(updatePromises)).map(p => [String(p._id), p])
                );
                
                let hasChanges = false;
                const finalPosts = currentPosts.map(currentPost => {
                    const postIdStr = String(currentPost._id);
                    const updatedPost = updatedPostsMap.get(postIdStr);
                    
                    if (!updatedPost) return currentPost;
                    
                    const currentLikes = (currentPost.likes || []).map(id => String(id)).sort().join(',');
                    const updatedLikes = (updatedPost.likes || []).map(id => String(id)).sort().join(',');
                    const currentCommentsCount = (currentPost.comments || []).length;
                    const updatedCommentsCount = (updatedPost.comments || []).length;
                    
                    if (currentLikes !== updatedLikes || currentCommentsCount !== updatedCommentsCount) {
                        hasChanges = true;
                        return updatedPost;
                    }
                    
                    return currentPost;
                });

                if (hasChanges) {
                    setPosts(finalPosts);
                    postsRef.current = finalPosts;
                }
            } catch (err) {
                console.error('Error updating posts from server:', err);
            }
        };

        const interval = setInterval(updatePostsFromServer, 5000);

        return () => clearInterval(interval);
    }, [user?._id]);

    useEffect(() => {
        if (!user?._id) return;

        const handleStorageChange = async () => {
            const userData = localStorage.getItem('user');
            if (userData && user?._id) {
                try {
                    const parsedUser = JSON.parse(userData);
                    const freshUser = await usersAPI.getById(user._id);
                    if (freshUser?._id) {
                        setUser(prevUser => {
                            const prevFollowing = prevUser?.following?.map(id => String(id)) || [];
                            const newFollowing = freshUser?.following?.map(id => String(id)) || [];
                            const followingChanged = JSON.stringify(prevFollowing.sort()) !== JSON.stringify(newFollowing.sort());
                            
                            if (followingChanged) {
                                setTimeout(() => loadPosts(), 100);
                            }
                            
                            return freshUser;
                        });
                    }
                } catch (e) {
                    console.error('Invalid user data:', e);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(() => {
            handleStorageChange();
        }, 3000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [user?._id, loadPosts]);

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
                <>
                    {/* Overlay para fechar ao clicar fora */}
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
                        style={{...styles.searchResults, zIndex: 1001}}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={styles.searchHeader}>
                            <h3 style={{color: styles.textPrimary}}>{t('search_results')}</h3>
                            <button onClick={handleCloseSearch} style={styles.closeButton}>
                                <FaTimes />
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
                                        <p style={{color: styles.textSecondary, margin: '2px 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px'}}>
                                            <FaStar style={{ color: isDark ? '#b0b3b8' : '#606770' }} /> <span>{userResult.xp || 0} XP</span>
                                        </p>
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
                </>
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
                                {translateUserType(user.userType) || user.title || t('user')}
                            </p>
                        </div>
                        <div style={styles.statsSection}>
                            <div style={styles.statItem}>
                                <span><FaUsers /> {t('followers_label')}</span>
                                <strong style={styles.statValue}>{user?.followers?.length || 0}</strong>
                            </div>
                            <div style={styles.statItem}>
                                <span><FaUserPlus /> {t('following_label')}</span>
                                <strong style={styles.statValue}>{user?.following?.length || 0}</strong>
                            </div>
                        </div>
                        <div style={styles.userCardButtons}>
                            <button
                                style={styles.forumButton}
                                onClick={() => setShowPostModal(true)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = isDark ? '#3a3b3c' : '#f8f9ff';
                                    e.currentTarget.style.borderColor = '#9d68f7';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = backgroundCard;
                                    e.currentTarget.style.borderColor = blueAction;
                                }}
                            >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span>
                                    <span>{t('start_post')}</span>
                                </span>
                            </button>
                        </div>
                    </aside>
                )}

                <main style={styles.mainArea}>
                    {posts.length === 0 ? (
                        <div style={styles.emptyFeedCard}>
                            <p style={styles.emptyFeedText}>{t('empty_feed')}</p>
                            <p style={styles.emptyFeedHint}>{t('empty_feed_hint')}</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div 
                                key={post._id || Math.random()} 
                                style={styles.postWrapper}
                            >
                                <PostCard
                                    post={post}
                                    currentUser={user}
                                    onLike={handleLike}
                                    onComment={handleComment}
                                    onEdit={handleEditPost}
                                    onDelete={handleDeletePost}
                                    onEditComment={handleEditComment}
                                    onDeleteComment={handleDeleteComment}
                                    onLikeComment={handleLikeComment}
                                    onReplyComment={(commentId, content) => handleComment(post._id, content, commentId)}
                                    theme={theme}
                                />
                            </div>
                        ))
                    )}
                </main>

                <ArticlesSidebar theme={theme} />
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