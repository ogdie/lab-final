import { ThemeLanguageProvider } from '../context/ThemeLanguageContext'; 
import '../styles/globals.css'; 

function MyApp({ Component, pageProps }) {
  return (
    
    <ThemeLanguageProvider>
      <Component {...pageProps} />
    </ThemeLanguageProvider>
  );
}

export default MyApp;