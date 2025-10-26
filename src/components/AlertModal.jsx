import { useState } from 'react';

export default function AlertModal({ isOpen, onClose, message, title = 'Aviso' }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <button onClick={onClose} style={styles.button}>
          Fechar
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modal: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#333'
  },
  message: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '1.5rem',
    lineHeight: '1.5'
  },
  button: {
    padding: '0.75rem 1.5rem',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%'
  }
};

