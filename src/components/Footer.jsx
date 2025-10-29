export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>© 2025 Codemia. Todos os direitos reservados.</div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    marginTop: 'auto',
    borderTop: '1px solid #555',
    width: '100%',
    position: 'relative',
    zIndex: 11, 
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
    textAlign: 'center',
    color: '#ccc',
    fontSize: '0.9rem',
  },
};
