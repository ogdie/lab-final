import { useState, useEffect, useMemo } from 'react';
import BackButton from './ui/BackButton';
import CodemiaLogo from './ui/CodemiaLogo';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

const INSTITUTIONS = [
  "Faculdade de Engenharia da Universidade do Porto (FEUP)",
  "Faculdade de Ciências da Universidade do Porto (FCUP)",
  "Instituto Superior de Engenharia do Porto (ISEP – Politécnico do Porto)",
  "Instituto Superior de Tecnologias Avançadas do Porto (ISTEC Porto)",
  "Universidade Portucalense (UPT)",
  "42 Porto",
  "Academia de Código (Porto)",
  "EDIT. – Disruptive Digital Education (Porto)",
  "ATEC- Academia de Formação",
  "Bytes4Future",
  "Tokio School",
  "Outros"
];

export default function RegisterForm({ onRegister, onErrorReset, onSwitchToLogin }) {
  const { t } = useThemeLanguage();
  const [animateButton, setAnimateButton] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'Estudante',
    institution: INSTITUTIONS[0],
    birthDate: ''
  });
  const [error, setError] = useState('');

  
  useEffect(() => {
    if (onErrorReset) {
      const resetFn = () => {
        setAnimateButton(false);
      };
      onErrorReset(resetFn);
    }
  }, [onErrorReset]);

  const todayStr = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }, []);

  const minBirth = '1900-01-01';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (error) {
      setError('');
    }
  };

  const normalize = (data) => ({
    ...data,
    name: (data.name || '').trim(),
    email: (data.email || '').trim().toLowerCase(),
    institution: (data.institution || '').trim(),
    birthDate: data.birthDate || ''
  });

  const validateRegister = (data) => {
    if (!data.name) return 'Informe o nome.';
    if (!data.email) return 'Informe o email.';
    if (!data.password || data.password.length < 6) return 'Senha deve ter ao menos 6 caracteres.';
    if (!data.institution) return 'Selecione a instituição.';
    if (!data.birthDate) return 'Informe a data de nascimento.';
    if (data.birthDate < minBirth || data.birthDate > todayStr) return 'Data de nascimento inválida.';
    return '';
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const data = normalize(formData);

    const err = validateRegister(data);
    if (err) {
      setError(err);
      return;
    }

    setError('');
    onRegister({
      name: data.name,
      email: data.email,
      password: data.password,
      userType: data.userType,
      institution: data.institution,
      birthDate: data.birthDate
    });
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (animateButton) return;
    
    const data = normalize(formData);
    
    const err = validateRegister(data);
    if (err) {
      setError(err);
      return;
    }
    
    setAnimateButton(true);
    setTimeout(() => {
      const syntheticEvent = { preventDefault: () => {} };
      handleSubmit(syntheticEvent);
    }, 2500); 
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={{ marginBottom: '2px' }}>
        <BackButton to="/" onClick={onSwitchToLogin} />
      </div>
      <CodemiaLogo style={styles.CodemiaLogo} />
      <div style={styles.titleWrapper}>
        {!!error && <div style={styles.errorTooltip}>{error}</div>}
        <h2 style={styles.title}>
          Crie sua conta
        </h2>
      </div>

      <input
        name="name"
        placeholder="Nome completo"
        value={formData.name}
        onChange={handleChange}
        required
        style={styles.input}
      />

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

      <select
        name="userType"
        value={formData.userType}
        onChange={handleChange}
        style={styles.input}
      >
        <option value="Estudante">{t('user_type_student')}</option>
        <option value="Professor">{t('user_type_professor')}</option>
        <option value="Recrutador">{t('user_type_recruiter')}</option>
      </select>

      <select
        name="institution"
        value={formData.institution}
        onChange={handleChange}
        style={styles.input}
        required
      >
        {INSTITUTIONS.map((inst) => (
          <option key={inst} value={inst}>
            {inst === 'Outros' ? t('institution_others') : inst}
          </option>
        ))}
      </select>

      <input
        name="birthDate"
        type="date"
        value={formData.birthDate}
        onChange={handleChange}
        required
        style={styles.input}
        min={minBirth}
        max={todayStr}
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

      <div style={styles.toggleWrapper}>
        <span>
          Já tem conta?{' '}
          <button
            type="button"
            onClick={() => {
              setError('');
              setAnimateButton(false);
              onSwitchToLogin();
            }}
            style={styles.toggleLink}
          >
            Faça login
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
    gap: '4px',
    width: '100%',
    maxWidth: '420px',
    padding: '1.25rem 1.5rem 1.25rem 1.5rem',
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
    marginBottom: '2px',
    marginTop: '0',
    lineHeight: '1.3',
  },
  input: {
    padding: '10px 12px',
    fontSize: '0.9rem',
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
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '6px 0',
  },
  imageButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px',
    height: '100px',
    transition: 'transform 0.8s ease-in-out',
  },
  slideLeft: {
    position: 'fixed',
    top: '50vh',
    left: '-35.5vw',
    transform: 'translate(-50%, -50%) scale(1.6)',
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
    color: '#8B5CF6',
    fontWeight: '500',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  },
  CodemiaLogo: {
    width: '130px',
    margin: '0 auto 4px auto',
    display: 'block',
    color: '#8B5CF6',
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