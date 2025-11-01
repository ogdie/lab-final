import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import MentionTextarea from './ui/MentionTextarea';
import { renderTextWithMentions } from '../utils/mentionRenderer';
import { FaTimes } from 'react-icons/fa';

// Formata a diferença de tempo de forma sucinta (reutilizando lógica do PostCard)
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
    return date.toLocaleDateString('pt-BR');
}

// Estilos dinâmicos baseados no tema
const getStyles = (theme) => {
    const isDark = theme === 'dark';
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    const textSecondary = isDark ? '#b0b3b8' : '#606770';
    // Cor de fundo do 'balão' do comentário
    const backgroundComment = isDark ? '#3a3b3c' : '#f0f2f5'; 
    const blueAction = '#4F46E5';
    const redLike = '#6860f9ff';
    const hoverBg = isDark ? '#4a4b4c' : '#e4e6e8';

    return {
        commentContainer: {
            display: 'flex',
            gap: '8px',
            marginTop: '16px',
            marginBottom: '12px',
            alignItems: 'flex-start',
        },
        replyContainer: {
            display: 'flex',
            gap: '6px',
            marginBottom: '8px',
            marginLeft: '48px', // Indentação para replies
            alignItems: 'flex-start',
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
            cursor: 'pointer',
        },
        replyAvatar: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
            cursor: 'pointer',
        },
        bubble: {
            flex: 1,
            background: backgroundComment,
            borderRadius: '12px',
            padding: '8px 12px',
            position: 'relative',
        },
        replyBubble: {
            flex: 1,
            background: backgroundComment,
            borderRadius: '8px',
            padding: '6px 10px',
            position: 'relative',
            fontSize: '0.85rem',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
        },
        authorInfo: {
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.2,
        },
        name: {
            fontWeight: '600',
            fontSize: '0.9rem',
            color: textPrimary,
            cursor: 'pointer',
        },
        title: { // Cargo ou título do autor
            fontSize: '0.75rem',
            color: textSecondary,
        },
        content: {
            fontSize: '0.9rem',
            lineHeight: '1.4',
            color: textPrimary,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
        },
        footer: {
            display: 'flex',
            gap: '12px',
            marginTop: '4px',
            marginLeft: '8px', // Alinhar abaixo do conteúdo
        },
        actionButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: textSecondary,
            padding: '4px 8px',
            margin: '0',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease, color 0.2s ease',
            position: 'relative',
        },
        actionButtonLiked: {
            color: redLike,
        },
        dateText: {
            fontSize: '0.75rem',
            color: textSecondary,
            marginRight: 'auto', // Empurrar ações para a direita
        },
        deleteButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: textSecondary,
            padding: '4px 6px',
            margin: '0',
            borderRadius: '4px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease, color 0.2s ease',
        },
        _hoverBg: hoverBg,
        _activeColor: blueAction,
    };
};

export default function CommentCard({ comment, currentUser, onLike, onDelete, onEdit, onReply, postId, theme = 'light', isReply = false }) {
    // Inicialização dos estilos com o tema
    const styles = getStyles(theme);
    const { t } = useThemeLanguage();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content || '');
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    
    // Helper para cores consistentes
    const isDark = theme === 'dark';
    const textSecondary = isDark ? '#b0b3b8' : '#606770';

    const isLiked = currentUser && comment.likes?.map(id => String(id)).includes(String(currentUser._id));
    const canModify = currentUser && (comment.author?._id === currentUser._id || String(comment.author?._id) === String(currentUser._id));
    // Para fins de demonstração, assumimos que 'author' pode ter um campo 'title'
    const authorTitle = comment.author?.title || t('member_of_network');

    const handleAuthorClick = () => {
        const authorId = comment.author?._id || comment.author;
        if (authorId) {
            router.push(`/profile?id=${authorId}`);
        }
    };

    const handleLike = () => {
        if (onLike) {
            onLike(comment._id);
        }
    };

    const handleReply = () => {
        if (showReplyForm && replyText.trim() && onReply) {
            onReply(comment._id, replyText.trim());
            setReplyText('');
            setShowReplyForm(false);
        } else {
            setShowReplyForm(!showReplyForm);
        }
    };

    const handleDelete = () => {
        if (onDelete && window.confirm(t('delete_confirm'))) {
            onDelete(comment._id);
        }
    };

    const handleSave = () => {
        if (onEdit && editText.trim()) {
            onEdit(comment._id, { content: editText.trim() });
            setIsEditing(false);
        }
    };

    const containerStyle = isReply ? styles.replyContainer : styles.commentContainer;
    const avatarStyle = isReply ? styles.replyAvatar : styles.avatar;
    const bubbleStyle = isReply ? styles.replyBubble : styles.bubble;

    return (
        <div style={containerStyle}>
            <img 
                src={comment.author?.profilePicture || '/default-avatar.svg'} 
                alt={comment.author?.name || 'Autor'}
                style={avatarStyle}
                onClick={handleAuthorClick}
            />
            
            <div style={bubbleStyle}>
                <div style={styles.header}>
                    <div style={styles.authorInfo}>
                        <div 
                            style={styles.name}
                            onClick={handleAuthorClick}
                        >
                            {comment.author?.name || t('user')}
                        </div>
                        <div style={styles.title}>{authorTitle}</div> 
                    </div>
                </div>

                <div style={styles.content}>
                    {isEditing ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc' }}
                            />
                            <button onClick={handleSave} style={{ padding: '6px 10px' }}>{t('save') || 'Salvar'}</button>
                            <button onClick={() => { setIsEditing(false); setEditText(comment.content || ''); }} style={{ padding: '6px 10px' }}>{t('cancel')}</button>
                        </div>
                    ) : (
                        renderTextWithMentions(comment.content)
                    )}
                </div>

                <div style={styles.footer}>
                    <span style={styles.dateText}>
                        {formatRelativeTime(comment.createdAt)}
                    </span>
                    
                    <button 
                        onClick={handleLike}
                        style={{ ...styles.actionButton, ...(isLiked && styles.actionButtonLiked) }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = styles._hoverBg;
                            e.currentTarget.style.color = styles._activeColor;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = isLiked 
                                ? styles.actionButtonLiked.color 
                                : textSecondary;
                        }}
                    >
                        {t('like')} ({comment.likes?.length || 0})
                    </button>

                    {onReply && (
                        <button 
                            onClick={handleReply}
                            style={styles.actionButton}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = styles._hoverBg;
                                e.currentTarget.style.color = styles._activeColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = textSecondary;
                            }}
                        >
                            {t('reply')}
                        </button>
                    )}

                    {canModify && (
                        <>
                            <button 
                                onClick={() => setIsEditing(true)} 
                                style={styles.actionButton}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = styles._hoverBg;
                                    e.currentTarget.style.color = styles._activeColor;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = textSecondary;
                                }}
                            >
                                {t('edit_post')}
                            </button>
                            <button 
                                onClick={handleDelete} 
                                style={styles.deleteButton} 
                                title={t('delete')}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = styles._hoverBg;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <FaTimes />
                            </button>
                        </>
                    )}
                </div>

                {showReplyForm && onReply && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${styles.actionButton.color}20` }}>
                        <MentionTextarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={t('write_a_reply') || 'Escreva uma resposta...'}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '8px',
                                border: `1px solid ${styles.actionButton.color}40`,
                                background: theme === 'dark' ? '#3a3b3c' : '#f0f2f5',
                                color: theme === 'dark' ? '#e4e6eb' : '#1d2129',
                                fontSize: '0.9rem',
                                minHeight: '60px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            rows={2}
                            theme={theme}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowReplyForm(false);
                                    setReplyText('');
                                }}
                                style={{
                                    padding: '6px 12px',
                                    background: 'none',
                                    border: `1px solid ${styles.actionButton.color}40`,
                                    borderRadius: '6px',
                                    color: styles.actionButton.color,
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleReply}
                                disabled={!replyText.trim()}
                                style={{
                                    padding: '6px 12px',
                                    background: replyText.trim() ? '#4F46E5' : '#ccc',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'white',
                                    cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                }}
                            >
                                {t('reply')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}