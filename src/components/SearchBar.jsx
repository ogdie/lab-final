import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Buscar posts e usuários..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        <FaSearch />
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    width: '100%',
    maxWidth: '600px'
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px',
    fontSize: '1rem'
  },
  button: {
    padding: '0.75rem 1.5rem',
    background: '#8B5CF6',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: '1.2rem'
  }
};

