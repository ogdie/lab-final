import { useRouter } from 'next/navigation';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export default function BackButton({ to = '/forum', style = {}, onClick }) {
  const router = useRouter();
  const { theme, t, language } = useThemeLanguage();
  const isDark = theme === 'dark';

  const styles = {
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderRadius: '8px',
      border: `1px solid ${isDark ? '#3e4042' : '#d1d1d1'}`,
      background: isDark ? '#2c2f33' : '#ffffff',
      color: isDark ? '#e4e6eb' : '#1d2129',
      cursor: 'pointer',
      fontWeight: 600,
      textDecoration: 'none',
      boxShadow: '0 0 0 1px rgb(0 0 0 / 6%)',
      ...style,
    },
  };

  const label = language === 'pt' ? 'Voltar' : 'Back';

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
      return;
    }
    router.push(to);
  };

  return (
    <button onClick={handleClick} style={styles.button}>
      ← {label}
    </button>
  );
}


