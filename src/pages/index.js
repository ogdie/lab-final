import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import AlertModal from '../components/ui/AlertModal';
import { authAPI } from '../services/api';
import { handleOAuthCallback, checkOAuthError } from '../utils/auth';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: '', title: 'Aviso' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const resetAnimationCallbackRef = useRef(null);

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
    // Resetar animação do botão quando o modal de erro fechar
    if (resetAnimationCallbackRef.current && typeof resetAnimationCallbackRef.current === 'function') {
      resetAnimationCallbackRef.current();
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/home');
  };

  return (
    <div style={styles.container}>
      <div style={styles.formOverlay}>
        {loading ? (
          <div style={styles.loading}>Carregando...</div>
        ) : isLogin ? (
          <LoginForm 
            onLogin={handleLogin}
            onErrorReset={(fn) => { resetAnimationCallbackRef.current = fn; }}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm 
            onRegister={handleRegister}
            onErrorReset={(fn) => { resetAnimationCallbackRef.current = fn; }}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>

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
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    backgroundImage: 'url("/bk.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  formOverlay: {
    position: 'fixed',
    top: '50%',
    right: '-3%',
    transform: 'translateY(-50%)',
    width: '460px',
    maxWidth: '90vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  loading: {
    color: 'white',
    fontSize: '1.2rem',
  },
};