import { useState, useEffect } from 'react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import ImageUpload from './ImageUpload';

// Tipos de conquista alinhados ao contexto de programação
const ACHIEVEMENT_TYPES = [
  "certification",
  "course",
  "project",
  "competition",
  "publication",
  "other"
];

// --- Estilos dinâmicos (mesmo padrão do EditProfileModal) ---
const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#606770';
  const backgroundModal = isDark ? '#242526' : 'white';
  const borderInput = isDark ? '#3e4042' : '#ddd';
  const blueAction = '#8B5CF6';
  const grayCancel = isDark ? '#474a4d' : '#e7e7e7';

  return {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      background: backgroundModal,
      borderRadius: '10px',
      padding: '2rem',
      maxWidth: '550px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      border: isDark ? '1px solid #3e4042' : 'none',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: textPrimary,
      borderBottom: `1px solid ${borderInput}`,
      paddingBottom: '0.5rem',
      textAlign: 'left',
    },
    field: {
      marginBottom: '1.25rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.4rem',
      fontWeight: '500',
      color: textSecondary,
      fontSize: '0.9rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: `1px solid ${borderInput}`,
      borderRadius: '6px',
      fontSize: '1rem',
      backgroundColor: backgroundModal,
      color: textPrimary,
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: `1px solid ${borderInput}`,
      borderRadius: '6px',
      fontSize: '1rem',
      resize: 'vertical',
      backgroundColor: backgroundModal,
      color: textPrimary,
      boxSizing: 'border-box',
      minHeight: '80px',
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem',
    },
    cancelButton: {
      padding: '0.6rem 1.2rem',
      background: grayCancel,
      color: isDark ? textPrimary : '#333',
      border: isDark ? `1px solid ${borderInput}` : 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background 0.2s',
    },
    saveButton: {
      padding: '0.6rem 1.2rem',
      background: blueAction,
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'background 0.2s',
    }
  };
};
// --- FIM getStyles ---

export default function AddAchievementModal({ isOpen, onClose, onSave, theme = 'light' }) {
  const [formData, setFormData] = useState({
    title: '',
    type: ACHIEVEMENT_TYPES[0],
    description: '',
    date: '',
    technologies: '',
    image: ''
  });

  const styles = getStyles(theme);
  const { t } = useThemeLanguage();

  // Resetar formulário ao abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        type: ACHIEVEMENT_TYPES[0],
        description: '',
        date: '',
        technologies: '',
        image: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      // Processa tecnologias como array
      technologies: formData.technologies
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)
    };
    if (onSave) onSave(data);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{t('add_achievement')}</h2>
        <form onSubmit={handleSubmit}>
          {/* Título */}
          <div style={styles.field}>
            <label style={styles.label}>Título *</label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              required
              placeholder="Ex: AWS Certified Developer"
            />
          </div>

          {/* Tipo */}
          <div style={styles.field}>
            <label style={styles.label}>Tipo *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.input}
              required
            >
              {ACHIEVEMENT_TYPES.map(type => (
                <option key={type} value={type}>
                  {t(`achievement_type_${type}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div style={styles.field}>
            <label style={styles.label}>Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Descreva sua conquista, habilidades aplicadas ou resultado alcançado..."
            />
          </div>

          {/* Data */}
          <div style={styles.field}>
            <label style={styles.label}>Data *</label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* Imagem */}
          <div style={styles.field}>
            <ImageUpload
              value={formData.image}
              onChange={(value) => setFormData({ ...formData, image: value })}
              placeholder={t('select_image') || "Selecione uma imagem do computador"}
              theme={theme}
            />
            {!formData.image && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: styles.label.color }}>
                Ou{' '}
                <input
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    padding: '0.5rem'
                  }}
                  placeholder={t('example_url') || 'Cole uma URL de imagem'}
                />
              </div>
            )}
          </div>

          {/* Tecnologias */}
          <div style={styles.field}>
            <label style={styles.label}>Tecnologias ou Ferramentas</label>
            <input
              name="technologies"
              type="text"
              value={formData.technologies}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ex: React, Node.js, MongoDB (separadas por vírgula)"
            />
          </div>

          {/* Ações */}
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              {t('cancel')}
            </button>
            <button type="submit" style={styles.saveButton}>
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}