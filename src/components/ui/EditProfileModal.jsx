import { useState, useEffect } from 'react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import ImageUpload from './ImageUpload';

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

const USER_TYPES = ["Estudante", "Professor", "Recrutador"];

// --- Função de Estilo Dinâmico (getStyles) ---
// Note que agora ele recebe o tema (theme) como argumento
const getStyles = (theme) => {
    const isDark = theme === 'dark';
    // Paleta de cores LinkedIn-like/Dark Mode
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    const textSecondary = isDark ? '#b0b3b8' : '#606770';
    const backgroundModal = isDark ? '#242526' : 'white';
    const borderInput = isDark ? '#3e4042' : '#ddd';
    const blueAction = '#8B5CF6'; // Azul de ação principal (Salvar)
    const purpleBorder = '#8B5CF6';
    const grayCancel = isDark ? '#474a4d' : '#e7e7e7'; // Cinza de cancelamento

    return {
        // Overlay (fundo escuro semi-transparente)
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        },
        // Container do Modal
        modal: {
            background: backgroundModal,
            borderRadius: '10px', // Mais arredondado, estilo moderno
            padding: '2rem',
            maxWidth: '550px', // Mais largura para conteúdo profissional
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)', // Sombra profissional
            border: `1px solid ${purpleBorder}`,
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: textPrimary,
            borderBottom: `1px solid ${borderInput}`,
            paddingBottom: '0.5rem',
            textAlign: 'left', // Alinhamento à esquerda, estilo LinkedIn
        },
        field: {
            marginBottom: '1.25rem',
        },
        label: {
            display: 'block',
            marginBottom: '0.4rem',
            fontWeight: '500',
            color: textSecondary,
            fontSize: '0.9rem',
        },
        input: {
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${borderInput}`,
            borderRadius: '6px',
            fontSize: '1rem',
            backgroundColor: backgroundModal,
            color: textPrimary,
            transition: 'border-color 0.2s',
            boxSizing: 'border-box',
        },
        textarea: {
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${borderInput}`,
            borderRadius: '6px',
            fontSize: '1rem',
            resize: 'vertical',
            backgroundColor: backgroundModal,
            color: textPrimary,
            boxSizing: 'border-box',
        },
        actions: {
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem',
        },
        // Botão de Cancelar (Cinza/Neutro)
        cancelButton: {
            padding: '0.6rem 1.2rem',
            background: grayCancel,
            color: isDark ? textPrimary : '#333',
            border: isDark ? `1px solid ${borderInput}` : 'none',
            borderRadius: '24px', // Borda arredondada
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background 0.2s',
        },
        // Botão de Salvar (Azul Principal)
        saveButton: {
            padding: '0.6rem 1.2rem',
            background: blueAction,
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background 0.2s',
        }
    };
};
// --- FIM da Função de Estilo Dinâmico ---


export default function EditProfileModal({ isOpen, onClose, user, onSave, theme = 'light' }) {
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        profilePicture: '',
        institution: INSTITUTIONS[0],
        userType: USER_TYPES[0]
    });
    
    // Obter estilos dinâmicos baseados no tema
    const styles = getStyles(theme);
    const { t } = useThemeLanguage();

    // Carrega os dados do usuário quando o modal abre ou o usuário muda
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                profilePicture: user.profilePicture || '',
                institution: user.institution || INSTITUTIONS[0],
                userType: user.userType || USER_TYPES[0]
            });
        }
    }, [user, isOpen]); // Adicionado 'isOpen' para garantir que os dados sejam redefinidos quando o modal é aberto

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) {
            onSave(formData);
        }
        onClose();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        // Oculta o modal clicando no overlay, mas não no modal em si
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 style={styles.title}>{t('edit_profile')}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>{t('name')}</label>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <div style={styles.field}>
                        <label style={styles.label}>{t('bio_label')}</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            style={styles.textarea}
                            rows={4}
                            placeholder={t('bio_placeholder')}
                        />
                    </div>
                    
                    <div style={styles.field}>
                        <ImageUpload
                            value={formData.profilePicture}
                            onChange={(value) => setFormData({ ...formData, profilePicture: value })}
                            placeholder={t('select_profile_picture')}
                            theme={theme}
                        />
                        {!formData.profilePicture && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: styles.label.color }}>
                                Ou{' '}
                                <input
                                    name="profilePicture"
                                    type="url"
                                    value={formData.profilePicture}
                                    onChange={handleChange}
                                    style={{
                                        ...styles.input,
                                        marginTop: '0.5rem',
                                        fontSize: '0.85rem',
                                        padding: '0.5rem'
                                    }}
                                    placeholder={t('example_url') || 'Cole uma URL de imagem'}
                                />
                            </div>
                        )}
                    </div>
                    
                    <div style={styles.field}>
                        <label style={styles.label}>{t('user_type')}</label>
                        <select
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            {USER_TYPES.map((opt) => {
                                const translationKey = opt === 'Estudante' ? 'user_type_student' : 
                                                       opt === 'Professor' ? 'user_type_professor' : 
                                                       opt === 'Recrutador' ? 'user_type_recruiter' : opt;
                                return <option key={opt} value={opt}>{t(translationKey)}</option>;
                            })}
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>{t('institution')}</label>
                        <select
                            name="institution"
                            value={formData.institution}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            {INSTITUTIONS.map((inst) => (
                                <option key={inst} value={inst}>
                                    {inst === 'Outros' ? t('institution_others') : inst}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.actions}>
                        <button type="button" onClick={onClose} style={styles.cancelButton}>
                            {t('cancel')}
                        </button>
                        <button type="submit" style={styles.saveButton}>
                            {t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}