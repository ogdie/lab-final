import { useState, useRef } from 'react';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_WIDTH = 1920; // Largura máxima
const MAX_HEIGHT = 1920; // Altura máxima

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
  const fileInputRef = useRef(null);
  const isDark = theme === 'dark';

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Calcular novas dimensões mantendo proporção
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width = width * ratio;
            height = height * ratio;
          }
          
          // Criar canvas para redimensionar
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Converter para base64 com qualidade ajustada
          const quality = 0.8; // Qualidade da compressão (0-1)
          const base64 = canvas.toDataURL('image/jpeg', quality);
          
          // Verificar tamanho final
          const base64Size = (base64.length * 3) / 4; // Aproximação do tamanho em bytes
          
          if (base64Size > MAX_FILE_SIZE) {
            // Se ainda for muito grande, reduzir mais a qualidade
            const lowerQuality = 0.6;
            const compressedBase64 = canvas.toDataURL('image/jpeg', lowerQuality);
            resolve(compressedBase64);
          } else {
            resolve(base64);
          }
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

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    // Validar tamanho original
    if (file.size > MAX_FILE_SIZE * 2) {
      setError('Imagem muito grande. Tamanho máximo: 4MB.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Comprimir e otimizar imagem
      const base64 = await compressImage(file);
      
      // Atualizar preview e valor
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
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: `1px solid ${isDark ? '#3e4042' : '#ddd'}`,
    borderRadius: '4px',
    background: isDark ? '#2c2f33' : '#fff',
    color: isDark ? '#e4e6eb' : '#1d2129',
    fontSize: '0.9rem',
    cursor: 'pointer'
  };

  const previewStyle = {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '8px',
    objectFit: 'contain',
    marginTop: '0.5rem',
    border: `1px solid ${isDark ? '#3e4042' : '#ddd'}`
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '0.5rem'
  };

  const removeButtonStyle = {
    ...buttonStyle,
    background: '#dc2626'
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
          style={inputStyle}
        >
          {loading ? 'Processando imagem...' : placeholder}
        </label>
      </div>

      {preview && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={preview} alt="Preview" style={previewStyle} />
          <button
            type="button"
            onClick={handleRemove}
            style={removeButtonStyle}
          >
            Remover imagem
          </button>
        </div>
      )}

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
}

