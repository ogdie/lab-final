export default function CommentCard({ comment, currentUser, onLike, onDelete }) {
  const isLiked = currentUser && comment.likes?.includes(currentUser._id);
  const canDelete = currentUser && comment.author._id === currentUser._id;

  const handleLike = () => {
    if (onLike) {
      onLike(comment._id);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Tem certeza que deseja deletar este comentário?')) {
      onDelete(comment._id);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <img 
          src={comment.author?.profilePicture || '/default-avatar.svg'} 
          alt={comment.author?.name}
          style={styles.avatar}
        />
        <div style={styles.authorInfo}>
          <div style={styles.name}>{comment.author?.name}</div>
          <div style={styles.date}>{new Date(comment.createdAt).toLocaleDateString()}</div>
        </div>
        {canDelete && (
          <button onClick={handleDelete} style={styles.deleteButton}>
            🗑️
          </button>
        )}
      </div>
      
      <div style={styles.content}>{comment.content}</div>
      
      <div style={styles.actions}>
        <button 
          onClick={handleLike}
          style={{ ...styles.likeButton, color: isLiked ? '#f44336' : '#666' }}
        >
          ❤️ {comment.likes?.length || 0}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '0.5rem'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    position: 'relative'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  authorInfo: {
    flex: 1
  },
  name: {
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  date: {
    fontSize: '0.8rem',
    color: '#666'
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.25rem'
  },
  content: {
    fontSize: '0.95rem',
    lineHeight: '1.4',
    marginBottom: '0.75rem'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid #f0f0f0'
  },
  likeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  }
};

