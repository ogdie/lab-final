import { useState, useMemo } from 'react';

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

export default function AuthForm({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'Estudante',
    institution: INSTITUTIONS[0],
    birthDate: ''
  });
  const [error, setError] = useState('');

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
    e.preventDefault();
    setError('');
    const data = normalize(formData);

    if (isLogin) {
      return onLogin({ email: data.email, password: data.password });
    }

    const err = validateRegister(data);
    if (err) {
      setError(err);
      return;
    }

    onRegister({
      name: data.name,
      email: data.email,
      password: data.password,
      userType: data.userType,
      institution: data.institution,
      birthDate: data.birthDate
    });
  };

  const handleOAuthLogin = (provider) => {
    if (provider === 'google') {
      window.location.href = '/api/auth/google';
    } else if (provider === 'github') {
      window.location.href = '/api/auth/github';
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>{isLogin ? 'Login' : 'Cadastro'}</h2>

      {!!error && <div style={styles.error}>{error}</div>}

      {!isLogin && (
        <input
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
      )}

      <input
        name="email"
        type="email"
        placeholder="Email"
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

      {!isLogin && (
        <>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Estudante">Estudante</option>
            <option value="Professor">Professor</option>
            <option value="Recrutador">Recrutador</option>
          </select>

          <select
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            style={styles.input}
            required
          >
            {INSTITUTIONS.map((inst) => (
              <option key={inst} value={inst}>{inst}</option>
            ))}
          </select>

          <input
            name="birthDate"
            type="date"
            placeholder="Data de Nascimento"
            value={formData.birthDate}
            onChange={handleChange}
            required
            style={styles.input}
            min={minBirth}
            max={todayStr}
          />
        </>
      )}

      <button type="submit" style={styles.button}>
        {isLogin ? 'Entrar' : 'Cadastrar'}
      </button>

      {isLogin && (
        <>
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>ou continue com</span>
            <div style={styles.dividerLine}></div>
          </div>
          <div style={styles.oauthContainer}>
            <button type="button" onClick={() => handleOAuthLogin('google')} style={styles.googleButton}>
              <span style={styles.oauthIcon}>📧</span>
              Gmail
            </button>
            <button type="button" onClick={() => handleOAuthLogin('github')} style={styles.githubButton}>
              <span style={styles.oauthIcon}>🐙</span>
              GitHub
            </button>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => {
          setIsLogin(!isLogin);
          setError('');
        }}
        style={styles.toggleButton}
      >
        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  button: {
    padding: '0.75rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#2196F3',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '1rem 0',
    fontSize: '0.9rem',
    color: '#666'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#ddd'
  },
  dividerText: {
    padding: '0 1rem',
    whiteSpace: 'nowrap'
  },
  oauthContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  googleButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: '#db4437',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  githubButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  oauthIcon: {
    fontSize: '1.1rem'
  },
  error: {
    background: '#fdecea',
    color: '#b71c1c',
    border: '1px solid #f5c6cb',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.9rem'
  }
};
