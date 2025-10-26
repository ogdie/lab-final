export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h4 style={styles.title}>CodeConnect</h4>
          <p style={styles.text}>Rede social para estudantes de programação</p>
        </div>
        
        <div style={styles.section}>
          <h4 style={styles.title}>Links</h4>
          <a href="/about" style={styles.link}>Sobre</a>
          <a href="/contact" style={styles.link}>Contato</a>
          <a href="/terms" style={styles.link}>Termos</a>
        </div>
        
        <div style={styles.section}>
          <h4 style={styles.title}>Suporte</h4>
          <a href="/help" style={styles.link}>Ajuda</a>
          <a href="/privacy" style={styles.link}>Privacidade</a>
          <a href="/faq" style={styles.link}>FAQ</a>
        </div>
        
        <div style={styles.section}>
          <h4 style={styles.title}>Redes Sociais</h4>
          <div style={styles.social}>
            <a href="#" style={styles.socialLink}>📘</a>
            <a href="#" style={styles.socialLink}>🐦</a>
            <a href="#" style={styles.socialLink}>📷</a>
          </div>
        </div>
      </div>
      
      <div style={styles.copyright}>
        <p>© 2024 CodeConnect. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '2rem 0',
    marginTop: 'auto'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  title: {
    marginBottom: '1rem',
    fontSize: '1.1rem'
  },
  text: {
    color: '#ccc',
    fontSize: '0.9rem'
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    marginBottom: '0.5rem',
    display: 'block',
    fontSize: '0.9rem',
    transition: 'color 0.3s'
  },
  social: {
    display: 'flex',
    gap: '1rem'
  },
  socialLink: {
    fontSize: '1.5rem',
    textDecoration: 'none'
  },
  copyright: {
    textAlign: 'center',
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #555',
    color: '#ccc',
    fontSize: '0.9rem'
  }
};

