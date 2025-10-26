import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SettingsForm from '../components/SettingsForm';
import EditProfileModal from '../components/EditProfileModal';
import { usersAPI } from '../services/api';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/';
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  }, []);

  const handleSaveSettings = async (settingsData) => {
    try {
      await usersAPI.updateSettings(user._id, settingsData);
      alert('Configurações salvas!');
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    }
  };

  const handleEditProfile = async (profileData) => {
    try {
      await usersAPI.editProfile(user._id, profileData);
      alert('Perfil atualizado!');
    } catch (err) {
      alert('Erro ao atualizar: ' + err.message);
    }
  };

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
          <button 
            onClick={() => setShowEditModal(true)}
            style={styles.button}
          >
            ✏️ Editar Perfil
          </button>
        </div>
      </div>
      
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
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
    flexDirection: 'column'
  },
  content: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    flex: 1
  },
  section: {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '2rem',
    marginBottom: '2rem'
  },
  field: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical'
  },
  button: {
    padding: '0.75rem 1.5rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};

