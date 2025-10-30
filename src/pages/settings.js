import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeLanguage } from '../context/ThemeLanguageContext'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditProfileModal from '../components/EditProfileModal';
import AlertModal from '../components/AlertModal';
import { usersAPI } from '../services/api';

// --- Função de Estilo (getStyles) ---

const getStyles = (theme) => {
    const isDark = theme === 'dark';
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    const textSecondary = isDark ? '#b0b3b8' : '#606770';
    const backgroundPrimary = isDark ? '#18191a' : '#f0f2f5';
    const backgroundCard = isDark ? '#242526' : 'white';
    const borderSubtle = isDark ? '#3e4042' : '#e0e0e0';
    const blueAction = '#0a66c2';

    return {
        // --- Layout Geral ---
        container: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: backgroundPrimary,
        },
        content: {
            maxWidth: '900px',
            margin: '0 auto',
            padding: '1rem 0',
            flex: 1,
            display: 'flex',
            gap: '1.5rem',
            width: '100%',
        },
        mainContent: {
            flex: 3, 
            minWidth: 0,
            padding: '0 1rem',
        },
        pageTitle: {
            fontSize: '1.75rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: textPrimary,
        },

        // --- Seções de Conteúdo (Cards) ---
        section: {
            background: backgroundCard,
            border: `1px solid ${borderSubtle}`,
            borderRadius: '8px',
            padding: '1.5rem 2rem', 
            marginBottom: '1.5rem',
            boxShadow: '0 0 0 1px rgba(0,0,0,.15), 0 2px 3px rgba(0,0,0,.2)',
        },
        sectionTitle: {
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: textPrimary,
            borderBottom: `1px solid ${borderSubtle}`,
            paddingBottom: '0.75rem',
        },

        // --- Elementos de Interação (Tema/Idioma) ---
        preferenceGroup: {
            marginBottom: '1rem',
            padding: '0.5rem 0',
        },
        label: {
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '400',
            color: textSecondary,
            fontSize: '0.9rem',
        },
        radioGroup: {
            display: 'flex',
            gap: '2rem',
        },
        radioLabel: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: textPrimary,
            cursor: 'pointer',
            fontWeight: '500',
        },
        radio: {
            cursor: 'pointer',
        },
        button: {
            padding: '0.5rem 1rem',
            background: blueAction,
            color: 'white',
            border: 'none',
            borderRadius: '24px', 
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'background 0.2s',
            outline: 'none',
        },
        loading: {
            textAlign: 'center',
            padding: '2rem',
            fontSize: '1.2rem',
            color: textPrimary,
        },
    };
};


export default function Settings() {
    const router = useRouter();
    const { theme, setTheme, language, setLanguage } = useThemeLanguage();
    
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ isOpen: false, message: '', title: 'Aviso' });
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    
    
    const translations = {
        pt: {
            settings: 'Configurações',
            account: 'Configurações da Conta',
            profile: 'Perfil',
            editProfile: '✏️ Editar Perfil',
            theme: 'Tema',
            light: 'Claro',
            dark: 'Escuro',
            language: 'Idioma',
            portuguese: 'Português',
            english: 'Inglês',
            saveSuccess: 'Configurações salvas!',
            profileUpdateSuccess: 'Perfil atualizado!',
            profileAdjust: 'Ajuste seu nome, título, resumo e outras informações públicas do perfil.',
            loading: 'Carregando...',
            searchResults: 'Resultados da busca',
            noUsersFound: 'Nenhum usuário encontrado',
            close: 'Fechar',
        },
        en: {
            settings: 'Settings',
            account: 'Account Settings',
            profile: 'Profile',
            editProfile: '✏️ Edit Profile',
            theme: 'Theme',
            light: 'Light',
            dark: 'Dark',
            language: 'Language',
            portuguese: 'Portuguese',
            english: 'English',
            saveSuccess: 'Settings saved!',
            profileUpdateSuccess: 'Profile updated!',
            profileAdjust: 'Adjust your name, title, summary and other public profile info.',
            loading: 'Loading...',
            searchResults: 'Search results',
            noUsersFound: 'No users found',
            close: 'Close',
        }
    };

    const t = useCallback((key) => translations[language]?.[key] || key, [language]);
    const showAlert = useCallback(({ message, title }) => { setAlert({ isOpen: true, message, title }); }, []);
    const closeAlert = useCallback(() => { setAlert({ isOpen: false, message: '', title: 'Aviso' }); }, []);

    const handleSearch = useCallback(async (query) => {
        if (!query?.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        try {
            const users = await usersAPI.searchUsers(query);
            setSearchResults(Array.isArray(users) ? users : []);
            setShowSearchResults(true);
        } catch (err) {
            console.error('Error searching users:', err);
            setSearchResults([]);
        }
    }, []);

    const handleCloseSearch = useCallback(() => {
        setShowSearchResults(false);
        setSearchResults([]);
    }, []);
    
    // Carrega usuário e verifica autenticação (Lógica inalterada)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!token || !userData) { router.push('/'); return; }
        
        let parsedUser = null;
        try { parsedUser = JSON.parse(userData); } catch (e) { router.push('/'); return; }

        if (!parsedUser?._id) { router.push('/'); return; }
        setUser(parsedUser);
        setLoading(false);
    }, [router]);

        
    const handleEditProfile = useCallback(async (profileData) => {
        if (!user?._id) return;
        try {
            
            showAlert({ message: t('profileUpdateSuccess'), title: 'Sucesso!' });
        } catch (err) {
            showAlert({ message: 'Erro ao atualizar: ' + (err.message || 'Erro desconhecido'), title: 'Erro' });
        }
    }, [user, showAlert, t]);

    
    const styles = getStyles(theme);

    if (loading) {
        return (
            <div style={styles.container}>
                <Navbar 
                  user={user} 
                  onSearch={handleSearch}
                />
                <div style={styles.content}>
                    <div style={styles.mainContent}>
                        <p style={styles.loading}>{t('loading')}</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Navbar 
              user={user} 
              onSearch={handleSearch}
            />

            {showSearchResults && (
                <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', zIndex: 1000, width: '90%', maxWidth: '500px', maxHeight: '400px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e0e0e0', background: '#f8f9fa' }}>
                        <h3>{t('searchResults')}</h3>
                        <button onClick={handleCloseSearch} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}>
                            ✖
                        </button>
                    </div>
                    {searchResults.length === 0 ? (
                        <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>{t('noUsersFound')}</p>
                    ) : (
                        searchResults.map((userResult) => (
                            <div key={userResult._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                                <img
                                    src={userResult.profilePicture || '/default-avatar.svg'}
                                    alt={userResult.name || 'Usuário'}
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h4>{userResult.name || 'Nome indisponível'}</h4>
                                    <p>{userResult.email || 'Email indisponível'}</p>
                                    <p>⭐ {userResult.xp || 0} XP</p>
                                </div>
                                <button
                                    onClick={() => router.push(`/profile?id=${userResult._id}`)}
                                    style={{ padding: '0.5rem 1rem', background: '#1877f2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}
                                >
                                    Ver Perfil
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            <div style={styles.content}>
                <div style={styles.mainContent}> 
                    <h1 style={styles.pageTitle}>{t('settings')}</h1>

                    {/* --- SEÇÃO 1: CONFIGURAÇÕES DA CONTA (TEMA E IDIOMA) --- */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>{t('account')}</h2>
                        
                        {/* Opção TEMA - Agora chama setTheme() do contexto */}
                        <div style={styles.preferenceGroup}>
                            <label style={styles.label}>{t('theme')}</label>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="theme"
                                        checked={theme === 'light'}
                                        onChange={() => setTheme('light')} // CHAMA A FUNÇÃO GLOBAL
                                        style={styles.radio}
                                    />
                                    {t('light')}
                                </label>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="theme"
                                        checked={theme === 'dark'}
                                        onChange={() => setTheme('dark')} // CHAMA A FUNÇÃO GLOBAL
                                        style={styles.radio}
                                    />
                                    {t('dark')}
                                </label>
                            </div>
                        </div>

                        {/* Opção IDIOMA - Agora chama setLanguage() do contexto */}
                        <div style={styles.preferenceGroup}>
                            <label style={styles.label}>{t('language')}</label>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="language"
                                        checked={language === 'pt'}
                                        onChange={() => setLanguage('pt')} // CHAMA A FUNÇÃO GLOBAL
                                        style={styles.radio}
                                    />
                                    {t('portuguese')}
                                </label>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="language"
                                        checked={language === 'en'}
                                        onChange={() => setLanguage('en')} // CHAMA A FUNÇÃO GLOBAL
                                        style={styles.radio}
                                    />
                                    {t('english')}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* --- SEÇÃO 2: EDIÇÃO DE PERFIL --- */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>{t('profile')}</h2>
                        <p style={{ color: styles.textSecondary, marginBottom: '1rem' }}>
                            {t('profileAdjust')}
                        </p>
                        <button 
                            onClick={() => setShowEditModal(true)}
                            style={styles.button}
                        >
                            {t('editProfile')}
                        </button>
                    </div>
                </div>

            </div>

            <EditProfileModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                user={user}
                onSave={handleEditProfile}
                theme={theme} 
            />

            <AlertModal
                isOpen={alert.isOpen}
                onClose={closeAlert}
                message={alert.message}
                title={alert.title}
            />

            <Footer />
        </div>
    );
}