import { useState, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { FaMedal, FaGraduationCap, FaRocket, FaTrophy, FaFileAlt, FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa';

// Ícones usando react-icons
const getIconByType = (type) => {
  switch (type) {
    case 'certification': return <FaMedal />;
    case 'course': return <FaGraduationCap />;
    case 'project': return <FaRocket />;
    case 'competition': return <FaTrophy />;
    case 'publication': return <FaFileAlt />;
    default: return <FaCheckCircle />;
  }
};

export default function AchievementCard({ achievement, theme = 'light', onEdit, onDelete, canEdit = false, onClick }) {
  const [imageError, setImageError] = useState(false);
  const { t, language } = useThemeLanguage();
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#606770';
  const background = isDark ? '#3e4042' : '#f6f8fa';
  const border = isDark ? '#4e5052' : '#dddfe2';

  // Resetar erro de imagem quando a imagem mudar
  useEffect(() => {
    setImageError(false);
  }, [achievement?.image]);

  // Labels traduzidos
  const getTypeLabel = (type) => {
    const key = `achievement_type_${type}`;
    return t(key) || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const locale = language === 'en' ? 'en-US' : 'pt-BR';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long'
    });
  };

  // Verificar se a imagem existe e não está vazia
  const hasImage = achievement?.image && achievement.image.trim() !== '';
  const showImage = hasImage && !imageError;
  const blueAction = '#8B5CF6';

  const handleCardClick = (e) => {
    // Não abrir modal se clicar nos botões de editar/deletar ou nos seus containers
    const clickedButton = e.target.closest('button');
    const clickedButtonContainer = e.target.closest('[data-button-container]');
    
    if (clickedButton || clickedButtonContainer) {
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      style={{
        background,
        border: `1px solid ${blueAction}`,
        borderRadius: '8px',
        marginBottom: '0.75rem',
        marginRight: '0.75rem',
        width: '200px',
        maxWidth: '100%',
        position: 'relative',
        verticalAlign: 'top',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'transform 0.2s, box-shadow 0.2s' : 'none'
      }}
      onMouseEnter={onClick ? (e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
      } : undefined}
      onMouseLeave={onClick ? (e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      } : undefined}
    >
      {/* Container da imagem ocupando todo o espaço superior */}
      <div 
        style={{
          width: '100%',
          height: '200px',
          position: 'relative',
          overflow: 'hidden',
          background: isDark ? '#2c2f33' : '#e7e7e7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {showImage ? (
          <img 
            src={achievement.image} 
            alt={achievement.title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'center',
              pointerEvents: 'none'
            }}
            onError={(e) => {
              console.error('Erro ao carregar imagem da conquista:', achievement.image);
              setImageError(true);
            }}
            onLoad={() => {
              // Resetar erro quando a imagem carregar com sucesso
              setImageError(false);
            }}
            loading="lazy"
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            fontSize: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textSecondary,
            pointerEvents: 'none'
          }}>
            {getIconByType(achievement.type)}
          </div>
        )}
        
        {/* Botões de editar e deletar posicionados absolutamente no canto superior direito */}
        {canEdit && (onEdit || onDelete) && (
          <div 
            data-button-container
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              display: 'flex',
              gap: '0.5rem',
              zIndex: 10,
              pointerEvents: 'auto'
            }}
          >
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(achievement);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: blueAction,
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                title={t('edit') || 'Editar'}
              >
                <FaEdit size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(achievement._id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f44336',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                title={t('delete') || 'Remover'}
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Área de informações embaixo da imagem */}
      <div 
        style={{
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          alignItems: 'center',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: textPrimary,
          margin: 0,
          wordBreak: 'break-word'
        }}>
          {achievement.title}
        </h3>
        <span style={{
          fontSize: '0.8rem',
          color: textSecondary
        }}>
          {formatDate(achievement.date)}
        </span>
      </div>
    </div>
  );
}