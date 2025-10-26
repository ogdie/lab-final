import { useState, useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import { authAPI } from '../services/api';

export default function Home() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/home';
    }
  }, []);

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.login(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      window.location.href = '/home';
    } catch (error) {
      alert('Erro ao fazer login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.register(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      window.location.href = '/home';
    } catch (error) {
      alert('Erro ao fazer registro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>CodeConnect</h1>
      <p style={styles.subtitle}>Rede social para estudantes de programação</p>
      
      {loading ? (
        <div style={styles.loading}>Carregando...</div>
      ) : (
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem'
  },
  title: {
    fontSize: '3rem',
    color: 'white',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  loading: {
    color: 'white',
    fontSize: '1.2rem'
  }
};
