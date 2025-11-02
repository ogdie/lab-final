import { useState, useRef, useEffect } from 'react';
import { FaImage } from 'react-icons/fa';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // Aumentado para 2MB
const MAX_WIDTH = 1920; // Aumentado para melhor qualidade
const MAX_HEIGHT = 1920;

export default function ImageUpload({ 
  value, 
  onChange, 
  placeholder = "Selecione uma imagem",
  theme = 'light',
  accept = "image/*",
  style = {}
}) {
  const [preview, setPreview] = useState(value || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useThemeLanguage();
  const isDark = theme === 'dark';

  // Sincronizar preview com value quando value mudar externamente
  useEffect(() => {
    setPreview(value || '');
    if (!value && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [value]);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const getBase64Size = (base64String) => {
            const base64Data = base64String.split(',')[1] || base64String;
            return (base64Data.length * 3) / 4;
          };

          const qualities = [0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5];
          const tryCompress = (index) => {
            if (index >= qualities.length) {
              // Se ainda não coube, reduzir dimensões um pouco e tentar qualidade menor
              const smallerWidth = Math.round(width * 0.9);
              const smallerHeight = Math.round(height * 0.9);
              canvas.width = smallerWidth;
              canvas.height = smallerHeight;
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, smallerWidth, smallerHeight);
              const finalBase64 = canvas.toDataURL('image/jpeg', 0.5);
              resolve(finalBase64);
              return;
            }
            const quality = qualities[index];
            const base64 = canvas.toDataURL('image/jpeg', quality);
            const base64Size = getBase64Size(base64);
            if (base64Size <= MAX_FILE_SIZE) {
              resolve(base64);
            } else {
              tryCompress(index + 1);
            }
          };
          tryCompress(0);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Imagem muito grande. Tamanho máximo original: 10MB.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const base64 = await compressImage(file);
      setPreview(base64);
      onChange(base64);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Erro ao processar a imagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    ...style
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'inline-block',
    width: 'auto'
  };

  const tooltipStyle = {
    position: 'absolute',
    bottom: 'calc(100% + 10px)',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '0.4rem 0.6rem',
    background: isDark ? '#2c2f33' : '#ffffff',
    color: '#8B5CF6',
    border: '2px solid #8B5CF6',
    borderRadius: '6px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    pointerEvents: 'none',
    opacity: showTooltip ? 1 : 0,
    transition: 'opacity 0.2s ease',
  };

  // Adicionar seta (flecha) na tooltip
  const tooltipArrowStyle = {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: `6px solid #8B5CF6`,
  };

  const inputStyle = {
    width: 'auto',
    padding: '0.75rem',
    border: `1px solid #8B5CF6`,
    borderRadius: '24px',
    background: isDark ? '#2c2f33' : '#fff',
    color: '#8B5CF6',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'background 0.2s, border-color 0.2s',
    minWidth: '48px',
    height: '48px'
  };

  const previewContainerStyle = {
    position: 'relative',
    marginTop: '0.5rem',
    display: 'inline-block',
    maxWidth: '100%',
    lineHeight: 0, // Remove espaço extra abaixo da imagem inline
    width: 'fit-content', // Container se ajusta ao tamanho da imagem
    fontSize: 0, // Remove espaço entre elementos inline
    padding: 0,
    margin: 0
  };

  const previewStyle = {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '300px',
    height: 'auto',
    width: 'auto',
    borderRadius: '8px',
    objectFit: 'contain',
    border: `1px solid ${isDark ? '#3e4042' : '#ddd'}`,
    verticalAlign: 'top', // Remove espaço extra abaixo
    margin: 0, // Remove margens
    padding: 0, // Remove padding
    outline: 'none' // Remove outline do navegador
  };

  const removeButtonStyle = {
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '0.65rem',
    position: 'absolute',
    top: '4px',
    right: '4px',
    zIndex: 10,
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    fontWeight: 'bold',
    padding: 0,
    transform: 'translate(0, 0)' // Garantir que está posicionado relativo à imagem
  };

  const errorStyle = {
    color: '#dc2626',
    fontSize: '0.85rem',
    marginTop: '0.25rem'
  };

  return (
    <div style={containerStyle}>
      <div style={inputWrapperStyle}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={loading}
          style={{ display: 'none' }}
          id="image-upload-input"
        />
        <label 
          htmlFor="image-upload-input" 
          style={{
            ...inputStyle,
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark ? '#3a3b3c' : '#f8f9ff';
            e.currentTarget.style.borderColor = '#9d68f7';
            setShowTooltip(true);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDark ? '#2c2f33' : '#fff';
            e.currentTarget.style.borderColor = '#8B5CF6';
            setShowTooltip(false);
          }}
        >
          {loading ? (
            <span style={{ fontSize: '0.9rem' }}>Processando imagem...</span>
          ) : (
            <>
              <FaImage style={{ fontSize: '1.4rem' }} />
              {showTooltip && (
                <div style={tooltipStyle}>
                  {t('add_image') || 'Adicionar Imagem'}
                  <div style={tooltipArrowStyle}></div>
                </div>
              )}
            </>
          )}
        </label>
      </div>

      {preview && (
        <div style={previewContainerStyle}>
          <img src={preview} alt="Preview" style={previewStyle} />
          <button
            type="button"
            onClick={handleRemove}
            style={removeButtonStyle}
            title="Remover imagem"
            aria-label="Remover imagem"
          >
            ✕
          </button>
        </div>
      )}

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
}