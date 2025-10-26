import { useState, useEffect } from 'react';

export default function ConnectionNotification({ userId, onClose }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/connections/requests?userId=${userId}`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching connection requests:', err);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await fetch(`/api/connections/${requestId}/accept`, { method: 'PUT' });
      fetchRequests();
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await fetch(`/api/connections/${requestId}/decline`, { method: 'PUT' });
      fetchRequests();
    } catch (err) {
      console.error('Error declining request:', err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>Solicitações de Conexão</h3>
        <button onClick={onClose} style={styles.closeButton}>✖</button>
      </div>
      
      <div style={styles.list}>
        {requests.length === 0 ? (
          <p style={styles.empty}>Nenhuma solicitação pendente</p>
        ) : (
          requests.map((request) => (
            <div key={request._id} style={styles.item}>
              <img 
                src={request.from?.profilePicture || '/default-avatar.svg'} 
                alt={request.from?.name}
                style={styles.avatar}
              />
              <div style={styles.info}>
                <p style={styles.name}>{request.from?.name}</p>
                <p style={styles.email}>{request.from?.email}</p>
              </div>
              <div style={styles.actions}>
                <button 
                  onClick={() => handleAccept(request._id)}
                  style={styles.acceptButton}
                >
                  Aceitar
                </button>
                <button 
                  onClick={() => handleDecline(request._id)}
                  style={styles.declineButton}
                >
                  Recusar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: '60px',
    right: '1rem',
    width: '400px',
    maxHeight: '500px',
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 1000,
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0',
    background: '#f8f9fa'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  list: {
    maxHeight: '400px',
    overflowY: 'auto'
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  info: {
    flex: 1
  },
  name: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  email: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#666'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem'
  },
  acceptButton: {
    padding: '0.5rem 1rem',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem'
  },
  declineButton: {
    padding: '0.5rem 1rem',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem'
  }
};

