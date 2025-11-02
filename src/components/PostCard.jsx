import { useState } from "react";
import { useRouter } from "next/navigation";
import CommentCard from "./CommentCard";
import ShareButton from "./ui/ShareButton";
import EditPostModal from "./ui/EditPostModal";
import MentionTextarea from "./ui/MentionTextarea";
import UsersListModal from "./ui/UsersListModal";
import { renderTextWithMentions } from "../utils/mentionRenderer";
import { useThemeLanguage } from "../context/ThemeLanguageContext";
import { FaThumbsUp, FaComment, FaShare, FaEllipsisH } from 'react-icons/fa';

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
  return date.toLocaleDateString("pt-BR");
}

// Ícones usando react-icons
const ICONS = {
  Like: <FaThumbsUp />,
  Comment: <FaComment />,
  Share: <FaShare />,
  Dots: <FaEllipsisH />,
};

// CORREÇÃO: getStyles agora recebe o objeto 'post' como argumento
const getStyles = (theme, post = {}) => {
  const isDark = theme === "dark";
  const textPrimary = isDark ? "#e4e6eb" : "#1d2129";
  const textSecondary = isDark ? "#b0b3b8" : "#606770";
  const backgroundCard = isDark ? "#2c2f33" : "#ffffff";
  const borderSubtle = isDark ? "#3e4042" : "#d1d1d1";
  const blueAction = "#8B5CF6";
  const redLike = "#716affff";
  const linkedInShadow =
    "0 0 0 1px rgb(0 0 0 / 15%), 0 2px 3px rgb(0 0 0 / 5%)";
  const hoverBg = isDark ? "#3a3b3c" : "#f0f0f0";

  return {
    card: {
      background: backgroundCard,
      border: `1px solid #8B5CF6`,
      borderRadius: "12px",
      padding: "16px 0 0 0",
      marginBottom: "8px",
      boxShadow: linkedInShadow,
      wordBreak: "break-word",
      overflowWrap: "break-word",
    },
    header: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      marginBottom: "16px",
      padding: "0 16px",
    },
    avatar: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      objectFit: "cover",
      cursor: "pointer",
    },
    authorInfo: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    name: {
      fontWeight: "600",
      fontSize: "0.95rem",
      color: textPrimary,
      lineHeight: 1.2,
      cursor: "pointer",
    },
    title: {
      fontSize: "0.8rem",
      color: textSecondary,
      lineHeight: 1.2,
    },
    date: {
      fontSize: "0.75rem",
      color: textSecondary,
    },
    dotsButton: {
      background: "none",
      border: "none",
      fontSize: "1.25rem",
      cursor: "pointer",
      color: textSecondary,
      padding: "8px",
      margin: "-4px",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s ease",
      flexShrink: 0,
    },
    content: {
      fontSize: "0.95rem",
      lineHeight: "1.4",
      // CORREÇÃO: Acesso a post.image agora é seguro
      marginBottom: post.image ? "0" : "16px",
      whiteSpace: "pre-wrap",
      color: textPrimary,
      padding: "0 16px",
    },
    toggleButton: {
      background: "none",
      border: "none",
      color: blueAction,
      cursor: "pointer",
      fontSize: "0.95rem",
      fontWeight: "600",
      marginLeft: "4px",
      padding: 0,
    },
    image: {
      width: "100%",
      maxHeight: "60vh",
      objectFit: "cover",
      marginTop: "12px",
      marginBottom: "8px",
    },
    statsBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 16px 8px 16px",
      fontSize: "0.8rem",
      color: textSecondary,
    },
    actions: {
      display: "flex",
      justifyContent: "space-around",
      padding: "4px 8px",
      borderTop: `1px solid ${borderSubtle}`,
      borderBottom: `1px solid ${borderSubtle}`,
      gap: "4px",
    },
    // UPDATED: actionButton now mirrors ShareButton behavior (same visual style)
    actionButton: {
      background: "none",
      border: "none",
      flex: 1,
      cursor: "pointer",
      fontSize: "0.9rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      color: textSecondary,
      padding: "8px 12px",
      margin: "0",
      fontWeight: "600",
      borderRadius: "6px",
      minHeight: "36px",
      transition: "background-color 0.2s ease, color 0.2s ease",
      position: "relative",
    },
    actionButtonLiked: {
      color: redLike,
    },
    commentsSection: {
      padding: "0 16px 16px 16px",
    },
    commentForm: {
      display: "flex",
      gap: "8px",
      marginTop: "16px",
      alignItems: "flex-start",
    },
    commentAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
      flexShrink: 0,
    },
    commentInput: {
      flex: 1,
      padding: "8px 12px",
      border: `1px solid ${borderSubtle}`,
      borderRadius: "20px",
      background: isDark ? "#3a3b3c" : "#f0f2f5",
      color: textPrimary,
      fontSize: "0.9rem",
      resize: "none",
      minHeight: "40px",
    },
    commentButton: {
      padding: "0.5rem 1rem",
      background: blueAction,
      color: "white",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.9rem",
      alignSelf: "flex-end",
    },
    // expose hover bg & active color so we can reuse inline
    _hoverBg: hoverBg,
    _activeColor: blueAction,
  };
};

export default function PostCard({
  post,
  currentUser,
  onLike,
  onComment,
  onEdit,
  onDelete,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onReplyComment,
  theme,
  topicId = null,
}) {
  // Passando o objeto 'post' para o getStyles
  const styles = getStyles(theme || "light", post);
  const { t } = useThemeLanguage();
  const router = useRouter();

  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
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
      setCommentText("");
      setShowComments(true);
    }
  };

  // Normalizar IDs para comparação correta - recalcular a cada render para garantir atualização
  const normalizedLikes = (post.likes || []).map(id => String(id));
  const currentUserId = currentUser?._id ? String(currentUser._id) : null;
  const isLiked = currentUserId && normalizedLikes.includes(currentUserId);
  const isOwnPost =
    currentUser && String(currentUser._id) === String(post.author?._id || post.author);
  
  // Calcular contagem de comentários (incluindo replies)
  const commentsCount = (post.comments || []).length;

  const displayContent = post.content || "";
  const shouldTruncate = displayContent.length > MAX_PREVIEW_LENGTH;
  const visibleContent = showFullContent
    ? displayContent
    : displayContent.substring(0, MAX_PREVIEW_LENGTH);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const handleEdit = (updatedData) => {
    if (onEdit && typeof onEdit === "function") {
      onEdit(post._id, updatedData);
    }
    setShowEditModal(false);
  };

  // convenience variables for hover behavior
  const appliedThemeIsDark = (theme || "light") === "dark";
  const hoverBg = styles._hoverBg;
  const activeColor = styles._activeColor;
  const defaultActionColor = styles.actionButton.color;

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
          src={post.author?.profilePicture || "/default-avatar.svg"}
          alt={post.author?.name || "Autor"}
          style={styles.avatar}
          onClick={() =>
            post.author?._id && router.push(`/profile?id=${post.author._id}`)
          }
        />
        <div style={styles.authorInfo}>
          <div
            style={styles.name}
            onClick={() =>
              post.author?._id && router.push(`/profile?id=${post.author._id}`)
            }
          >
            {post.author?.name || t("user")}
          </div>
          <div style={styles.title}>
            {post.author?.title || t("network_user")}
          </div>
          <div style={styles.date}>{formatRelativeTime(post.createdAt)}</div>
        </div>
        {isOwnPost && (
          <button
            onClick={() => setShowEditModal(true)}
            style={styles.dotsButton}
            aria-label="Opções do post"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {ICONS.Dots}
          </button>
        )}
      </div>

      <div style={styles.content}>
        {renderTextWithMentions(visibleContent, (userName) => {
          // Navegar para perfil quando clicar na menção
          router.push(`/profile?name=${encodeURIComponent(userName)}`);
        })}
        {shouldTruncate && !showFullContent && "... "}
        {shouldTruncate && (
          <button onClick={toggleContent} style={styles.toggleButton}>
            {showFullContent ? t("see_less") : t("see_more")}
          </button>
        )}
      </div>

      {post.image && (
        <img src={post.image} alt={t("content_alt")} style={styles.image} />
      )}

      <div style={styles.statsBar}>
        <span
          onClick={() => {
            if (normalizedLikes.length > 0) {
              setShowLikesModal(true);
            }
          }}
          style={{
            cursor: normalizedLikes.length > 0 ? 'pointer' : 'default',
            userSelect: 'none',
          }}
        >
          {normalizedLikes.length} {ICONS.Like}
        </span>
        <span>
          {commentsCount} {t("comments")}
        </span>
      </div>

      {showLikesModal && (
        <UsersListModal
          isOpen={showLikesModal}
          onClose={() => setShowLikesModal(false)}
          title={t('likes') || 'Curtidas'}
          userIds={normalizedLikes}
          theme={theme}
        />
      )}

      <div style={styles.actions}>
        <button
          onClick={handleLike}
          style={{
            ...styles.actionButton,
            ...(isLiked && styles.actionButtonLiked),
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hoverBg;
            e.currentTarget.style.color = activeColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = isLiked
              ? styles.actionButtonLiked.color || activeColor
              : defaultActionColor;
          }}
        >
          {ICONS.Like} {t("like")}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          style={styles.actionButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hoverBg;
            e.currentTarget.style.color = activeColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = defaultActionColor;
          }}
        >
          {ICONS.Comment} {t("comment")}
        </button>
        <ShareButton
          post={post}
          topicId={topicId}
          style={styles.actionButton}
          icon={ICONS.Share}
          theme={theme}
        />
      </div>

      {showComments && (
        <div style={styles.commentsSection}>
          {currentUser && onComment && (
            <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
              <img
                src={currentUser.profilePicture || "/default-avatar.svg"}
                alt={currentUser.name || "Você"}
                style={styles.commentAvatar}
              />
              <MentionTextarea
                name="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t("add_a_comment")}
                style={styles.commentInput}
                rows={1}
                theme={theme}
              />
              {commentText.trim().length > 0 && (
                <button type="submit" style={styles.commentButton}>
                  {t("send")}
                </button>
              )}
            </form>
          )}

          {(() => {
            // Separar comentários principais (sem parentComment) de replies
            const allComments = post.comments || [];

            // Função auxiliar para obter o ID do parentComment
            const getParentId = (comment) => {
              if (!comment.parentComment) return null;
              if (typeof comment.parentComment === "string")
                return comment.parentComment;
              if (comment.parentComment._id)
                return String(comment.parentComment._id);
              return String(comment.parentComment);
            };

            // Filtrar comentários principais
            const mainComments = allComments.filter((c) => {
              const parentId = getParentId(c);
              return (
                !parentId ||
                parentId === "null" ||
                parentId === "undefined" ||
                parentId === ""
              );
            });

            // Agrupar replies por comentário pai
            const repliesMap = {};

            allComments.forEach((comment) => {
              const parentId = getParentId(comment);
              if (
                parentId &&
                parentId !== "null" &&
                parentId !== "undefined" &&
                parentId !== ""
              ) {
                if (!repliesMap[parentId]) {
                  repliesMap[parentId] = [];
                }
                repliesMap[parentId].push(comment);
              }
            });

            return mainComments.map((rawComment) => {
              const normalizedComment = {
                ...rawComment,
                content:
                  rawComment?.content ??
                  rawComment?.text ??
                  rawComment?.body ??
                  "",
                createdAt:
                  rawComment?.createdAt ||
                  rawComment?.created_at ||
                  rawComment?.date ||
                  Date.now(),
                author:
                  typeof rawComment?.author === "string" &&
                  currentUser &&
                  rawComment.author === currentUser._id
                    ? currentUser
                    : rawComment.author,
              };

              // Obter replies deste comentário
              const commentId = String(normalizedComment._id);
              const replies = repliesMap[commentId] || [];

              return (
                <div key={normalizedComment._id}>
                  <CommentCard
                    comment={normalizedComment}
                    currentUser={currentUser}
                    onEdit={onEditComment}
                    onDelete={onDeleteComment}
                    onLike={onLikeComment}
                    onReply={onReplyComment}
                    postId={post._id}
                    theme={theme}
                  />
                  {/* Renderizar replies indentados */}
                  {replies
                    .sort((a, b) => {
                      const dateA = new Date(
                        a.createdAt || a.created_at || a.date || 0
                      );
                      const dateB = new Date(
                        b.createdAt || b.created_at || b.date || 0
                      );
                      return dateA - dateB; // Ordenar do mais antigo para o mais recente
                    })
                    .map((reply) => {
                      const normalizedReply = {
                        ...reply,
                        content:
                          reply?.content ?? reply?.text ?? reply?.body ?? "",
                        createdAt:
                          reply?.createdAt ||
                          reply?.created_at ||
                          reply?.date ||
                          Date.now(),
                        parentComment: reply.parentComment, // Preservar parentComment
                        author:
                          typeof reply?.author === "string" &&
                          currentUser &&
                          reply.author === currentUser._id
                            ? currentUser
                            : reply.author,
                      };
                      return (
                        <CommentCard
                          key={normalizedReply._id}
                          comment={normalizedReply}
                          currentUser={currentUser}
                          onEdit={onEditComment}
                          onDelete={onDeleteComment}
                          onLike={onLikeComment}
                          onReply={onReplyComment}
                          postId={post._id}
                          theme={theme}
                          isReply={true}
                        />
                      );
                    })}
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}
