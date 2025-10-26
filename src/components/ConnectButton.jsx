export default function ConnectButton({ userId, currentUser, onConnect }) {
  const isConnected = currentUser?.connections?.includes(userId);

  const handleConnect = () => {
    if (onConnect) {
      onConnect(userId);
    }
  };

  if (isConnected) {
    return (
      <button style={styles.connectedButton} disabled>
        Conectado
      </button>
    );
  }

  return (
    <button 
      onClick={handleConnect}
      style={styles.connectButton}
    >
      Conectar
    </button>
  );
}

const styles = {
  connectButton: {
    padding: '0.5rem 1rem',
    background: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  connectedButton: {
    padding: '0.5rem 1rem',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    opacity: 0.7
  }
};

