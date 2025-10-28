import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SettingsForm from '../components/SettingsForm';
import EditProfileModal from '../components/EditProfileModal';
import { usersAPI } from '../services/api';

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    let parsedUser = null;
    try {
      parsedUser = userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Invalid user data in localStorage:', e);
    }

    if (!token || !parsedUser?._id) {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleSaveSettings = async (settingsData) => {
    if (!user?._id) return;
    try {
      await usersAPI.updateSettings(user._id, settingsData);
      // Opcional: atualizar estado local se SettingsForm depender de `user`
      alert('Configurações salvas!');
    } catch (err) {
      alert('Erro ao salvar: ' + (err.message || 'Erro desconhecido'));
    }
  };

  const handleEditProfile = async (profileData) => {
    if (!user?._id) return;
    try {
      const updatedUser = await usersAPI.editProfile(user._id, profileData);
      if (updatedUser?._id) {
        setUser(updatedUser); // Atualiza o estado com os dados mais recentes
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      alert('Perfil atualizado!');
    } catch (err) {
      alert('Erro ao atualizar: ' + (err.message || 'Erro desconhecido'));
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.content}>
          <p style={styles.loading}>Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.content}>
          <p style={styles.error}>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <Navbar user={user} />
        <div style={styles.content}>
          <p style={styles.error}>Usuário não carregado.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar user={user} />

      <div style={styles.content}>
        <h1>Configurações</h1>

        <div style={styles.section}>
          <h2>Preferências</h2>
          <SettingsForm user={user} onSave={handleSaveSettings} />
        </div>

        <div style={styles.section}>
          <h2>Perfil</h2>
          <button onClick={() => setShowEditModal(true)} style={styles.button}>
            ✏️ Editar Perfil
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        user={user}
        onSave={handleEditProfile}
      />

      <Footer />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    flex: 1,
  },
  section: {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '2rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#d32f2f',
  },
};