import { useState } from 'react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

const articles = [
  {
    id: 1,
    title: {
      pt: "Linguagens de Programação para Sistemas de Computador",
      en: "Programming Languages for Computer Systems"
    },
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
    institution: "ACM Digital Library",
    url: "https://dl.acm.org/doi/10.1145/3001878.3001880?utm_source=chatgpt.com"
  },
  {
    id: 2,
    title: {
      pt: "Anais da ACM sobre Linguagens de Programação",
      en: "Proceedings of the ACM on Programming Languages"
    },
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    institution: "ACM",
    url: "https://pacmpl.acm.org"
  },
  {
    id: 3,
    title: {
      pt: "Pesquisa sobre Desenvolvimento Sustentável",
      en: "Sustainable Development Research"
    },
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
    institution: "MDPI",
    url: "https://www.mdpi.com/2071-1050/13/6/3293?utm_source=chatgpt.com"
  },
  {
    id: 4,
    title: {
      pt: "O uso do Framework Laravel como ferramenta na aprendizagem de programação web",
      en: "The use of Laravel Framework as a tool in web programming learning"
    },
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    institution: "Atena Editora",
    url: "https://atenaeditora.com.br/catalogo/post/o-uso-do-framework-laravel-como-ferramenta-na-aprendizagem-de-programacao-web-uma-abordagem-baseada-em-problemas?utm_source=chatgpt.com"
  },
  {
    id: 5,
    title: {
      pt: "Linguagens Front-End: Guia Completo",
      en: "Front-End Languages: Complete Guide"
    },
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=250&fit=crop",
    institution: "Softdesign",
    url: "https://softdesign.com.br/blog/linguagens-front-end/?utm_source=chatgpt.com"
  }
];

export default function ArticlesSidebar({ theme }) {
  const { t, language } = useThemeLanguage();
  const isDark = theme === 'dark';
  const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
  const textSecondary = isDark ? '#b0b3b8' : '#606770';
  const backgroundCard = isDark ? '#2c2f33' : '#ffffff';
  const borderSubtle = isDark ? '#3e4042' : '#d1d1d1';
  const purpleBorder = '#8B5CF6';
  const linkedInShadow = "0 0 0 1px rgb(0 0 0 / 15%), 0 2px 3px rgb(0 0 0 / 20%)";

  const styles = {
    sidebar: {
      position: 'sticky',
      top: '72px',
      width: '300px',
      flexShrink: 0,
      background: backgroundCard,
      borderRadius: '12px',
      boxShadow: linkedInShadow,
      border: `1px solid ${purpleBorder}`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10,
    },
    header: {
      padding: '16px',
      borderBottom: `1px solid ${borderSubtle}`,
    },
    title: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: textPrimary,
      margin: 0,
    },
    articlesList: {
      display: 'flex',
      flexDirection: 'column',
      padding: '8px',
    },
    articleItem: {
      display: 'flex',
      flexDirection: 'column',
      padding: '12px',
      marginBottom: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background 0.2s',
      textDecoration: 'none',
      color: 'inherit',
    },
    articleImage: {
      width: '100%',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '8px',
      backgroundColor: isDark ? '#3e4042' : '#f3f2ef',
      display: 'block',
    },
    articleImagePlaceholder: {
      width: '100%',
      height: '120px',
      borderRadius: '8px',
      marginBottom: '8px',
      backgroundColor: isDark ? '#3e4042' : '#e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: textSecondary,
      fontSize: '0.8rem',
    },
    articleTitle: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: textPrimary,
      margin: '0 0 6px 0',
      lineHeight: '1.3',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    articleInstitution: {
      fontSize: '0.8rem',
      color: textSecondary,
      margin: 0,
    },
  };

  // Componente interno para cada artigo com tratamento de erro de imagem
  const ArticleItem = ({ article, styles, isDark, language }) => {
    const [imageError, setImageError] = useState(false);
    const articleTitle = typeof article.title === 'object' 
      ? article.title[language] || article.title.en 
      : article.title;

    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.articleItem}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isDark ? '#3e4042' : '#f3f2ef';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {imageError ? (
          <div style={styles.articleImagePlaceholder}>
            {article.institution}
          </div>
        ) : (
          <img
            src={article.image}
            alt={articleTitle}
            style={styles.articleImage}
            onError={() => setImageError(true)}
          />
        )}
        <h4 style={styles.articleTitle}>{articleTitle}</h4>
        <p style={styles.articleInstitution}>{article.institution}</p>
      </a>
    );
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          {language === 'pt' ? 'TOP ARTIGOS PARA VOCÊ' : 'TOP ARTICLES FOR YOU'}
        </h3>
      </div>
      <div style={styles.articlesList}>
        {articles.map((article) => (
          <ArticleItem
            key={article.id}
            article={article}
            styles={styles}
            isDark={isDark}
            language={language}
          />
        ))}
      </div>
    </aside>
  );
}

