export default function SettingsForm({ user, onSave }) {
  const [formData, setFormData] = useState({
    language: user?.language || 'pt',
    theme: user?.theme || 'light'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Configurações</h2>
      
      <div style={styles.field}>
        <label style={styles.label}>Idioma</label>
        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="pt">Português</option>
          <option value="en">English</option>
        </select>
      </div>
      
      <div style={styles.field}>
        <label style={styles.label}>Tema</label>
        <select
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
        </select>
      </div>
      
      <button type="submit" style={styles.button}>
        Salvar Configurações
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#333'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    background: 'white'
  },
  button: {
    padding: '0.75rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

