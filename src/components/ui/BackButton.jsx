import { useRouter } from 'next/navigation';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { FaArrowLeft } from 'react-icons/fa';

export default function BackButton({ to = '/forum', style = {}, onClick }) {
  const router = useRouter();
  const { theme, t, language } = useThemeLanguage();
  const isDark = theme === 'dark';

  const styles = {
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      background: 'none',
      border: 'none',
      color: '#8B5CF6',
      cursor: 'pointer',
      fontSize: '1.5rem',
      transition: 'color 0.2s',
      ...style,
    },
  };

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
      return;
    }
    router.push(to);
  };

  return (
    <button onClick={handleClick} style={styles.button}>
      <FaArrowLeft />
    </button>
  );
}


