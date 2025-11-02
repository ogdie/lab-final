import { useState, useEffect } from 'react';
import CodemiaLogo from './ui/CodemiaLogo';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { SiGmail } from 'react-icons/si';
import { FaGithub } from 'react-icons/fa';

export default function LoginForm({ onLogin, onErrorReset, onSwitchToRegister }) {
  const { t } = useThemeLanguage();
  const [animateButton, setAnimateButton] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Registrar função de reset para ser chamada quando o modal fechar
  useEffect(() => {
    if (onErrorReset) {
      const resetFn = () => {
        setAnimateButton(false);
      };
      onErrorReset(resetFn);
    }
  }, [onErrorReset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando o usuário começar a digitar
    if (error) {
      setError('');
    }
  };

  const normalize = (data) => ({
    ...data,
    email: (data.email || '').trim().toLowerCase(),
  });

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const data = normalize(formData);
    setError('');
    onLogin({ email: data.email, password: data.password });
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (animateButton) return;
    
    const data = normalize(formData);
    
    // Validar campos antes de iniciar animação
    if (!data.email?.trim() || !data.password?.trim()) {
      setError('Preencha email e senha.');
      return;
    }
    
    setAnimateButton(true);
    setTimeout(() => {
      const syntheticEvent = { preventDefault: () => {} };
      handleSubmit(syntheticEvent);
    }, 2500); 
  };

  const handleOAuthLogin = (provider) => {
    if (animateButton) return;
    setAnimateButton(true);
    setTimeout(() => {
      if (provider === 'google') {
        window.location.href = '/api/auth/google';
      } else if (provider === 'github') {
        window.location.href = '/api/auth/github';
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <CodemiaLogo style={styles.CodemiaLogo} />
      <div style={styles.titleWrapper}>
        {!!error && <div style={styles.errorTooltip}>{error}</div>}
        <h2 style={styles.title}>
          Bem-vindo de volta!
        </h2>
      </div>

      <input
        name="email"
        type="email"
        placeholder="Email institucional ou pessoal"
        value={formData.email}
        onChange={handleChange}
        required
        style={styles.input}
      />

      <input
        name="password"
        type="password"
        placeholder="Senha"
        value={formData.password}
        onChange={handleChange}
        required
        style={styles.input}
        minLength={6}
      />

      <div style={styles.submitButtonWrapper}>
        <button
          type="submit"
          onClick={handleButtonClick}
          style={{
            ...styles.imageButton,
            ...(animateButton ? styles.slideLeft : {}),
          }}
        >
          <img
            src="/btPuzzle.svg"
            alt="Botão Conectar"
            style={styles.buttonImage}
          />
        </button>
      </div>
      <div style={styles.divider}>
        <div style={styles.dividerLine}></div>
        <span style={styles.dividerText}>ou continue com</span>
        <div style={styles.dividerLine}></div>
      </div>
      <div style={styles.oauthContainer}>
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          style={styles.oauthButton}
        >
          <SiGmail style={{ marginRight: '8px', fontSize: '1.2rem' }} />
          Gmail
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin('github')}
          style={styles.oauthButton}
        >
          <FaGithub style={{ marginRight: '8px', fontSize: '1.2rem' }} />
          GitHub
        </button>
      </div>

      <div style={styles.toggleWrapper}>
        <span>
          Não tem conta?{' '}
          <button
            type="button"
            onClick={() => {
              setError('');
              setAnimateButton(false);
              onSwitchToRegister();
            }}
            style={styles.toggleLink}
          >
            Cadastre-se
          </button>
        </span>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    width: '100%',
    maxWidth: '420px',
    padding: '1.75rem 1.75rem 1.5rem 1.75rem',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    boxSizing: 'border-box',
  },
  titleWrapper: {
    position: 'relative',
    width: '100%',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: '4px',
    marginTop: '0',
    lineHeight: '1.3',
  },
  input: {
    padding: '12px 14px',
    fontSize: '0.95rem',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    backgroundColor: '#f9fafb',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    color: '#2d3748',
    width: '100%',
    boxSizing: 'border-box',
  },
  submitButtonWrapper: {
    position: 'relative',
    height: '110px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 0',
  },
  imageButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '110px',
    height: '110px',
    transition: 'transform 0.8s ease-in-out',
  },
  slideLeft: {
    position: 'fixed',
    top: '48.5vh',
    left: '-35.5vw',
    transform: 'translate(-50%, -50%) scale(1.45)',
    transition: 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)',
    zIndex: 9999,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  },
  toggleWrapper: {
    textAlign: 'center',
    fontSize: '0.9rem',
    marginTop: '0',
    marginBottom: '0',
    color: '#4B5563',
  },
  toggleLink: {
    background: 'none',
    border: 'none',
    color: '#4F46E5',
    fontWeight: '500',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '8px 0 6px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    padding: '0 12px',
    fontSize: '0.85rem',
    color: '#718096',
    whiteSpace: 'nowrap',
  },
  oauthContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '2px',
  },
  oauthButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    fontSize: '0.9rem',
    fontWeight: '500',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s, color 0.2s',
    color: '#2d3748',
  },
  CodemiaLogo: {
    width: '130px',
    margin: '0 auto 8px auto',
    display: 'block',
    color: '#4F46E5',
  },
  errorTooltip: {
    position: 'absolute',
    top: '-50px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 12px',
    fontSize: '0.85rem',
    color: '#e53e3e',
    backgroundColor: '#fff5f5',
    border: '1px solid #fed7d7',
    borderRadius: '12px',
    fontWeight: '500',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    pointerEvents: 'none',
  },
};

