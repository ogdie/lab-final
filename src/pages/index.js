import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../components/AuthForm';
import AlertModal from '../components/ui/AlertModal';
import { authAPI } from '../services/api';
import { handleOAuthCallback, checkOAuthError } from '../utils/auth';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: '', title: 'Aviso' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Check for OAuth callback
    const oauthResult = handleOAuthCallback();
    if (oauthResult) {
      // Store user data and redirect to home
      localStorage.setItem('user', JSON.stringify(oauthResult.user));
      router.push('/home');
      return;
    }

    // Check for OAuth error
    const oauthError = checkOAuthError();
    if (oauthError) {
      setAlert({ isOpen: true, message: oauthError, title: 'Erro de Autenticação' });
      return;
    }

    // Regular token check
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/home');
    }
  }, [router]);

  const handleLogin = async (data) => {
    if (!data.email?.trim() || !data.password?.trim()) {
      setAlert({ isOpen: true, message: 'Preencha todos os campos.', title: 'Campos inválidos' });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(data);

      const userId = response?.user?._id || response?.user?.id;
      if (!response?.token || !userId) {
        throw new Error('Resposta inválida do servidor.');
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({ ...response.user, _id: userId }));
      router.push('/home');
    } catch (error) {
      let message = error.message || 'Erro desconhecido.';
      let title = 'Erro ao fazer login';

      if (message.includes('Senha incorreta')) {
        message = 'Senha incorreta.';
      } else if (
        message.includes('Usuário não cadastrado') ||
        message.includes('não encontrado') ||
        message.includes('User not found')
      ) {
        message = 'Usuário não cadastrado.';
        title = 'Usuário não encontrado';
      }

      setAlert({ isOpen: true, message, title });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    if (!data.name?.trim() || !data.email?.trim() || !data.password?.trim()) {
      setAlert({ isOpen: true, message: 'Preencha todos os campos.', title: 'Campos inválidos' });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register(data);

      const userId = response?.user?._id || response?.user?.id;
      if (!response?.token || !userId) {
        throw new Error('Resposta inválida do servidor.');
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({ ...response.user, _id: userId }));
      
      // Mostrar modal de sucesso antes de redirecionar
      setShowSuccessModal(true);
    } catch (error) {
      let message = error.message || 'Erro desconhecido.';
      let title = 'Erro ao se cadastrar';

      if (
        message.includes('Email já cadastrado') ||
        message.includes('já está cadastrado') ||
        message.includes('already exists')
      ) {
        message = 'Este email já está cadastrado.';
        title = 'Email em uso';
      }

      setAlert({ isOpen: true, message, title });
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, message: '', title: 'Aviso' });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/home');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Codemia</h1>
      <p style={styles.subtitle}>Rede social para estudantes de programação</p>

      {loading ? (
        <div style={styles.loading}>Carregando...</div>
      ) : (
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
      )}

      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        message={alert.message}
        title={alert.title}
      />

      <AlertModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message="Usuário criado ou cadastrado com sucesso!"
        title="Sucesso!"
      />
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
    padding: '2rem',
  },
  title: {
    fontSize: '3rem',
    color: 'white',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  loading: {
    color: 'white',
    fontSize: '1.2rem',
  },
};