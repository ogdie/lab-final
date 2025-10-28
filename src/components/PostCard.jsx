import { useState } from 'react';
import CommentCard from './CommentCard';
import ShareButton from './ShareButton';
import EditPostModal from './EditPostModal';

export default function PostCard({ post, currentUser, onLike, onComment, onEdit, onDelete }) {
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
          <div style={styles.date}>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</div>
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
          style={{ ...styles.actionButton, color: isLiked ? '#f44336' : '#666' }}
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
          {post.comments?.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
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
        />
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    border: '1px solid #e0e0e0',
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
  },
  date: {
    fontSize: '0.85rem',
    color: '#666',
  },
  editButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    cursor: 'pointer',
    color: '#666',
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
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#2196F3',
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
    borderTop: '1px solid #e0e0e0',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  shareDropdown: {
    position: 'relative',
    display: 'inline-block',
  },
  commentsSection: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e0e0e0',
  },
  commentForm: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  commentInput: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  commentButton: {
    padding: '0.5rem 1rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};