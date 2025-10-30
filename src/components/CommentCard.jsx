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

    return {
        commentContainer: {
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
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
        bubble: {
            flex: 1,
            background: backgroundComment,
            borderRadius: '12px',
            padding: '8px 12px',
            position: 'relative',
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
            padding: '4px 0',
            transition: 'color 0.1s',
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
            padding: '0 4px',
            transition: 'color 0.1s',
        },
    };
};


import { useThemeLanguage } from '../context/ThemeLanguageContext';

export default function CommentCard({ comment, currentUser, onLike, onDelete, theme = 'light' }) {
    // Inicialização dos estilos com o tema
    const styles = getStyles(theme);
    const { t } = useThemeLanguage();

    const isLiked = currentUser && comment.likes?.includes(currentUser._id);
    const canDelete = currentUser && (comment.author._id === currentUser._id);
    // Para fins de demonstração, assumimos que 'author' pode ter um campo 'title'
    const authorTitle = comment.author?.title || t('member_of_network');

    const handleLike = () => {
        if (onLike) {
            onLike(comment._id);
        }
    };

    const handleDelete = () => {
        if (onDelete && window.confirm(t('delete_confirm'))) {
            onDelete(comment._id);
        }
    };

    return (
        <div style={styles.commentContainer}>
            <img 
                src={comment.author?.profilePicture || '/default-avatar.svg'} 
                alt={comment.author?.name || 'Autor'}
                style={styles.avatar}
            />
            
            <div style={styles.bubble}>
                <div style={styles.header}>
                    <div style={styles.authorInfo}>
                        <div style={styles.name}>{comment.author?.name || t('user')}</div>
                        <div style={styles.title}>{authorTitle}</div> 
                    </div>
                </div>

                <div style={styles.content}>{comment.content}</div>

                <div style={styles.footer}>
                    <span style={styles.dateText}>
                        {formatRelativeTime(comment.createdAt)}
                    </span>
                    
                    <button 
                        onClick={handleLike}
                        style={{ ...styles.actionButton, ...(isLiked && styles.actionButtonLiked) }}
                    >
                        {t('like')} ({comment.likes?.length || 0})
                    </button>

                    <button 
                        // Ação de Responder. Não tem implementação, mas é comum no LI.
                        style={styles.actionButton}
                    >
                        {t('reply')}
                    </button>

                    {canDelete && (
                        <button onClick={handleDelete} style={styles.deleteButton} title={t('delete')}>
                            ✕
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}