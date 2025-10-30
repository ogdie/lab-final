import { useState } from 'react';
import CommentCard from './CommentCard';
import ShareButton from './ShareButton';
import EditPostModal from './EditPostModal';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

// Formata a diferença de tempo de forma resumida (estilo LinkedIn)
function formatRelativeTime(dateInput) {
    const now = new Date();
    const date = new Date(dateInput);
    const diffMs = Math.max(0, now - date);
    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) {
        const v = seconds;
        return `${v}s`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        const v = minutes;
        return `${v}m`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        const v = hours;
        return `${v}h`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
        const v = days;
        return `${v}d`;
    }
    const weeks = Math.floor(days / 30) * 4;
    if (weeks < 4) {
        const v = Math.max(1, weeks);
        return `${v} sem`;
    }
    return date.toLocaleDateString('pt-BR');
}

// Ícones simples para ações (simulando Font Awesome/Lucide)
const ICONS = {
    Like: '👍',
    Comment: '💬',
    Share: '🔁',
    Dots: '···',
};

// CORREÇÃO: getStyles agora recebe o objeto 'post' como argumento
const getStyles = (theme, post = {}) => {
    const isDark = theme === 'dark';
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    const textSecondary = isDark ? '#b0b3b8' : '#606770';
    const backgroundCard = isDark ? '#2c2f33' : '#ffffff';
    const borderSubtle = isDark ? '#3e4042' : '#d1d1d1';
    const blueAction = '#0a66c2'; 
    const redLike = '#378fe9';
    const linkedInShadow = "0 0 0 1px rgb(0 0 0 / 15%), 0 2px 3px rgb(0 0 0 / 5%)";

    return {
        card: {
            background: backgroundCard,
            border: `1px solid ${borderSubtle}`,
            borderRadius: '12px',
            padding: '16px 0 0 0',
            marginBottom: '8px', 
            boxShadow: linkedInShadow,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
        },
        header: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '16px',
            padding: '0 16px',
        },
        avatar: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            cursor: 'pointer',
        },
        authorInfo: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        name: {
            fontWeight: '600',
            fontSize: '0.95rem',
            color: textPrimary, 
            lineHeight: 1.2,
            cursor: 'pointer',
        },
        title: {
            fontSize: '0.8rem',
            color: textSecondary,
            lineHeight: 1.2,
        },
        date: {
            fontSize: '0.75rem',
            color: textSecondary, 
        },
        dotsButton: {
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: textSecondary, 
            padding: '4px 8px',
            borderRadius: '50%',
            transition: 'background-color 0.2s',
            '&:hover': {
                backgroundColor: isDark ? '#3a3b3c' : '#f0f0f0',
            }
        },
        content: {
            fontSize: '0.95rem',
            lineHeight: '1.4',
            // CORREÇÃO: Acesso a post.image agora é seguro
            marginBottom: post.image ? '0' : '16px', 
            whiteSpace: 'pre-wrap',
            color: textPrimary, 
            padding: '0 16px',
        },
        toggleButton: {
            background: 'none',
            border: 'none',
            color: blueAction, 
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            marginLeft: '4px',
            padding: 0,
        },
        image: {
            width: '100%',
            maxHeight: '60vh',
            objectFit: 'cover',
            marginTop: '12px',
            marginBottom: '8px',
        },
        statsBar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 16px 8px 16px',
            fontSize: '0.8rem',
            color: textSecondary,
        },
        actions: {
            display: 'flex',
            justifyContent: 'space-around',
            padding: '4px 0',
            borderTop: `1px solid ${borderSubtle}`, 
            borderBottom: `1px solid ${borderSubtle}`, 
        },
        actionButton: {
            background: 'none',
            border: 'none',
            flex: 1,
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: textSecondary, 
            padding: '8px 0',
            fontWeight: '600',
            borderRadius: '4px',
            transition: 'background-color 0.1s',
            '&:hover': {
                backgroundColor: isDark ? '#3a3b3c' : '#f0f0f0',
            }
        },
        actionButtonLiked: {
            color: redLike,
        },
        commentsSection: {
            padding: '0 16px 16px 16px',
        },
        commentForm: {
            display: 'flex',
            gap: '8px',
            marginTop: '16px',
            alignItems: 'flex-start',
        },
        commentAvatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
        },
        commentInput: {
            flex: 1,
            padding: '8px 12px',
            border: `1px solid ${borderSubtle}`, 
            borderRadius: '20px',
            background: isDark ? '#3a3b3c' : '#f0f2f5', 
            color: textPrimary,
            fontSize: '0.9rem',
            resize: 'none',
            minHeight: '40px',
        },
        commentButton: {
            padding: '0.5rem 1rem',
            background: blueAction,
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            alignSelf: 'flex-end',
        },
    };
};


export default function PostCard({ post, currentUser, onLike, onComment, onEdit, onDelete, theme }) {
    // CORREÇÃO: Passando o objeto 'post' para o getStyles
    const styles = getStyles(theme || 'light', post); 
    const { t } = useThemeLanguage();
    
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);
    const MAX_PREVIEW_LENGTH = 300;

    const handleLike = () => {
        if (currentUser) {
            onLike(post._id, currentUser._id);
        }
    };
    
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post._id, commentText);
            setCommentText('');
            setShowComments(true);
        }
    };

    const isLiked = currentUser && post.likes?.includes(currentUser._id);
    const isOwnPost = currentUser && (currentUser._id === (post.author?._id || post.author));

    const displayContent = post.content || '';
    const shouldTruncate = displayContent.length > MAX_PREVIEW_LENGTH;
    const visibleContent = showFullContent
        ? displayContent
        : displayContent.substring(0, MAX_PREVIEW_LENGTH);

    const toggleContent = () => {
        setShowFullContent(!showFullContent);
    };

    const handleEdit = (updatedData) => {
        if (onEdit && typeof onEdit === 'function') {
            onEdit(post._id, updatedData);
        }
        setShowEditModal(false);
    };

    return (
        <div style={styles.card}>
            {showEditModal && (
                <EditPostModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    post={post}
                    onSave={handleEdit}
                    onDelete={onDelete}
                    theme={theme} 
                />
            )}

            <div style={styles.header}>
                <img
                    src={post.author?.profilePicture || '/default-avatar.svg'}
                    alt={post.author?.name || 'Autor'}
                    style={styles.avatar}
                />
                <div style={styles.authorInfo}>
                    <div style={styles.name}>{post.author?.name || t('user')}</div>
                    <div style={styles.title}>{post.author?.title || t('network_user')}</div> 
                    <div style={styles.date}>
                        {formatRelativeTime(post.createdAt)}
                    </div>
                </div>
                {isOwnPost && (
                    <button
                        onClick={() => setShowEditModal(true)}
                        style={styles.dotsButton}
                        aria-label="Opções do post"
                    >
                        {ICONS.Dots}
                    </button>
                )}
            </div>

            <div style={styles.content}>
                {visibleContent}
                {shouldTruncate && !showFullContent && '... '}
                {shouldTruncate && (
                    <button onClick={toggleContent} style={styles.toggleButton}>
                        {showFullContent ? t('see_less') : t('see_more')}
                    </button>
                )}
            </div>

            {post.image && (
                <img src={post.image} alt={t('content_alt')} style={styles.image} />
            )}

            <div style={styles.statsBar}>
                <span>{post.likes?.length || 0} {ICONS.Like}</span>
                <span>{post.comments?.length || 0} {t('comments')}</span>
            </div>

            <div style={styles.actions}>
                <button
                    onClick={handleLike}
                    style={{ 
                        ...styles.actionButton, 
                        ...(isLiked && styles.actionButtonLiked)
                    }}
                >
                    {ICONS.Like} {t('like')}
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    style={styles.actionButton}
                >
                    {ICONS.Comment} {t('comment')}
                </button>
                <div style={{flex: 1}}> 
                    <ShareButton post={post} style={styles.actionButton} icon={ICONS.Share} />
                </div>
            </div>

            {showComments && (
                <div style={styles.commentsSection}>
                    {currentUser && onComment && (
                        <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
                            <img
                                src={currentUser.profilePicture || '/default-avatar.svg'}
                                alt={currentUser.name || 'Você'}
                                style={styles.commentAvatar}
                            />
                            <textarea
                                name="comment"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder={t('add_a_comment')}
                                style={styles.commentInput}
                                rows={1}
                            />
                            {commentText.trim().length > 0 && (
                                <button type="submit" style={styles.commentButton}>
                                    {t('send')}
                                </button>
                            )}
                        </form>
                    )}
                    
                    {post.comments?.map((comment) => (
                        <CommentCard
                            key={comment._id}
                            comment={comment}
                            currentUser={currentUser}
                            theme={theme} 
                        />
                    ))}
                    
                </div>
            )}
        </div>
    );
}