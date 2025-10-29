import { useState } from 'react';

// Formata a diferença de tempo de forma resumida (estilo LinkedIn)
function formatRelativeTime(dateInput) {
    const now = new Date();
    const date = new Date(dateInput);
    const diffMs = Math.max(0, now - date);
    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) {
        const v = seconds;
        return `${v} ${v === 1 ? 'segundo' : 'segundos'}`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        const v = minutes;
        return `${v} ${v === 1 ? 'minuto' : 'minutos'}`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        const v = hours;
        return `${v} ${v === 1 ? 'hora' : 'horas'}`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
        const v = days;
        return `${v} ${v === 1 ? 'dia' : 'dias'}`;
    }
    const weeks = Math.floor(days / 7);
    if (days < 30) { // até ~4 semanas
        const v = Math.max(1, weeks);
        return `${v} ${v === 1 ? 'semana' : 'semanas'}`;
    }
    const months = Math.floor(days / 30);
    if (months < 12) {
        const v = Math.max(1, months);
        return `${v} ${v === 1 ? 'mês' : 'meses'}`;
    }
    const years = Math.floor(days / 365);
    const v = Math.max(1, years);
    return `${v} ${v === 1 ? 'ano' : 'anos'}`;
}
import CommentCard from './CommentCard';
import ShareButton from './ShareButton';
import EditPostModal from './EditPostModal';


const getStyles = (theme) => {
    const isDark = theme === 'dark';
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    const textSecondary = isDark ? '#b0b3b8' : '#606770';
    const backgroundCard = isDark ? '#242526' : 'white';
    const borderSubtle = isDark ? '#3e4042' : '#e0e0e0';
    const blueAction = '#0a66c2'; 
    const redLike = '#f44336';
    const blueToggle = isDark ? '#6cc6e3' : '#2196F3'; 

    return {
        card: {
            background: backgroundCard,
            border: `1px solid ${borderSubtle}`,
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
        },
        header: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '1rem',
        },
        avatar: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
        },
        authorInfo: {
            flex: 1,
        },
        name: {
            fontWeight: 'bold',
            fontSize: '1rem',
            color: textPrimary, 
        },
        date: {
            fontSize: '0.85rem',
            color: textSecondary, 
        },
        editButton: {
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: textSecondary, 
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            fontSize: '1rem',
            lineHeight: '1.5',
            marginBottom: '1rem',
            whiteSpace: 'pre-wrap',
            color: textPrimary, 
        },
        toggleButton: {
            background: 'none',
            border: 'none',
            color: blueToggle, 
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            marginLeft: '4px',
        },
        image: {
            width: '100%',
            maxHeight: '400px',
            objectFit: 'contain',
            borderRadius: '8px',
            marginBottom: '1rem',
        },
        actions: {
            display: 'flex',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: `1px solid ${borderSubtle}`, 
        },
        actionButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: textSecondary, 
            transition: 'color 0.1s',
        },
        actionButtonLiked: {
            color: redLike,
        },
        shareDropdown: {
            position: 'relative',
            display: 'inline-block',
        },
        commentsSection: {
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: `1px solid ${borderSubtle}`, 
        },
        commentForm: {
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem',
        },
        commentInput: {
            flex: 1,
            padding: '0.5rem',
            border: `1px solid ${borderSubtle}`, 
            borderRadius: '4px',
            background: isDark ? '#3a3b3c' : '#f0f2f5', 
            color: textPrimary,
        },
        commentButton: {
            padding: '0.5rem 1rem',
            background: blueAction,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
    };
};


export default function PostCard({ post, currentUser, onLike, onComment, onEdit, onDelete, theme }) {
    // 1. Calcular os estilos baseados no tema recebido por prop
    const styles = getStyles(theme || 'light'); 
    
    const [showComments, setShowComments] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);
    const MAX_PREVIEW_LENGTH = 300;

    const handleLike = () => {
        if (currentUser) {
            onLike(post._id, currentUser._id);
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
            <div style={styles.header}>
                <img
                    src={post.author?.profilePicture || '/default-avatar.svg'}
                    alt={post.author?.name || 'Autor'}
                    style={styles.avatar}
                />
                <div style={styles.authorInfo}>
                    <div style={styles.name}>{post.author?.name || 'Usuário'}</div>
                    <div style={styles.date}>{formatRelativeTime(post.createdAt)}</div>
                </div>
                {isOwnPost && (
                    <button
                        onClick={() => setShowEditModal(true)}
                        style={styles.editButton}
                        aria-label="Editar post"
                    >
                        ⋮
                    </button>
                )}
            </div>

            <div style={styles.content}>
                {visibleContent}
                {shouldTruncate && !showFullContent && '... '}
                {shouldTruncate && (
                    <button onClick={toggleContent} style={styles.toggleButton}>
                        {showFullContent ? ' Ver menos' : ' Ver mais'}
                    </button>
                )}
            </div>

            {post.image && (
                <img src={post.image} alt="Post" style={styles.image} />
            )}

            <div style={styles.actions}>
                <button
                    onClick={handleLike}
                    style={{ 
                        ...styles.actionButton, 
                        ...(isLiked && styles.actionButtonLiked) // Estilo vermelho se for curtido
                    }}
                >
                    ❤️ {post.likes?.length || 0}
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    style={styles.actionButton}
                >
                    💬 {post.comments?.length || 0}
                </button>
                <div style={styles.shareDropdown}>
                    <ShareButton post={post} />
                </div>
            </div>

            {showComments && (
                <div style={styles.commentsSection}>
                    {/* Aqui, o CommentCard precisará do tema! */}
                    {post.comments?.map((comment) => (
                        <CommentCard
                            key={comment._id}
                            comment={comment}
                            currentUser={currentUser}
                            theme={theme} 
                        />
                    ))}
                    {currentUser && onComment && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const content = e.target.comment.value;
                                if (content) {
                                    onComment(post._id, content);
                                    e.target.reset();
                                }
                            }}
                            style={styles.commentForm}
                        >
                            <input
                                name="comment"
                                placeholder="Escreva um comentário..."
                                style={styles.commentInput}
                            />
                            <button type="submit" style={styles.commentButton}>
                                Enviar
                            </button>
                        </form>
                    )}
                </div>
            )}

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
        </div>
    );
}